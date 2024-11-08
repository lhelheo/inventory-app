'use client'
import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { baseUrl } from '@/helpers/url'

interface IProduct {
  id: number
  name: string
  price: number
  remaining_balance: number
  status: string
}

interface PaymentPageProps {
  clientId: string
}

export default function PaymentPage({ clientId }: PaymentPageProps) {
  const [products, setProducts] = useState<IProduct[]>([])
  const [paymentAmount, setPaymentAmount] = useState<{ [key: number]: number }>(
    {},
  )
  const [message, setMessage] = useState<string | null>(null)
  const [loading, setLoading] = useState<number | null>(null)

  useEffect(() => {
    const fetchClientProducts = async () => {
      try {
        const response = await axios.get(`${baseUrl}/client/1/products`)
        setProducts(response.data)
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (error) {
        setMessage('Erro ao carregar produtos do cliente.')
      }
    }
    fetchClientProducts()
  }, [clientId])

  const handlePayment = async (productId: number) => {
    setMessage(null)

    if (!paymentAmount[productId] || paymentAmount[productId] <= 0) {
      setMessage('Insira um valor de pagamento válido para o produto.')
      return
    }

    setLoading(productId) // Inicia o loading para o produto específico

    try {
      const response = await axios.post(
        `${baseUrl}/clients/1/products/${productId}/payment`,
        { paymentAmount: paymentAmount[productId], productId },
      )

      // Atualiza o produto pago na lista de produtos
      setProducts((prevProducts) =>
        prevProducts.map((prod) =>
          prod.id === productId ? response.data.product : prod,
        ),
      )
      setMessage('Pagamento realizado com sucesso!')
      setPaymentAmount((prev) => ({ ...prev, [productId]: 0 })) // Reseta o valor de pagamento para o produto
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      setMessage('Erro ao processar pagamento.')
    } finally {
      setLoading(null) // Encerra o loading
    }
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
      <div className="bg-white shadow-md rounded-lg p-8 w-full max-w-md border border-gray-200">
        <h1 className="text-2xl font-semibold text-gray-800 mb-4">
          Pagamento de Produtos
        </h1>

        {products.length > 0 ? (
          products.map((product) => (
            <div key={product.id} className="mb-6">
              <p className="text-gray-700 mb-2">
                <strong>Produto:</strong> {product.name}
              </p>
              <p className="text-gray-700 mb-2">
                <strong>Preço Total:</strong> R$ {product.price}
              </p>
              <p className="text-gray-700 mb-2">
                <strong>Valor Pendente:</strong> R$ {product.remaining_balance}
              </p>
              <p
                className={`text-gray-700 mb-4 ${product.status === 'Disponível' ? 'text-green-600' : ''}`}
              >
                <strong>Status:</strong> {product.status}
              </p>

              <form
                onSubmit={(e) => {
                  e.preventDefault()
                  handlePayment(product.id)
                }}
                className="flex flex-col gap-4"
              >
                <input
                  type="number"
                  step="0.01"
                  value={paymentAmount[product.id] || ''}
                  onChange={(e) =>
                    setPaymentAmount((prev) => ({
                      ...prev,
                      [product.id]: parseFloat(e.target.value),
                    }))
                  }
                  className="input"
                  placeholder="Valor do pagamento"
                  required
                />
                <button
                  type="submit"
                  className="py-2 bg-blue-600 text-white rounded-md hover:bg-blue-500 transition-all"
                  disabled={loading === product.id}
                >
                  {loading === product.id
                    ? 'Processando...'
                    : 'Realizar Pagamento'}
                </button>
              </form>
            </div>
          ))
        ) : (
          <p>Carregando produtos...</p>
        )}

        {message && (
          <p className="mt-4 text-center text-green-600">{message}</p>
        )}
      </div>
    </div>
  )
}
