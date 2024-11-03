'use client'
import { useState, useEffect, useRef, FormEvent } from 'react'
import axios from 'axios'
import { baseUrl } from '@/helpers/url'
import { IProduct } from '@/interface/interfaces'

interface Product {
  params: {
    id: string
  }
}

export default function ProductPage(props: Product) {
  const [product, setProduct] = useState<IProduct | null>(null)
  const [message, setMessage] = useState<string | null>(null)
  const [loading, setLoading] = useState<boolean>(false)

  const nameRef = useRef<HTMLInputElement>(null)
  const priceRef = useRef<HTMLInputElement>(null)
  const descriptionRef = useRef<HTMLInputElement>(null)
  const statusRef = useRef<HTMLSelectElement>(null)
  const supplierRef = useRef<HTMLInputElement>(null)
  const costPriceRef = useRef<HTMLInputElement>(null)
  const productCodeRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    async function fetchProduct() {
      if (!props.params.id) return
      try {
        const response = await axios.get(
          `${baseUrl}/product/${props.params.id}`,
        )
        setProduct(response.data)
      } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
          setMessage('Erro ao buscar o produto.')
        }
      }
    }
    fetchProduct()
  }, [props.params.id])

  useEffect(() => {
    if (
      product &&
      nameRef.current &&
      priceRef.current &&
      descriptionRef.current &&
      statusRef.current &&
      supplierRef.current &&
      costPriceRef.current &&
      productCodeRef.current
    ) {
      nameRef.current.value = product.name
      priceRef.current.value = product.price.toString()
      descriptionRef.current.value = product.description ?? ''
      statusRef.current.value = product.status ?? 'Disponivel'
      supplierRef.current.value = product.supplier ?? 'Não informado'
      costPriceRef.current.value = product.cost_price.toString()
      productCodeRef.current.value = product.product_code ?? ''
    }
  }, [product])

  async function handleSubmit(event: FormEvent) {
    event.preventDefault()
    setLoading(true)

    if (
      !product ||
      !nameRef.current ||
      !priceRef.current ||
      !descriptionRef.current ||
      !statusRef.current ||
      !supplierRef.current ||
      !costPriceRef.current ||
      !productCodeRef.current
    ) {
      setMessage('Todos os campos são obrigatórios.')
      setLoading(false)
      return
    }

    const updatedProduct = {
      name: nameRef.current.value,
      price: parseFloat(priceRef.current.value),
      description: descriptionRef.current.value,
      status: statusRef.current.value,
      supplier: supplierRef.current.value,
      cost_price: parseFloat(costPriceRef.current.value),
      product_code: productCodeRef.current.value,
    }

    try {
      await axios.put(`${baseUrl}/product/${props.params.id}`, updatedProduct)
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
    if (nameRef.current) nameRef.current.value = ''
    if (priceRef.current) priceRef.current.value = ''
    if (descriptionRef.current) descriptionRef.current.value = ''
    if (statusRef.current) statusRef.current.value = 'Disponivel'
    if (supplierRef.current) supplierRef.current.value = 'Não informado'
    if (costPriceRef.current) costPriceRef.current.value = '0'
    if (productCodeRef.current) productCodeRef.current.value = ''
  }

  return (
    <div className="flex flex-col justify-center items-center min-h-screen bg-gray-50">
      <h1 className="text-2xl font-semibold text-gray-800 mb-6">
        Editar Produto
      </h1>
      <div className="bg-white shadow-md rounded-lg p-8 w-full max-w-md border border-gray-200">
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            ref={nameRef}
            type="text"
            className="rounded-md p-3 border border-gray-300 placeholder-gray-500 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Nome do produto"
            required
          />
          <input
            ref={priceRef}
            type="number"
            step="0.01"
            className="rounded-md p-3 border border-gray-300 placeholder-gray-500 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Preço do produto"
            required
          />
          <input
            ref={descriptionRef}
            type="text"
            className="rounded-md p-3 border border-gray-300 placeholder-gray-500 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Descrição do produto"
          />
          <input
            ref={costPriceRef}
            type="number"
            step="0.01"
            className="rounded-md p-3 border border-gray-300 placeholder-gray-500 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Preço de Custo"
            required
          />
          <input
            ref={supplierRef}
            type="text"
            className="rounded-md p-3 border border-gray-300 placeholder-gray-500 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Fornecedor"
          />
          <input
            ref={productCodeRef}
            type="text"
            className="rounded-md p-3 border border-gray-300 placeholder-gray-500 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Código do Produto"
          />
          <select
            ref={statusRef}
            className="rounded-md p-3 border border-gray-300 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          >
            <option value="Disponivel">Disponível</option>
            <option value="Vendido">Vendido</option>
            <option value="Em pagamento">Em pagamento</option>
          </select>

          <button
            type="submit"
            className="py-3 bg-blue-600 text-white rounded-md hover:bg-blue-500 transition-all"
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
