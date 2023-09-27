import { createColumnHelper, flexRender, getCoreRowModel, getPaginationRowModel, useReactTable } from "@tanstack/react-table"
import { ChangeEvent, FormEvent, useEffect, useMemo, useState } from "react"
import { Button, Container, Form, Modal, Pagination, Table } from "react-bootstrap"
import { useProductService } from "../hooks/useProductService"
import { Product, ProductParam } from "../models/ProductReqResp"


export const AdminProducts = () => {
    const productService = useProductService()

    const [data, setData] = useState<Product[]>([])
    const [showCreateModal, setShowCreateModal] = useState(false)
    const [selectedUpdateId, setSelectedUpdateId] = useState<string>("")

    const refreshData = async () => {
        const products = await productService.getAll()
        setData(products)
    }

    const handleCreateSubmit = async (req: ProductParam) => {
        await productService.create(req)
        await refreshData()
        setShowCreateModal(false)
    }

    const handleUpdateSubmit = async (req: ProductParam) => {
        await productService.update(selectedUpdateId, req)
        await refreshData()
        setSelectedUpdateId("")
    }

    const handleDelete = async (productId: string) => {
        await productService.delete(productId)
        await refreshData()
    }

    const rowActions: ProductRowActions = {
        onDelete(productId) {
            handleDelete(productId)
        },
        onEdit(productId) {
            setSelectedUpdateId(productId)
        },
    }

    useEffect(() => {
        refreshData()
    }, [])

    return <Container>
        <h1 className="my-3">Products</h1>
        <Button onClick={() => setShowCreateModal(true)}>Create</Button>
        <ProductTable data={data} rowActions={rowActions} />
        <ProductModal
            show={showCreateModal}
            onCancel={() => setShowCreateModal(false)}
            onSubmit={req => handleCreateSubmit(req)}
        />
        <ProductModal
            key={selectedUpdateId}
            existing={data.find(p => p.id == selectedUpdateId)}
            show={selectedUpdateId != ""}
            onCancel={() => setSelectedUpdateId("")}
            onSubmit={req => handleUpdateSubmit(req)}
        />
    </Container>
}

interface ProductTableProps {
    data: Product[]
    rowActions: ProductRowActions
}

interface ProductRowActions {
    onEdit(productId: string): void
    onDelete(productId: string): void
}

const ProductTable = ({ data, rowActions }: ProductTableProps) => {
    const columns = useMemo(() => [
        columnHelper.accessor('id', {}),
        columnHelper.accessor('productName', {}),
        columnHelper.accessor('description', {}),
        columnHelper.accessor('price', {}),
        columnHelper.display({
            id: 'actions',
            cell: ({ row }) => <span>
                <a className="icon-link me-2" href="#" onClick={() => rowActions.onEdit(row.original.id)}>
                    <i className="bi bi-pencil-square" />
                </a>
                <a className="icon-link" href="#" onClick={() => rowActions.onDelete(row.original.id)}>
                    <i className="bi bi-trash" />
                </a>
            </span>
        })
    ], [rowActions])

    const table = useReactTable<Product>({
        data: data,
        columns: columns,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        initialState: {
            pagination: {
                pageSize: 10
            }
        }
    })

    return (
        <>
            <Table hover>
                <thead>
                    {table.getHeaderGroups().map(headerGroup => (
                        <tr key={headerGroup.id}>
                            {headerGroup.headers.map(header => (
                                <th key={header.id} colSpan={header.colSpan}>
                                    {header.isPlaceholder
                                        ? null
                                        : flexRender(
                                            header.column.columnDef.header,
                                            header.getContext()
                                        )}
                                </th>
                            ))}
                        </tr>
                    ))}
                </thead>
                <tbody>
                    {table.getRowModel().rows.map(row => (
                        <tr key={row.id}>
                            {row.getVisibleCells().map(cell => (
                                <td key={cell.id}>
                                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </Table>
            <Pagination>
                <Pagination.First onClick={() => table.setPageIndex(0)} disabled={!table.getCanPreviousPage()} />
                <Pagination.Prev onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()} />
                <Pagination.Item>{table.getState().pagination.pageIndex + 1}</Pagination.Item>
                <Pagination.Next onClick={() => table.nextPage()} disabled={!table.getCanNextPage()} />
                <Pagination.Last onClick={() => table.setPageIndex(table.getPageCount() - 1)} disabled={!table.getCanNextPage()} />
            </Pagination>
        </>
    )
}

interface ProductModalProps {
    existing?: Product
    show: boolean
    onCancel(): void
    onSubmit(req: ProductParam): void
}

const ProductModal = ({ existing, show, onCancel, onSubmit }: ProductModalProps) => {
    const [formData, setFormData] = useState<ProductParam>(existing || {
        productName: '',
        description: '',
        price: 0
    })

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        onSubmit(formData)
    }

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    return (
        <Modal
            show={show}
            onHide={onCancel}
            size="lg"
            aria-labelledby="contained-modal-title-vcenter"
            centered
        >
            <Form onSubmit={handleSubmit}>
                <Modal.Header closeButton>
                    <Modal.Title id="contained-modal-title-vcenter">
                        {!existing ? 'New Product' : 'Update Product'}
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form.Group className="mb-3" controlId="productName">
                        <Form.Label>Product Name</Form.Label>
                        <Form.Control
                            type="text"
                            name="productName"
                            value={formData.productName}
                            onChange={handleChange}
                            required
                        />
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="password">
                        <Form.Label>Description</Form.Label>
                        <Form.Control
                            type="text"
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            required
                        />
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="price">
                        <Form.Label>Price</Form.Label>
                        <Form.Control
                            type="number"
                            min={0}
                            step={0.01}
                            name="price"
                            value={formData.price}
                            onChange={handleChange}
                            required
                        />
                    </Form.Group>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={onCancel}>Cancel</Button>
                    <Button type="submit">Submit</Button>
                </Modal.Footer>
            </Form>
        </Modal >
    );
}

const columnHelper = createColumnHelper<Product>()

