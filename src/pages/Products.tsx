import { Card, Container, Pagination, Table } from "react-bootstrap"
import { useProductService } from "../hooks/useProductService"
import { useEffect, useMemo, useState } from "react"
import { Product } from "../models/ProductReqResp"
import { createColumnHelper, flexRender, getCoreRowModel, getPaginationRowModel, useReactTable } from "@tanstack/react-table"
import { useUserAuth } from "../hooks/useUserAuth"


export const Products = () => {
    const { user } = useUserAuth()
    const ProductService = useProductService()
    const [data, setData] = useState<Product[]>([])
    
    const refreshData = async () => {
        if (user?.id) {
            const products = await ProductService.getAll()
            setData(products)
        }
    }

    useEffect(() => {
        refreshData()
    }, [])

    return <Container>
        <h1 className="my-3">Product Catalogue</h1>
        <ProductTable data={data} />
    </Container>
}

interface ProductTableProps {
    data: Product[]
}

const ProductTable = ({ data }: ProductTableProps) => {
    const columns = useMemo(() => [
        columnHelper.accessor('id', {
            header: () => 'Product ID',
        }),
        columnHelper.accessor('productName', {
            header: () => 'Product Name',
        }),
        columnHelper.accessor('description', {
            header: () => 'Description',
        }),
        columnHelper.accessor('price', {
            header: () => 'Price',
            cell: info  => '$' + info.getValue().toFixed(2)
        })
    ], [])

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
        <div>
            <div style={{ display:"flex", flexWrap:'wrap' }}>
                {data.map((product) => {
                    if (data.length === 0) {
                        return(
                            <p>No Records Found</p>
                        );
                    } else {
                        return (
                            <Card style={{ width: '18rem', marginRight:'2rem', marginBottom: '1rem', textAlign: 'center'}}>
                            <Card.Img variant="top" src="holder.js/100px180" />
                            <Card.Body>
                              <Card.Title>{product.productName}</Card.Title>
                              <Card.Text>
                                {product.description}
                              </Card.Text>
                              <Card.Text>${product.price.toFixed(2)}</Card.Text>
                              <button>Add To Cart</button>
                            </Card.Body>
                          </Card>
                        );
                    }
                })}
            </div>
        </div>
    )
}

const columnHelper = createColumnHelper<Product>()

/**
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
                            <th></th>
                        </tr>
                    ))}
                </thead>
                <tbody>
                    {table.getRowModel().rows.length === 0 ? (
                        <tr>
                            <td colSpan={columns.length}>No records found</td>
                        </tr>
                    ) : (
                        table.getRowModel().rows.map(row => (
                        <tr key={row.id}>
                            {row.getVisibleCells().map(cell => (
                                <td key={cell.id}>
                                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                </td>
                            ))}
                            <td><button>Add to Cart</button></td>
                        </tr>
                    )))}
                </tbody>
            </Table>
 */