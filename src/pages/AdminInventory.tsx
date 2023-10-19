import { Button, Container, Form, Modal, Pagination, Table } from "react-bootstrap"
import { ChangeEvent, FormEvent, useEffect, useMemo, useState } from "react"
import { Inventory, InventoryResponse } from "../models/InventoryReqResp"
import { useInventoryService } from "../hooks/useInventoryService"
import { createColumnHelper, flexRender, getCoreRowModel, getPaginationRowModel, useReactTable } from "@tanstack/react-table"

export const AdminInventory = () => {
    const inventoryService = useInventoryService()

    const [data, setData] = useState<InventoryResponse[]>([])
    const [showCreateModal, setShowCreateModal] = useState(false)
    const [showSubtractModal, setShowSubtractModal] = useState(false)

    const refreshData = async () => {
        const inventory = await inventoryService.getAll()
        setData(inventory)
    }

    const handleCreateSubmit = async (req: Inventory) => {
        const reqList = [];
        reqList.push(req)
        // console.log(reqList)
        await inventoryService.addInventory(reqList)
        await refreshData()
        setShowCreateModal(false)
    }

    const handleSubtractSubmit = async (req: Inventory) => {
        const reqList = [];
        reqList.push(req)
        await inventoryService.subtractInventory(reqList)
        await refreshData()
        setShowCreateModal(false)
    }

    useEffect(() => {
        refreshData()
    }, [])

    return <Container>
        <h1 className="my-3">Inventory</h1>
        <Button onClick={() => setShowCreateModal(true)}>Add</Button>
        <Button className="mx-3" onClick={() => setShowSubtractModal(true)}>Subtract</Button>
        <InventoryTable data={data}/>
        <InventoryModal
            show={showCreateModal}
            existing="add"
            onCancel={() => setShowCreateModal(false)}
            onSubmit={req => handleCreateSubmit(req)}
        />
        <InventoryModal
            show={showSubtractModal}
            existing = "subtract"
            onCancel={() => setShowSubtractModal(false)}
            onSubmit={req => handleSubtractSubmit(req)}
        />
    </Container>
}

interface InventoryTableProps {
    data: InventoryResponse[]
}

const InventoryTable = ({ data }: InventoryTableProps) => {
    const columns = useMemo(() => [
        columnHelper.accessor('productID', {}),
        columnHelper.accessor('amount', {}),
    ], [])

    const table = useReactTable<InventoryResponse>({
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

interface InventoryModalProps {
    existing?: string
    show: boolean
    onCancel(): void
    onSubmit(req: Inventory): void
}

const InventoryModal = ({ existing, show, onCancel, onSubmit }: InventoryModalProps) => {
    const [formData, setFormData] = useState<Inventory>({
        productID: '',
        amountToUpdate: 0
    })

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        // console.log(formData)
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
                        {existing === 'add' ? 'Add Inventory' : 'Subtract Inventory'}
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form.Group className="mb-3" controlId="productID">
                        <Form.Label>Product ID</Form.Label>
                        <Form.Control
                            type="text"
                            name="productID"
                            value={formData.productID}
                            onChange={handleChange}
                            required
                        />
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="amountToUpdate">
                        <Form.Label>Amount to Add</Form.Label>
                        <Form.Control
                            type="number"
                            name="amountToUpdate"
                            value={formData.amountToUpdate}
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
const columnHelper = createColumnHelper<InventoryResponse>()