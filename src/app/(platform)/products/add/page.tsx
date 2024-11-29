'use client'
import React, { useState, useEffect, useRef, FormEvent } from 'react'
import axios from 'axios'
import { baseUrl } from '@/helpers/url'
import { IClient } from '@/interface/interfaces'

// TODO: Criar uma trava no backend para que não seja possível criar um produto com cliente e com status disponível ao mesmo tempo

export default function CreateProduct() {
  const [clients, setClients] = useState<IClient[]>([])
  const [selectedClientId, setSelectedClientId] = useState<number | null>(null)
  const [message, setMessage] = useState<string | null>(null)
  const [loading, setLoading] = useState<boolean>(false)

  const productNameRef = useRef<HTMLInputElement>(null)
  const productPriceRef = useRef<HTMLInputElement>(null)
  const productCodeRef = useRef<HTMLInputElement>(null)
  const costPriceRef = useRef<HTMLInputElement>(null)
  const supplierRef = useRef<HTMLInputElement>(null)
  const statusRef = useRef<HTMLSelectElement>(null)
  const descriptionRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    async function fetchClients() {
      try {
        const response = await axios.get(`${baseUrl}/clients`)
        setClients(response.data)
      } catch {
        setMessage('Erro ao buscar os clientes.')
      }
    }
    fetchClients()
  }, [])

  async function handleSubmit(event: FormEvent) {
    event.preventDefault()
    setLoading(true)

    if (
      !productNameRef.current?.value ||
      !productPriceRef.current?.value ||
      !productCodeRef.current?.value ||
      !costPriceRef.current?.value ||
      !statusRef.current?.value ||
      !descriptionRef.current?.value
    ) {
      setMessage('Todos os campos obrigatórios devem ser preenchidos.')
      setLoading(false)
      return
    }

    const productData = {
      name: productNameRef.current.value,
      price: parseFloat(productPriceRef.current.value),
      productCode: productCodeRef.current.value,
      cost_price: parseFloat(costPriceRef.current.value),
      supplier: supplierRef.current?.value || '',
      status: statusRef.current.value,
      description: descriptionRef.current.value,
      userID: 1, // Aqui poderia ser o ID do usuário autenticado
    }

    try {
      const endpoint = selectedClientId
        ? `${baseUrl}/client/${selectedClientId}/product`
        : `${baseUrl}/product`

      const response = await axios.post(endpoint, productData)
      setMessage(`Produto adicionado: ${response.data.name}`)
      clearForm()
    } catch {
      setMessage('Erro ao adicionar o produto.')
    } finally {
      setLoading(false)
    }
  }

  function clearForm() {
    if (productNameRef.current) productNameRef.current.value = ''
    if (productPriceRef.current) productPriceRef.current.value = ''
    if (productCodeRef.current) productCodeRef.current.value = ''
    if (costPriceRef.current) costPriceRef.current.value = ''
    if (supplierRef.current) supplierRef.current.value = ''
    if (statusRef.current) statusRef.current.value = 'Disponivel'
    if (descriptionRef.current) descriptionRef.current.value = ''
    setSelectedClientId(null)
  }

  return (
    <div className="flex flex-col justify-center items-center min-h-screen bg-[#252525]">
      <div className="bg-[#e3e3e3] shadow-lg rounded-lg p-8 max-w-sm w-full border border-gray-200">
        <h1 className="text-2xl font-semibold text-gray-800 mb-6 text-center">
          Adicionar Produto
        </h1>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label
              htmlFor="client"
              className="block text-gray-700 font-medium mb-1"
            >
              Cliente
            </label>
            <select
              id="client"
              value={selectedClientId ?? ''}
              onChange={(e) =>
                setSelectedClientId(
                  e.target.value ? Number(e.target.value) : null,
                )
              }
              className={`border rounded-lg w-full p-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#252525]`}
            >
              <option value="">Nenhum cliente associado</option>
              {clients.map((client) => (
                <option key={client.id} value={client.id}>
                  {client.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label
              htmlFor="status"
              className="block text-gray-700 font-medium mb-1"
            >
              Status <span className="text-red-500">*</span>
            </label>
            <select
              id="status"
              ref={statusRef}
              required
              className="border w-full border-gray-300 rounded-lg p-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#252525]"
            >
              <option value="Disponivel">Disponível</option>
              <option value="Vendido">Vendido</option>
              <option value="Em Processamento">Em Processamento</option>
            </select>
          </div>

          <div>
            <label
              htmlFor="productName"
              className="block text-gray-700 font-medium mb-1"
            >
              Nome <span className="text-red-500">*</span>
            </label>
            <input
              id="productName"
              ref={productNameRef}
              type="text"
              className="border w-full border-gray-300 rounded-lg p-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#252525]"
              placeholder="Nome"
              required
            />
          </div>

          <div>
            <label
              htmlFor="productCode"
              className="block text-gray-700 font-medium mb-1"
            >
              Código <span className="text-red-500">*</span>
            </label>
            <input
              id="productCode"
              ref={productCodeRef}
              type="text"
              className="border w-full border-gray-300 rounded-lg p-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#252525]"
              placeholder="Código"
              required
            />
          </div>

          <div>
            <label
              htmlFor="productPrice"
              className="block text-gray-700 font-medium mb-1"
            >
              Preço de venda <span className="text-red-500">*</span>
            </label>
            <input
              id="productPrice"
              ref={productPriceRef}
              type="number"
              className="border w-full border-gray-300 rounded-lg p-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#252525]"
              placeholder="Preço de venda"
              step="0.01"
              required
            />
          </div>

          <div>
            <label
              htmlFor="costPrice"
              className="block text-gray-700 font-medium mb-1"
            >
              Preço de custo <span className="text-red-500">*</span>
            </label>
            <input
              id="costPrice"
              ref={costPriceRef}
              type="number"
              className="border w-full border-gray-300 rounded-lg p-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#252525]"
              placeholder="Preço de custo"
              step="0.01"
              required
            />
          </div>

          <div>
            <label
              htmlFor="supplier"
              className="block text-gray-700 font-medium mb-1"
            >
              Fornecedor
            </label>
            <input
              id="supplier"
              ref={supplierRef}
              type="text"
              className="border w-full border-gray-300 rounded-lg p-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#252525]"
              placeholder="Fornecedor"
            />
          </div>

          <div>
            <label
              htmlFor="description"
              className="block text-gray-700 font-medium mb-1"
            >
              Descrição do produto <span className="text-red-500">*</span>
            </label>
            <input
              id="description"
              ref={descriptionRef}
              type="text"
              className="border w-full border-gray-300 rounded-lg p-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#252525]"
              placeholder="Descrição do produto"
              required
            />
          </div>

          <button
            type="submit"
            className="bg-[#252525] text-white rounded-lg py-3 mt-4 hover:bg-[#4b4b4b] transition-all focus:ring-4 focus:ring-[#252525] disabled:bg-[#252525]"
            disabled={loading}
          >
            {loading ? 'Carregando...' : 'Adicionar Produto'}
          </button>
        </form>

        {message && (
          <p className="mt-4 text-center text-green-600">{message}</p>
        )}
      </div>
    </div>
  )
}
