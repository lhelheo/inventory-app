'use client'

import { baseUrl } from '@/helpers/url'
import { IProduct } from '@/interface/interfaces'
import axios from 'axios'
import { useEffect, useState } from 'react'

interface ClientPaymentProps {
  params: {
    id: string
  }
}

export default function ClientPayment(props: ClientPaymentProps) {
  const [paymentValue, setPaymentValue] = useState('')
  const [selectedProductId, setSelectedProductId] = useState<string | null>(
    null,
  )
  const [products, setProducts] = useState<IProduct[]>([])
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  const fetchClientProducts = async () => {
    try {
      const response = await axios.get(
        `${baseUrl}/client/${props.params.id}/products`,
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

  const handlePayment = async () => {
    if (!selectedProductId) {
      setError('Por favor, selecione um produto para realizar o pagamento.')
      return
    }

    setLoading(true)
    setMessage('')
    setError('')

    try {
      const response = await axios.patch(
        `${baseUrl}/client/${props.params.id}/product/${selectedProductId}/pay`,
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

  return (
    <div className="w-full flex justify-center bg-[#181818] h-screen p-4">
      <div className="w-[1200px] bg-[#e3e3e3] rounded p-10">
        <h1 className="text-2xl font-bold mb-4">Realizar Pagamento</h1>

        <div className="mb-4">
          <label
            htmlFor="product"
            className="block text-sm font-medium text-gray-700"
          >
            Selecione um Produto
          </label>
          <select
            id="product"
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
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
            className="block text-sm font-medium text-gray-700"
          >
            Valor do Pagamento
          </label>
          <input
            type="number"
            id="paymentValue"
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
            value={paymentValue}
            onChange={(e) => setPaymentValue(e.target.value)}
            min="0"
            step="0.01"
          />
        </div>

        <button
          onClick={handlePayment}
          disabled={loading || !paymentValue || !selectedProductId}
          className="w-full bg-[#181818] text-white py-2 rounded-md hover:bg-[#3d3d3d] transition-all ease-linear disabled:bg-gray-300"
        >
          {loading ? 'Processando...' : 'Pagar'}
        </button>

        {message && <p className="text-green-600 mt-4">{message}</p>}
        {error && <p className="text-red-600 mt-4">{error}</p>}

        {products.length > 0 && (
          <div className="mt-8">
            <h2 className="text-xl font-bold mb-4">Status dos Produtos</h2>
            <table className="min-w-full table-auto border-collapse border border-gray-300">
              <thead>
                <tr>
                  <th className="px-4 py-2 border-b text-left">Produto</th>

                  <th className="px-4 py-2 border-b text-left">Preço</th>
                  <th className="px-4 py-2 border-b text-left">
                    Saldo Pendente
                  </th>
                </tr>
              </thead>
              <tbody>
                {products
                  .filter((product) => product.status !== 'Vendido')
                  .map((product) => (
                    <tr key={product.id} className="odd:bg-gray-50">
                      <td className="px-4 py-2 border-b">{product.name}</td>

                      <td className="px-4 py-2 border-b">{`R$ ${product.price}`}</td>
                      <td className="px-4 py-2 border-b">
                        {product.remaining_balance === 0
                          ? 'Venda finalizada'
                          : `R$ ${product.remaining_balance ?? product.price}`}
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
