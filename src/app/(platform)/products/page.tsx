'use client'
import { formatData } from '@/helpers/format'
import { baseUrl } from '@/helpers/url'
import { IProduct } from '@/interface/interfaces'
import axios from 'axios'
import { Eye, Pencil, Trash2, Undo2 } from 'lucide-react'
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

          <div className="bg-[#242424] w-full max-w-[1600px] shadow-md rounded-lg p-8 max-h-[600px] overflow-x-auto">
            <div className="mb-6 w-full">
              <input
                type="text"
                placeholder="Buscar produtos..."
                className="w-full p-3 border border-gray-300 bg-[#333333] rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-[#e3e3e3]"
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            {products.length > 0 ? (
              <table className="min-w-full bg-[#242424] rounded-lg">
                <thead>
                  <tr className="bg-[#333333]">
                    <th className="py-3 px-4 text-[#e3e3e3] font-semibold text-left">
                      Nome
                    </th>
                    <th className="py-3 px-4 text-[#e3e3e3] font-semibold text-left">
                      Comprador
                    </th>
                    <th className="py-3 px-4 text-[#e3e3e3] font-semibold text-left">
                      Status
                    </th>
                    <th className="py-3 px-4 text-[#e3e3e3] font-semibold text-left">
                      Código
                    </th>
                    <th className="py-3 px-4 text-[#e3e3e3] font-semibold text-left">
                      Custo
                    </th>
                    <th className="py-3 px-4 text-[#e3e3e3] font-semibold text-left">
                      Venda
                    </th>
                    <th className="py-3 px-4 text-[#e3e3e3] font-semibold text-left">
                      Descrição
                    </th>
                    <th className="py-3 px-4 text-[#e3e3e3] font-semibold text-left">
                      Criado em
                    </th>
                    <th className="py-3 px-4 text-[#e3e3e3] font-semibold text-left">
                      Atualizado em
                    </th>
                    <th className="py-3 px-4 text-[#e3e3e3] font-semibold text-left">
                      Ações
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredProducts.map((product) => (
                    <tr
                      key={product.id}
                      className="border-t ease-linear transition-all even:bg-[#2a2a2a] hover:bg-[#3b3b3b] text-[#e3e3e3]"
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
                      <td className="flex py-3 px-4 text-center space-x-2">
                        <Pencil
                          size={18}
                          onClick={() =>
                            router.push(`/products/${product.id}/edit/`)
                          }
                          className="text-yellow-500 hover:text-yellow-700 cursor-pointer transition duration-200"
                        />
                        <Eye
                          size={18}
                          onClick={() => router.push(`/products/${product.id}`)}
                          className="text-blue-500 hover:text-blue-700 cursor-pointer transition duration-200"
                        />
                        <Trash2
                          size={18}
                          onClick={() => {
                            setShowConfirm(true)
                            setSelectedProduct(product)
                          }}
                          className="text-red-500 hover:text-red-700 cursor-pointer transition duration-200"
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p className="text-center text-[#e3e3e3]">
                Nenhum produto disponível.
              </p>
            )}
          </div>

          <button
            onClick={() => router.back()}
            className="fixed bottom-4 right-4 bg-[#333333] hover:bg-[#1f1f1f] text-white p-4 rounded-full shadow-lg transition duration-300"
            title="Voltar para a página anterior"
          >
            <Undo2 />
          </button>
        </div>
      )}

      {showConfirm && selectedProduct && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-[#242424] p-6 rounded-lg shadow-lg">
            <h2 className="text-lg font-semibold text-[#e3e3e3] mb-4">
              Confirmar Exclusão
            </h2>
            <p className="text-[#e3e3e3] mb-4">
              Tem certeza que deseja deletar o produto{' '}
              <span className="font-semibold">{selectedProduct.name}</span>?
            </p>
            <div className="flex justify-end">
              <button
                onClick={() => {
                  setShowConfirm(false)
                  setSelectedProduct(null)
                }}
                className="bg-[#4b4b4b] hover:bg-[#333333] text-[#e3e3e3] font-semibold py-2 px-4 rounded mr-2"
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
