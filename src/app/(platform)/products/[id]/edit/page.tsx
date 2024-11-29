'use client'
// TODO: Select client by name
import { useState, useEffect, useRef, FormEvent } from 'react'
import axios from 'axios'
import { baseUrl } from '@/helpers/url'
import { IProduct, IClient } from '@/interface/interfaces'
import { api } from '@/app/services/api'

interface Product {
  params: {
    id: string
  }
}

export default function ProductPage(props: Product) {
  const [product, setProduct] = useState<IProduct | null>(null)
  const [message, setMessage] = useState<string | null>(null)
  const [loading, setLoading] = useState<boolean>(false)
  const [customers, setCustomers] = useState<IClient[]>([])

  const nameRef = useRef<HTMLInputElement>(null)
  const priceRef = useRef<HTMLInputElement>(null)
  const descriptionRef = useRef<HTMLInputElement>(null)
  const statusRef = useRef<HTMLSelectElement>(null)
  const supplierRef = useRef<HTMLInputElement>(null)
  const costPriceRef = useRef<HTMLInputElement>(null)
  const productCodeRef = useRef<HTMLInputElement>(null)
  const clientIDRef = useRef<HTMLSelectElement>(null)

  useEffect(() => {
    loadCustomers()
  }, [])

  async function loadCustomers() {
    try {
      const response = await api.get(`${baseUrl}/clients`)
      setCustomers(response.data)
    } catch (error) {
      console.error('Failed to load customers', error)
    } finally {
      setLoading(false)
    }
  }

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
    if (product) {
      nameRef.current!.value = product.name
      priceRef.current!.value = product.price.toString()
      descriptionRef.current!.value = product.description ?? 'Não informado'
      statusRef.current!.value = product.status ?? 'Disponivel'
      supplierRef.current!.value = product.supplier ?? 'Não informado'
      costPriceRef.current!.value = product.cost_price.toString()
      productCodeRef.current!.value = product.product_code ?? ''
      clientIDRef.current!.value = product.clientID?.toString() || ''
    }
  }, [product])

  async function handleSubmit(event: FormEvent) {
    event.preventDefault()
    setLoading(true)

    const updatedProduct = {
      name: nameRef.current!.value,
      price: parseFloat(priceRef.current!.value),
      description: descriptionRef.current!.value,
      status: statusRef.current!.value,
      supplier: supplierRef.current!.value,
      cost_price: parseFloat(costPriceRef.current!.value),
      product_code: productCodeRef.current!.value,
      clientID: clientIDRef.current!.value
        ? Number(clientIDRef.current!.value)
        : null, // Convertendo clientID para Number
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
    nameRef.current!.value = ''
    priceRef.current!.value = ''
    descriptionRef.current!.value = ''
    statusRef.current!.value = 'Disponivel'
    supplierRef.current!.value = 'Não informado'
    costPriceRef.current!.value = '0'
    productCodeRef.current!.value = ''
    clientIDRef.current!.value = ''
  }

  return (
    <div className="flex flex-col justify-center items-center min-h-screen bg-[#181818] p-4">
      <h1 className="text-3xl font-bold text-[#e3e3e3] mb-8">Editar Produto</h1>

      <div className="bg-white shadow-md rounded-lg p-8 w-full max-w-lg border border-gray-200">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label
              className="block text-gray-700 font-semibold mb-2"
              htmlFor="name"
            >
              Nome do produto
            </label>
            <input
              ref={nameRef}
              type="text"
              id="name"
              className="input w-full border border-gray-700 border-opacity-20 p-2 shadow rounded-lg"
              placeholder="Nome do produto"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label
                className="block text-gray-700 font-semibold mb-2"
                htmlFor="price"
              >
                Preço
              </label>
              <input
                ref={priceRef}
                type="number"
                step="0.01"
                id="price"
                className="input w-full p-2 shadow rounded-lg border border-gray-700 border-opacity-20"
                placeholder="Preço do produto"
                required
              />
            </div>
            <div>
              <label
                className="block text-gray-700 font-semibold mb-2"
                htmlFor="costPrice"
              >
                Preço de Custo
              </label>
              <input
                ref={costPriceRef}
                type="number"
                step="0.01"
                id="costPrice"
                className="input w-full p-2 shadow rounded-lg border border-gray-700 border-opacity-20 "
                placeholder="Preço de Custo"
                required
              />
            </div>
          </div>

          <div>
            <label
              className="block text-gray-700 font-semibold mb-2"
              htmlFor="description"
            >
              Descrição
            </label>
            <input
              ref={descriptionRef}
              type="text"
              id="description"
              className="input w-full p-2 shadow rounded-lg border border-gray-700 border-opacity-20 "
              placeholder="Descrição do produto"
            />
          </div>

          <div>
            <label
              className="block text-gray-700 font-semibold mb-2"
              htmlFor="supplier"
            >
              Fornecedor
            </label>
            <input
              ref={supplierRef}
              type="text"
              id="supplier"
              className="input w-full p-2 shadow rounded-lg border border-gray-700 border-opacity-20 "
              placeholder="Fornecedor"
            />
          </div>

          <div>
            <label
              className="block text-gray-700 font-semibold mb-2"
              htmlFor="productCode"
            >
              Código do Produto
            </label>
            <input
              ref={productCodeRef}
              type="text"
              id="productCode"
              className="input w-full p-2 shadow rounded-lg border border-gray-700 border-opacity-20 "
              placeholder="Código do Produto"
            />
          </div>

          <div>
            <label
              className="block text-gray-700 font-semibold mb-2"
              htmlFor="status"
            >
              Status
            </label>
            <select
              ref={statusRef}
              id="status"
              className="input w-full p-2 shadow rounded-lg border border-gray-700 border-opacity-20 "
              required
            >
              <option value="Disponivel">Disponível</option>
              <option value="Vendido">Vendido</option>
              <option value="Em pagamento">Em pagamento</option>
            </select>
          </div>

          <div>
            <label
              className="block text-gray-700 font-semibold mb-2"
              htmlFor="clientID"
            >
              Cliente
            </label>
            <select
              ref={clientIDRef}
              id="clientID"
              className="input w-full p-2 shadow rounded-lg border border-gray-700 border-opacity-20 "
            >
              <option value="">Selecione um cliente (opcional)</option>
              {customers.map((client) => (
                <option key={client.id} value={client.id}>
                  {client.name}
                </option>
              ))}
            </select>
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-[#181818] text-white font-semibold rounded-md hover:bg-[#333333] transition-all"
            disabled={loading}
          >
            {loading ? 'Carregando...' : 'Salvar Alterações'}
          </button>

          {message && (
            <p className="mt-4 text-center text-green-600 font-semibold">
              {message}
            </p>
          )}
        </form>
      </div>
    </div>
  )
}
