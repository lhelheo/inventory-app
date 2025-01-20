'use client'

import { api } from '@/app/services/api'
import { baseUrl } from '@/helpers/url'
import { IClient, IProduct } from '@/interface/interfaces'
import axios from 'axios'
import { Eye, Mail, Phone, Undo2, User } from 'lucide-react'
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
      <div className="flex flex-col w-full px-20">
        <div className="bg-[#181818] w-full">
          <div className="flex justify-center items-center">
            <div className="flex flex-col justify-center p-6 gap-6 items-center rounded-lg w-full">
              <div className="flex gap-6">
                <h1 className="flex gap-2 text-white mb-4">
                  <User size={24} />
                  <strong>Nome: </strong> {client?.name}
                </h1>
                <p className="flex gap-2 text-white mb-4">
                  <Mail size={24} />
                  <strong>Email:</strong> {client?.email}
                </p>
                <p className="flex gap-2 text-white mb-4">
                  <Phone size={24} />
                  <strong>Telefone:</strong> {client?.phone}
                </p>
              </div>

              <div className="flex gap-6">
                <div className="text-center">
                  <h2 className="font-semibold text-lg text-white mb-2">
                    Total em produtos vendidos
                  </h2>
                  <p className="text-3xl text-green-400 font-bold">
                    R$ {totalSoldPrice?.toFixed(2)}
                  </p>
                </div>

                <div className="text-center">
                  <h2 className="font-semibold text-lg text-white mb-2">
                    Total em produtos pendentes
                  </h2>
                  <p className="text-3xl text-yellow-400 font-bold">
                    R$ {totalPending?.toFixed(2)}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <h1 className="text-2xl flex justify-center font-bold my-4 text-[#e3e3e3]">
          Realizar Pagamento
        </h1>
        <div className="w-full bg-[#242424] rounded p-10 mx-auto mt-4">
          <div className="mb-4">
            <label
              htmlFor="product"
              className="block text-sm font-medium text-[#e3e3e3]"
            >
              Selecione um Produto
            </label>
            <select
              id="product"
              className="mt-1 block w-full p-2  rounded-md bg-[#181818] text-[#e3e3e3]"
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

          <div className="mb-4 ">
            <label
              htmlFor="paymentValue"
              className="block text-sm font-medium text-[#e3e3e3]"
            >
              Valor do Pagamento
            </label>
            <input
              type="number"
              id="paymentValue"
              className="mt-1 block w-full p-2  rounded-md bg-[#181818] text-[#e3e3e3]"
              value={paymentValue}
              onChange={(e) => setPaymentValue(e.target.value)}
              min="0"
              step="0.01"
            />
          </div>

          <button
            onClick={handlePayment}
            disabled={loading || !paymentValue || !selectedProductId}
            className="w-full bg-[#181818] hover:bg-[#1f1f1f] text-white py-2 rounded-md transition-all ease-linear disabled:bg-gray-400"
          >
            {loading ? 'Processando...' : 'Pagar'}
          </button>

          {message && <p className="text-green-600 mt-4">{message}</p>}
          {error && <p className="text-red-600 mt-4">{error}</p>}

          {products.length > 0 && (
            <div className="mt-8">
              <h2 className="text-xl font-bold mb-4 text-[#e3e3e3]">
                Status dos Produtos
              </h2>
              <table className="w-full table-auto border border-[#e3e3e3] border-opacity-25">
                <thead>
                  <tr>
                    <th className="px-4 py-2 text-left text-[#e3e3e3]">
                      Produto
                    </th>

                    <th className="px-4 py-2 text-left text-[#e3e3e3]">
                      Preço
                    </th>
                    <th className="px-4 py-2 text-left text-[#e3e3e3]">
                      Saldo Pendente
                    </th>
                    <th className="px-4 py-2 text-left text-[#e3e3e3]">
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
                        className="odd:bg-[#181818] text-[#e3e3e3] bg-[#1f1f1f]"
                      >
                        <td className="px-4 py-2">{product.name}</td>

                        <td className="px-4 py-2">{`R$ ${product.price}`}</td>
                        <td className="px-4 py-2">
                          {product.remaining_balance === 0
                            ? 'Venda finalizada'
                            : `R$ ${product.remaining_balance ?? product.price}`}
                        </td>
                        <td className="px-4 py-2">
                          <div title="Visualizar produto">
                            <Eye
                              size={18}
                              onClick={() =>
                                router.push(`/products/${product.id}`)
                              }
                              className="text-blue-500 hover:text-blue-700 cursor-pointer transition duration-200"
                            />
                          </div>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          )}
          <button
            onClick={() => router.back()}
            className="fixed bottom-4 right-4 bg-[#333333] hover:bg-[#1f1f1f] text-white p-4 rounded-full shadow-lg transition duration-300"
            title="Voltar para a página anterior"
          >
            <Undo2 />
          </button>
        </div>
      </div>
    </div>
  )
}
