'use client'
import { useState, useEffect, useRef, FormEvent } from 'react'
import axios from 'axios'
import { baseUrl } from '@/helpers/url'
import { IProduct } from '@/interface/interfaces'

export default function EditProduct() {
  const [products, setProducts] = useState<IProduct[]>([])
  const [selectedProductId, setSelectedProductId] = useState<number | null>(
    null,
  )
  const [message, setMessage] = useState<string | null>(null)
  const [loading, setLoading] = useState<boolean>(false)

  const productNameRef = useRef<HTMLInputElement>(null)
  const productPriceRef = useRef<HTMLInputElement>(null)
  const productCodeRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    async function fetchProducts() {
      try {
        const response = await axios.get(`${baseUrl}/products`)
        setProducts(response.data)
      } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
          setMessage('Erro ao buscar os produtos.')
        } else {
          setMessage('Erro ao buscar os produtos.')
        }
      }
    }
    fetchProducts()
  }, [])

  useEffect(() => {
    if (selectedProductId) {
      const product = products.find((p) => p.id === selectedProductId)
      if (
        productNameRef.current &&
        productPriceRef.current &&
        productCodeRef.current &&
        product
      ) {
        productNameRef.current.value = product.name
        productPriceRef.current.value = product.price.toString()
        productCodeRef.current.value = product.product_code || ''
      }
    }
  }, [selectedProductId, products])

  async function handleSubmit(event: FormEvent) {
    event.preventDefault()
    setLoading(true)

    if (
      !selectedProductId ||
      !productNameRef.current ||
      !productPriceRef.current ||
      !productCodeRef.current
    ) {
      setMessage('Todos os campos são obrigatórios.')
      setLoading(false)
      return
    }

    const updatedProduct = {
      name: productNameRef.current.value,
      price: parseFloat(productPriceRef.current.value),
      productCode: productCodeRef.current.value,
    }

    try {
      await axios.put(
        `${baseUrl}/products/${selectedProductId}`,
        updatedProduct,
      )
      setMessage('Produto atualizado com sucesso.')
      clearForm()
    } catch (error) {
      if (axios.isAxiosError(error)) {
        setMessage(
          error.response?.data?.error || 'Erro ao atualizar o produto.',
        )
      } else {
        setMessage('Erro desconhecido ao atualizar o produto.')
      }
    } finally {
      setLoading(false)
    }
  }

  function clearForm() {
    if (productNameRef.current) productNameRef.current.value = ''
    if (productPriceRef.current) productPriceRef.current.value = ''
    if (productCodeRef.current) productCodeRef.current.value = ''
    setSelectedProductId(null)
  }

  return (
    <div className="flex flex-col justify-center items-center min-h-screen bg-gray-50">
      <div className="bg-white shadow-lg rounded-lg p-8 max-w-sm w-full border border-gray-200">
        <h1 className="text-2xl font-semibold text-gray-800 mb-6 text-center">
          Editar Produto
        </h1>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <select
            value={selectedProductId || ''}
            onChange={(e) => setSelectedProductId(Number(e.target.value))}
            className="border border-gray-300 rounded-lg p-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="" disabled>
              Selecione um produto
            </option>
            {products.map((product) => (
              <option key={product.id} value={product.id}>
                {product.name} - {product.product_code}
              </option>
            ))}
          </select>

          <input
            ref={productNameRef}
            type="text"
            className="border border-gray-300 rounded-lg p-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Nome do produto"
            required
          />
          <input
            ref={productPriceRef}
            type="number"
            className="border border-gray-300 rounded-lg p-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Preço do produto"
            step="0.01"
            required
          />
          <input
            ref={productCodeRef}
            type="text"
            className="border border-gray-300 rounded-lg p-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Código do produto"
            required
          />

          <button
            type="submit"
            className="py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-500 transition-all w-full focus:ring-4 focus:ring-blue-300 disabled:bg-blue-300"
            disabled={loading}
          >
            {loading ? 'Carregando...' : 'Salvar Alterações'}
          </button>
        </form>

        {message && (
          <p className="mt-4 text-center text-green-600">{message}</p>
        )}
      </div>
    </div>
  )
}
