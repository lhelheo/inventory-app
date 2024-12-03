'use client'
import React, { useState, useEffect, useRef, FormEvent } from 'react'
import axios from 'axios'
import { baseUrl } from '@/helpers/url'
import { IClient } from '@/interface/interfaces'
import { useRouter } from 'next/navigation'

// TODO: Criar uma trava no backend para que não seja possível criar um produto com cliente e com status disponível ao mesmo tempo

export default function CreateProduct() {
  const router = useRouter()
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
    <div className="flex col-auto justify-center items-center min-h-screen bg-[#181818]">
      <div className="bg-[#242424] shadow-lg rounded-lg p-8 max-w-[1200px] w-full border border-[#444444]">
        <h1 className="text-2xl font-semibold text-[#e3e3e3] mb-6 text-center">
          Adicionar Produto
        </h1>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <label
                htmlFor="client"
                className="block text-[#e3e3e3] font-medium mb-1"
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
                className="border rounded-lg w-full p-3 text-[#e3e3e3] bg-[#333333] focus:outline-none focus:ring-2 focus:ring-[#181818]"
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
                className="block text-[#e3e3e3] font-medium mb-1"
              >
                Status <span className="text-red-500">*</span>
              </label>
              <select
                id="status"
                ref={statusRef}
                required
                className="border w-full border-[#444444] rounded-lg p-3 text-[#e3e3e3] bg-[#333333] focus:outline-none focus:ring-2 focus:ring-[#181818]"
              >
                <option value="Disponivel">Disponível</option>
                <option value="Vendido">Vendido</option>
                <option value="Em Processamento">
                  Aguardando pagamento...
                </option>
              </select>
            </div>

            <div>
              <label
                htmlFor="productName"
                className="block text-[#e3e3e3] font-medium mb-1"
              >
                Produto <span className="text-red-500">*</span>
              </label>
              <input
                id="productName"
                ref={productNameRef}
                type="text"
                className="border w-full border-[#444444] rounded-lg p-3 text-[#e3e3e3] bg-[#333333] focus:outline-none focus:ring-2 focus:ring-[#181818]"
                required
              />
            </div>

            <div>
              <label
                htmlFor="productCode"
                className="block text-[#e3e3e3] font-medium mb-1"
              >
                Código <span className="text-red-500">*</span>
              </label>
              <input
                id="productCode"
                ref={productCodeRef}
                type="text"
                className="border w-full border-[#444444] rounded-lg p-3 text-[#e3e3e3] bg-[#333333] focus:outline-none focus:ring-2 focus:ring-[#181818]"
                required
              />
            </div>

            <div>
              <label
                htmlFor="productPrice"
                className="block text-[#e3e3e3] font-medium mb-1"
              >
                Preço de venda <span className="text-red-500">*</span>
              </label>
              <input
                id="productPrice"
                ref={productPriceRef}
                type="number"
                className="border w-full border-[#444444] rounded-lg p-3 text-[#e3e3e3] bg-[#333333] focus:outline-none focus:ring-2 focus:ring-[#181818]"
                step="0.01"
                required
              />
            </div>

            <div>
              <label
                htmlFor="costPrice"
                className="block text-[#e3e3e3] font-medium mb-1"
              >
                Preço de custo <span className="text-red-500">*</span>
              </label>
              <input
                id="costPrice"
                ref={costPriceRef}
                type="number"
                className="border w-full border-[#444444] rounded-lg p-3 text-[#e3e3e3] bg-[#333333] focus:outline-none focus:ring-2 focus:ring-[#181818]"
                step="0.01"
                required
              />
            </div>

            <div>
              <label
                htmlFor="supplier"
                className="block text-[#e3e3e3] font-medium mb-1"
              >
                Fornecedor
              </label>
              <input
                id="supplier"
                ref={supplierRef}
                type="text"
                className="border w-full border-[#444444] rounded-lg p-3 text-[#e3e3e3] bg-[#333333] focus:outline-none focus:ring-2 focus:ring-[#181818]"
              />
            </div>

            <div>
              <label
                htmlFor="description"
                className="block text-[#e3e3e3] font-medium mb-1"
              >
                Descrição do produto <span className="text-red-500">*</span>
              </label>
              <input
                id="description"
                ref={descriptionRef}
                type="text"
                className="border w-full border-[#444444] rounded-lg p-3 text-[#e3e3e3] bg-[#333333] focus:outline-none focus:ring-2 focus:ring-[#181818]"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            className="bg-[#181818] text-[#e3e3e3] rounded-lg py-3 mt-4 hover:bg-[#1f1f1f] transition-all focus:ring-4 focus:ring-[#181818] disabled:bg-[#181818]"
            disabled={loading}
          >
            {loading ? 'Carregando...' : 'Adicionar Produto'}
          </button>
        </form>

        {message && (
          <p className="mt-4 text-center text-green-600">{message}</p>
        )}

        <button
          onClick={() => router.back()}
          className="fixed bottom-4 right-4 bg-[#333333] hover:bg-[#464646] text-white p-4 rounded shadow-lg transition duration-300"
          title="Voltar para a página anterior"
        >
          ←
        </button>
      </div>
    </div>
  )
}
