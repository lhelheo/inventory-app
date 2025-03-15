'use client'
import React, { useState, useEffect, useRef, FormEvent } from 'react'
import axios from 'axios'
import { baseUrl } from '@/helpers/url'
import { IClient } from '@/interface/interfaces'
import { useRouter } from 'next/navigation'
import { Home } from 'lucide-react'

export default function CreateProduct() {
  const router = useRouter()
  const [clients, setClients] = useState<IClient[]>([])
  const [selectedClientId, setSelectedClientId] = useState<number | null>(null)
  const [message, setMessage] = useState<string | null>(null)
  const [loading, setLoading] = useState<boolean>(false)
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [newProductId, setNewProductId] = useState<number | null>(null)

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
      userID: 1,
    }

    try {
      const endpoint = selectedClientId
        ? `${baseUrl}/clients/${selectedClientId}/products`
        : `${baseUrl}/products`

      const response = await axios.post(endpoint, productData)
      setMessage(`Produto adicionado: ${response.data.name}`)
      setNewProductId(response.data.id)
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
    <div className="flex flex-col col-auto justify-center items-center min-h-screen bg-[#181818]">
      <h1 className="text-3xl font-bold text-[#e3e3e3] mb-6 text-center">
        Adicionar Produto
      </h1>
      <div className="bg-[#242424] shadow-lg rounded-lg px-10 py-8 max-w-[1200px] w-full  ">
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
                className="rounded-lg w-full p-3 text-[#e3e3e3] bg-[#181818] focus:outline-none focus:ring-2 focus:ring-[#181818]"
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
                className="w-full rounded-lg p-3 text-[#e3e3e3] bg-[#181818] focus:outline-none focus:ring-2 focus:ring-[#181818]"
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
                className="w-full rounded-lg p-3 text-[#e3e3e3] bg-[#181818] focus:outline-none focus:ring-2 focus:ring-[#181818]"
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
                className=" w-full  rounded-lg p-3 text-[#e3e3e3] bg-[#181818] focus:outline-none focus:ring-2 focus:ring-[#181818]"
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
                className=" w-full  focus:outline-none focus:ring-2 focus:ring-[#181818] rounded-lg p-3 text-[#e3e3e3] bg-[#181818] "
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
                className=" w-full  rounded-lg p-3 text-[#e3e3e3] bg-[#181818] focus:outline-none focus:ring-2 focus:ring-[#181818]"
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
                className=" w-full  rounded-lg p-3 text-[#e3e3e3] bg-[#181818] focus:outline-none focus:ring-2 focus:ring-[#181818]"
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
                className=" w-full  rounded-lg p-3 text-[#e3e3e3] bg-[#181818] focus:outline-none focus:ring-2 focus:ring-[#181818]"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            className="bg-[#181818] hover:bg-[#1f1f1f] text-[#e3e3e3] rounded-lg py-3 mt-4 ease-linear transition-all focus:ring-4 focus:ring-[#181818] disabled:bg-[#181818]"
            disabled={loading}
          >
            {loading ? 'Carregando...' : 'Salvar'}
          </button>
        </form>

        <button
          onClick={() => router.push('/home')}
          className="fixed bottom-4 right-4 bg-[#181818] hover:bg-[#1f1f1f] text-white p-4 rounded-full shadow-lg transition duration-300"
          title="Voltar para a página anterior"
        >
          <Home />
        </button>
      </div>

      {message && (
        <div className="my-4">
          <p className="text-center text-green-600">
            Produto criado com sucesso!
          </p>
          <p
            onClick={() => router.push(`/products/${newProductId}`)}
            className="mt-4 text-center underline cursor-pointer text-green-600"
          >
            Clique aqui para visualizar o produto
          </p>
        </div>
      )}
    </div>
  )
}
