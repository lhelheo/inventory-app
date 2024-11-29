'use client'
import { formatData } from '@/helpers/format'
import { baseUrl } from '@/helpers/url'
import { IProduct } from '@/interface/interfaces'
import axios from 'axios'
import { Pencil, Trash2 } from 'lucide-react'
import { useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'

export default function Products() {
  const router = useRouter()
  const [search, setSearch] = useState<string>('')
  const [products, setProducts] = useState<IProduct[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [message, setMessage] = useState<string | null>(null)
  const [showConfirm, setShowConfirm] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState<IProduct | null>(null)

  useEffect(() => {
    loadProducts()
  }, [])

  async function handleDeleteConfirmed() {
    if (!selectedProduct) return
    setLoading(true)
    try {
      await axios.delete(`${baseUrl}/product/${selectedProduct.id}`)
      setMessage('Produto deletado com sucesso.')
      setProducts(
        products.filter((product) => product.id !== selectedProduct.id),
      )
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      setMessage('Erro ao deletar o produto.')
    } finally {
      setLoading(false)
      setShowConfirm(false)
      setSelectedProduct(null)
    }
  }

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

  const filteredProducts = products.filter(
    (product) =>
      product.name.toLowerCase().includes(search.toLowerCase()) ||
      product.client?.name.toLowerCase().includes(search.toLowerCase()) ||
      product.product_code?.toLowerCase().includes(search.toLowerCase()),
  )

  return (
    <>
      {loading ? (
        <div className="flex flex-col justify-center items-center min-h-screen bg-[#181818]">
          <p className="text-lg text-[#e3e3e3]">Carregando produtos...</p>
        </div>
      ) : (
        <div className="flex flex-col justify-center items-center min-h-screen bg-[#181818]">
          <h1 className="text-2xl font-semibold text-[#e3e3e3] mb-6">
            Produtos
          </h1>
          <div className="bg-white shadow-md rounded-lg p-8 w-[85%] border border-gray-200 overflow-x-auto">
            <div className="mb-6 w-full">
              <input
                type="text"
                placeholder="Buscar produtos..."
                className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
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
                      Editar
                    </th>
                    <th className="py-3 px-4 bg-gray-100 text-gray-600 font-semibold text-left">
                      Deletar
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredProducts.map((product) => (
                    <tr
                      key={product.id}
                      className="border-t ease-linear transition-all even:bg-gray-50 hover:bg-gray-100"
                    >
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
                      <td className="py-3 px-4 text-center">
                        <Trash2
                          onClick={() => {
                            setShowConfirm(true)
                            setSelectedProduct(product)
                          }}
                          className="text-red-500 hover:text-red-700 cursor-pointer"
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

      {showConfirm && selectedProduct && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-lg font-semibold mb-4">Confirmar Exclusão</h2>
            <p className="mb-4">
              Tem certeza que deseja deletar o produto{' '}
              <span className="font-semibold">{selectedProduct.name}</span>?
            </p>
            <div className="flex justify-end">
              <button
                onClick={() => {
                  setShowConfirm(false)
                  setSelectedProduct(null)
                }}
                className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold py-2 px-4 rounded mr-2"
              >
                Cancelar
              </button>
              <button
                onClick={handleDeleteConfirmed}
                className="bg-red-500 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded"
              >
                Confirmar
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
