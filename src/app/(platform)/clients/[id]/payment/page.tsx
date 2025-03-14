'use client'

import { api } from '@/app/services/api'
import { BackButton } from '@/component/backButton'
import GenericTable from '@/component/genericTable'
import { InputField } from '@/component/inputField'
import { Title } from '@/component/title'
import { baseUrl } from '@/helpers/url'
import { IClient, IProduct } from '@/interface/interfaces'
import axios from 'axios'
import { Undo2 } from 'lucide-react'
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
      <div className="flex flex-col w-full px-8 md:px-20 mt-6">
        <Title title="Realizar Pagamento" />

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
                  className="mt-1 block w-full p-2 rounded-md bg-[#181818] text-gray-200 border border-gray-700"
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
                <InputField
                  label="Valor do Pagamento"
                  type="number"
                  value={paymentValue}
                  onChange={(e) => setPaymentValue(e.target.value)}
                  min="0"
                  step="0.01"
                  name="paymentValue"
                  placeholder="Digite o valor do pagamento"
                />
              </div>

              <button
                onClick={handlePayment}
                disabled={loading || !paymentValue || !selectedProductId}
                className="w-full bg-[#242424] hover:bg-[#333333] hover:scale-[101%] text-white py-2 rounded-md transition disabled:bg-gray-500"
              >
                {loading ? 'Processando...' : 'Confirmar pagamento'}
              </button>
            </div>

            <div className="w-full md:w-1/2 flex flex-col gap-6">
              <div className="rounded-lg shadow-lg p-6 bg-[#181818]">
                <Title title="Informações do Cliente" />
                {client && (
                  <>
                    {[
                      { label: 'Nome', value: client.name },
                      { label: 'Email', value: client.email },
                      { label: 'Telefone', value: client.phone },
                    ].map((info, index) => (
                      <p key={index} className="text-gray-200">
                        <strong>{info.label}:</strong> {info.value}
                      </p>
                    ))}
                  </>
                )}
              </div>

              <div className="rounded-lg shadow-lg p-6 bg-[#181818]">
                <Title title="Informações de Vendas" />
                {[
                  {
                    label: 'Total Vendido',
                    value: totalSoldPrice?.toFixed(2),
                    color: 'text-green-400',
                  },
                  {
                    label: 'Total Pendentes',
                    value: totalPending?.toFixed(2),
                    color: 'text-yellow-400',
                  },
                ].map((info, index) => (
                  <p key={index} className="text-gray-200">
                    <strong>{info.label}:</strong>{' '}
                    <span className={info.color}>R$ {info.value}</span>
                  </p>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="w-full bg-[#181818] rounded p-6 mx-auto mt-4">
          {message && <p className="text-green-500 mt-4">{message}</p>}
          {error && <p className="text-red-500 mt-4">{error}</p>}

          {products.length > 0 && (
            <div className="mt-8">
              <Title title="Status dos Produtos" />
              <GenericTable
                data={products
                  .filter((product) => product.status !== 'Vendido')
                  .map((product) => ({
                    id: product.id,
                    name: product.name,
                    price: product.price,
                    remaining_balance:
                      product.remaining_balance === 0
                        ? 'Venda finalizada'
                        : `R$ ${product.remaining_balance ?? product.price}`,
                  }))}
                columns={[
                  { key: 'name', label: 'Produto' },
                  { key: 'price', label: 'Preço' },
                  { key: 'remaining_balance', label: 'Saldo Pendente' },
                ]}
              />
            </div>
          )}

          <BackButton onClick={() => router.back()}>
            <Undo2 />
          </BackButton>
        </div>
      </div>
    </div>
  )
}
