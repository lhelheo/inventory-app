'use client'
import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { baseUrl } from '@/helpers/url'
import { IProduct } from '@/interface/interfaces'

const PaymentPage: React.FC<{ clientId: number; productId: number }> = ({
  clientId,
  productId,
}) => {
  const [product, setProduct] = useState<IProduct | null>(null)
  const [paymentAmount, setPaymentAmount] = useState<number>(0)
  const [message, setMessage] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.get(`${baseUrl}/client/1/products`)
        setProduct(response.data)
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (error) {
        setMessage('Erro ao carregar produto.')
      }
    }

    fetchProduct()
  }, [productId])

  // TODO: Get all products from one client
  console.log(product)

  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!paymentAmount || paymentAmount <= 0) {
      setMessage('Insira um valor válido para o pagamento.')
      return
    }

    setLoading(true)
    setMessage(null)

    try {
      const response = await axios.post(
        `${baseUrl}/clients/${clientId}/products/${productId}/payment`,
        {
          paymentAmount,
        },
      )

      setProduct(response.data)
      setMessage('Pagamento realizado com sucesso!')

      setPaymentAmount(0)
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      setMessage('Erro ao processar o pagamento.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
      <div className="bg-white shadow-md rounded-lg p-8 w-full max-w-md border border-gray-200">
        <h1 className="text-2xl font-semibold text-gray-800 mb-4">
          Pagamento de Produto
        </h1>

        {product ? (
          <>
            <p className="text-gray-700 mb-2">
              <strong>Produto:</strong> {product.name}
            </p>
            <p className="text-gray-700 mb-2">
              <strong>Preço Total:</strong> R$ {product.price}
            </p>
            <p className="text-gray-700 mb-4">
              <strong>Valor Pendente:</strong> R$ {product.pendingAmount}
            </p>

            <form onSubmit={handlePayment} className="flex flex-col gap-4">
              <input
                type="number"
                step="0.01"
                value={paymentAmount}
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

            {product.status === 'Vendido' && (
              <p className="mt-4 text-center text-green-700 font-semibold">
                Produto vendido!
              </p>
            )}
          </>
        ) : (
          <p>Carregando produto...</p>
        )}
      </div>
    </div>
  )
}

export default PaymentPage
