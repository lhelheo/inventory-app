'use client'

import { baseUrl } from '@/helpers/url'
import { IProduct } from '@/interface/interfaces'
import axios from 'axios'
import { useEffect, useState } from 'react'

interface PaymentPageProps {
  params: {
    id: string
  }
}

export default function Payment(props: PaymentPageProps) {
  const [products, setProducts] = useState<IProduct[]>([])
  const [paymentAmount, setPaymentAmount] = useState<number>(0)
  const [message, setMessage] = useState<string>('')
  const [loading, setLoading] = useState<boolean>(false)

  console.log('clientId', props.params.id)

  useEffect(() => {
    const fetchClientsProducts = async () => {
      try {
        const response = await axios.get(
          `${baseUrl}/client/${props.params.id}/products`,
        )
        setProducts(response.data)
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (error) {
        setMessage('Erro ao carregar produtos do cliente')
      }
    }
    fetchClientsProducts()
  }, [props.params.id])

  const handlePayment = async () => {
    setMessage('')

    if (paymentAmount || paymentAmount <= 0) {
      setMessage('Valor de pagamento inválido')
    }

    setLoading(true)

    try {
      const response = await axios.post(
        `${baseUrl}/client/${props.params.id}/pay`,
        {
          paymentAmount,
        },
      )
      setProducts(response.data.updatedProducts) // ?
      setMessage('Pagamento efetuado com sucesso')
      setPaymentAmount(0)
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      setMessage('Erro ao efetuar pagamento')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
      <div className="bg-white shadow-md rounded-lg p-8 w-full max-w-md border border-gray-200">
        <h1 className="text-2xl font-semibold text-gray-800 mb-4">
          Pagamento de Produtos
        </h1>

        {products ? (
          products.map((product) => (
            <div key={product.id} className="mb-6">
              <p className="text-gray-700 mb-2">
                <strong>Produto:</strong> {product.name}
              </p>
              <p className="text-gray-700 mb-2">
                <strong>Preço Total:</strong> R$ {product.price.toFixed(2)}
              </p>
              <p className="text-gray-700 mb-2">
                <strong>Valor Pendente:</strong> R${' '}
                {product.pendingAmount?.toFixed(2)}
              </p>
              <p
                className={`text-gray-700 mb-4 ${
                  product.status === 'Disponivel' ? 'text-green-600' : ''
                }`}
              >
                <strong>Status:</strong> {product.status}
              </p>
            </div>
          ))
        ) : (
          <p>Carregando produtos...</p>
        )}

        <form
          onSubmit={(e) => {
            e.preventDefault()
            handlePayment()
          }}
          className="flex flex-col gap-4"
        >
          <input
            type="number"
            step="0.01"
            value={paymentAmount || ''}
            onChange={(e) => setPaymentAmount(parseFloat(e.target.value))}
            className="input"
            placeholder="Valor do pagamento"
            required
          />
          <button
            type="submit"
            className="py-2 bg-blue-600 text-white rounded-md hover:bg-blue-500 transition-all"
            disabled={loading}
          >
            {loading ? 'Processando...' : 'Realizar Pagamento'}
          </button>
        </form>

        {message && (
          <p className="mt-4 text-center text-green-600">{message}</p>
        )}
      </div>
    </div>
  )
}
