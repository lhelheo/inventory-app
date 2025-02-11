'use client'

import { api } from '@/app/services/api'
import { baseUrl } from '@/helpers/url'
import { IClient, IProduct } from '@/interface/interfaces'
import axios from 'axios'
import { Eye, Undo2 } from 'lucide-react'
import { useParams, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

interface ClientPaymentProps {
  params: {
    id: string
  }
}

export default function ClientPayment(props: ClientPaymentProps) {
  const router = useRouter()
  const { id } = useParams<{ id: string }>()
  const [client, setClient] = useState<IClient>()
  const [paymentValue, setPaymentValue] = useState('')
  const [selectedProductId, setSelectedProductId] = useState<string | null>(
    null,
  )
  const [products, setProducts] = useState<IProduct[]>([])
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  async function fetchClientProducts() {
    try {
      const response = await axios.get(
        `${baseUrl}/clients/${props.params.id}/products`,
      )
      setProducts(response.data)
    } catch (error) {
      if (axios.isAxiosError(error)) {
        setError(error.response?.data?.message || 'Erro ao carregar produtos')
      } else {
        setError('Erro ao carregar produtos')
      }
    }
  }

  useEffect(() => {
    fetchClientProducts()
  }, [])

  async function handlePayment() {
    if (!selectedProductId) {
      setError('Por favor, selecione um produto para realizar o pagamento.')
      return
    }

    setLoading(true)
    setMessage('')
    setError('')

    try {
      const response = await axios.patch(
        `${baseUrl}/clients/${props.params.id}/products/${selectedProductId}/pay`,
        { amount: parseFloat(paymentValue) },
      )

      setMessage(response.data.message)

      fetchClientProducts()
      setPaymentValue('')
    } catch (error) {
      if (axios.isAxiosError(error)) {
        setError(error.response?.data?.message || 'Erro ao processar pagamento')
      } else {
        setError('Erro ao processar pagamento')
      }
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadCustomers()
  }, [])

  useEffect(() => {
    if (message) {
      loadCustomers()
    }
  }, [message])

  async function loadCustomers() {
    try {
      const response = await api.get(`${baseUrl}/clients/${id}`)
      setClient(response.data)
    } catch (error) {
      console.error('Failed to load customers', error)
    } finally {
      setLoading(false)
    }
  }

  const total = client?.product.reduce(
    (total, product) => total + Number(product.price),
    0,
  )

  const totalPending = client?.product
    .filter(
      (product) => product.status !== 'Vendido' || product.remaining_balance,
    )
    .reduce(
      (total, product) =>
        total + Number(product.remaining_balance ?? product.price),
      0,
    )

  const totalSoldPrice = (total ?? 0) - (totalPending ?? 0)

  return (
    <div className="w-full flex bg-[#181818] h-screen p-4">
      <div className="flex flex-col w-full px-8 md:px-20">
        <h1 className="text-3xl font-bold my-4 text-gray-200">
          Realizar Pagamento
        </h1>

        <div className="w-full">
          <div className="flex flex-col md:flex-row gap-6">
            <div className="w-full md:w-1/2">
              <div className="mb-4">
                <label
                  htmlFor="product"
                  className="block text-sm font-medium text-gray-200"
                >
                  Selecione um Produto
                </label>
                <select
                  id="product"
                  className="mt-1 block w-full p-2 rounded-md bg-[#181818] text-gray-200 border border-gray-700 focus:ring focus:ring-blue-500"
                  value={selectedProductId || ''}
                  onChange={(e) => setSelectedProductId(e.target.value)}
                >
                  <option value="" disabled>
                    Escolha um produto
                  </option>
                  {products
                    .filter((product) => product.status !== 'Vendido')
                    .map((product) => (
                      <option key={product.id} value={product.id}>
                        {product.name}
                      </option>
                    ))}
                </select>
              </div>

              <div className="mb-4">
                <label
                  htmlFor="paymentValue"
                  className="block text-sm font-medium text-gray-200"
                >
                  Valor do Pagamento
                </label>
                <input
                  type="number"
                  id="paymentValue"
                  className="mt-1 block w-full p-2 rounded-md bg-[#181818] text-gray-200 border border-gray-700 focus:ring focus:ring-blue-500"
                  value={paymentValue}
                  onChange={(e) => setPaymentValue(e.target.value)}
                  min="0"
                  step="0.01"
                />
              </div>

              <button
                onClick={handlePayment}
                disabled={loading || !paymentValue || !selectedProductId}
                className="w-full bg-[#242424] hover:bg-[#333333] hover:scale-[101%] text-white py-2 rounded-md transition disabled:bg-gray-500"
              >
                {loading ? 'Processando...' : 'Pagar'}
              </button>
            </div>

            <div className="w-full md:w-1/2 flex flex-col gap-6">
              <div className="rounded-lg shadow-lg p-6 bg-[#181818]">
                <p className="text-gray-200 text-xl font-medium mb-3">
                  Informações do Cliente
                </p>
                <p className="text-gray-200">
                  <strong>Nome:</strong> {client?.name}
                </p>
                <p className="text-gray-200">
                  <strong>Email:</strong> {client?.email}
                </p>
                <p className="text-gray-200">
                  <strong>Telefone:</strong> {client?.phone}
                </p>
              </div>

              <div className="rounded-lg shadow-lg p-6 bg-[#181818]">
                <p className="text-gray-200 text-xl font-medium mb-3">
                  Informações de Vendas
                </p>
                <p className="text-gray-200">
                  <strong>Total Vendido:</strong>{' '}
                  <span className="text-green-400">
                    R$ {totalSoldPrice?.toFixed(2)}
                  </span>
                </p>
                <p className="text-gray-200">
                  <strong>Total Pendentes:</strong>{' '}
                  <span className="text-yellow-400">
                    R$ {totalPending?.toFixed(2)}
                  </span>
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="w-full bg-[#181818] rounded p-6 mx-auto mt-4">
          {message && <p className="text-green-500 mt-4">{message}</p>}
          {error && <p className="text-red-500 mt-4">{error}</p>}

          {products.length > 0 && (
            <div className="mt-8">
              <h2 className="text-xl font-bold mb-4 text-gray-200">
                Status dos Produtos
              </h2>
              <table className="w-full table-auto border border-gray-700">
                <thead>
                  <tr className="bg-[#1]">
                    <th className="px-4 py-2 text-left text-gray-200">
                      Produto
                    </th>
                    <th className="px-4 py-2 text-left text-gray-200">Preço</th>
                    <th className="px-4 py-2 text-left text-gray-200">
                      Saldo Pendente
                    </th>
                    <th className="px-4 py-2 text-left text-gray-200">
                      Visualizar
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {products
                    .filter((product) => product.status !== 'Vendido')
                    .map((product) => (
                      <tr
                        key={product.id}
                        className="odd:bg-[#242424] even:bg-[#181818] text-gray-200"
                      >
                        <td className="px-4 py-2">{product.name}</td>
                        <td className="px-4 py-2">R$ {product.price}</td>
                        <td className="px-4 py-2">
                          {product.remaining_balance === 0
                            ? 'Venda finalizada'
                            : `R$ ${product.remaining_balance ?? product.price}`}
                        </td>
                        <td className="px-4 py-2">
                          <button
                            title="Visualizar produto"
                            onClick={() =>
                              router.push(`/products/${product.id}`)
                            }
                            className="text-blue-400 hover:text-blue-600 transition duration-200"
                          >
                            <Eye size={18} />
                          </button>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          )}

          <button
            onClick={() => router.back()}
            className="fixed bottom-4 right-4 bg-[#242424] hover:bg-[#181818] text-white p-4 rounded-full shadow-lg transition duration-300"
            title="Voltar para a página anterior"
          >
            <Undo2 />
          </button>
        </div>
      </div>
    </div>
  )
}
