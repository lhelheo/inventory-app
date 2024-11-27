'use client'
import { formatData } from '@/helpers/format'
import { baseUrl } from '@/helpers/url'
import { IProduct } from '@/interface/interfaces'
import { Pencil } from 'lucide-react'
import { useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'

export default function Products() {
  const router = useRouter()
  const [products, setProducts] = useState<IProduct[]>([])
  const [loading, setLoading] = useState<boolean>(true)

  useEffect(() => {
    loadProducts()
  }, [])

  async function loadProducts() {
    try {
      const response = await fetch(`${baseUrl}/products`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      })
      if (!response.ok) {
        throw new Error('Failed to fetch products')
      }
      const data = await response.json()
      setProducts(data)
    } catch (error) {
      console.error('Failed to load products', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      {loading ? (
        <div className="flex flex-col justify-center items-center min-h-screen bg-gray-50">
          <p className="text-lg text-gray-600">Carregando produtos...</p>
        </div>
      ) : (
        <div className="flex flex-col justify-center items-center min-h-screen bg-gray-50">
          <h1 className="text-2xl font-semibold text-gray-800 mb-6">
            Produtos
          </h1>
          <div className="bg-white shadow-md rounded-lg p-8 w-[85%] border border-gray-200 overflow-x-auto">
            {products.length > 0 ? (
              <table className="min-w-full bg-white border border-gray-200 rounded-lg">
                <thead>
                  <tr>
                    <th className="py-3 px-4 bg-gray-100 text-gray-600 font-semibold text-left">
                      Nome
                    </th>
                    <th className="py-3 px-4 bg-gray-100 text-gray-600 font-semibold text-left">
                      Comprador
                    </th>
                    <th className="py-3 px-4 bg-gray-100 text-gray-600 font-semibold text-left">
                      Status
                    </th>
                    <th className="py-3 px-4 bg-gray-100 text-gray-600 font-semibold text-left">
                      Código
                    </th>
                    <th className="py-3 px-4 bg-gray-100 text-gray-600 font-semibold text-left">
                      Custo
                    </th>
                    <th className="py-3 px-4 bg-gray-100 text-gray-600 font-semibold text-left">
                      Venda
                    </th>
                    <th className="py-3 px-4 bg-gray-100 text-gray-600 font-semibold text-left">
                      Descrição
                    </th>
                    <th className="py-3 px-4 bg-gray-100 text-gray-600 font-semibold text-left">
                      Criado em
                    </th>
                    <th className="py-3 px-4 bg-gray-100 text-gray-600 font-semibold text-left">
                      Atualizado em
                    </th>
                    <th className="py-3 px-4 bg-gray-100 text-gray-600 font-semibold text-left">
                      Ações
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((product) => (
                    <tr key={product.id} className="border-t">
                      <td className="py-3 px-4">{product.name}</td>
                      <td className="py-3 px-4">
                        {product.client?.name || '-'}
                      </td>
                      <td className="py-3 px-4">{product.status}</td>
                      <td className="py-3 px-4">{product.product_code}</td>
                      <td className="py-3 px-4">{`R$ ${product.cost_price}`}</td>
                      <td className="py-3 px-4">{`R$ ${product.price}`}</td>
                      <td className="py-3 px-4">{product.description}</td>
                      <td className="py-3 px-4">
                        {formatData(product.createAt)}
                      </td>
                      <td className="py-3 px-4">
                        {formatData(product.updateAt)}
                      </td>
                      <td className="py-3 px-4 text-center">
                        <Pencil
                          onClick={() =>
                            router.push(`/products/${product.id}/edit/`)
                          }
                          className="text-blue-500 hover:text-blue-700 cursor-pointer"
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p className="text-center text-gray-600">
                Nenhum produto disponível.
              </p>
            )}
          </div>
        </div>
      )}
    </>
  )
}
