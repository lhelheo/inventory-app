'use client'
import { ChangeEvent, FormEvent, useEffect, useState } from 'react'
import axios from 'axios'
import { baseUrl } from '@/helpers/url'
import { useRouter } from 'next/navigation'
import { IClient } from '@/interface/interfaces'
import { Undo2 } from 'lucide-react'

interface EditClientPageProps {
  params: {
    id: string
  }
}

export default function EditClientPage(props: EditClientPageProps) {
  const router = useRouter()
  const id = props.params.id
  const [client, setClient] = useState<IClient | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  async function loadClient() {
    if (id) {
      axios
        .get(`${baseUrl}/clients/${id}`)
        .then((response) => {
          setClient(response.data)
          setLoading(false)
        })
        .catch((error) => {
          setError(error)
          setLoading(false)
        })
    }
  }

  useEffect(() => {
    loadClient()
  }, [])

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setClient((prevClient) =>
      prevClient ? { ...prevClient, [name]: value } : prevClient,
    )
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setLoading(true)

    try {
      await axios.put(`${baseUrl}/products/${id}/clients`, client)
      router.push('/clients')
    } catch (error) {
      console.error('Failed to update client', error)
      setError('Failed to update client')
    } finally {
      setLoading(false)
    }
  }

  if (loading)
    return (
      <div className="h-screen w-full bg-[#181818]">
        <p className="text-[#e3e3e3]">Carregando dados do cliente...</p>
      </div>
    )
  if (error)
    return (
      <div className="h-screen w-full bg-[#181818]">
        <p className="text-[#e3e3e3]">Erro ao carregar dados do cliente.</p>
      </div>
    )

  return (
    <div className="bg-[#181818] min-h-screen flex flex-col items-center justify-center">
      <h1 className="text-3xl font-bold text-center mb-6 text-[#e3e3e3]">
        Editar cliente
      </h1>
      <div className="bg-[#242424] rounded-lg shadow-lg container mx-auto max-w-lg px-10 py-7">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex flex-col">
            <label className="mb-2 text-sm font-semibold text-[#e3e3e3]">
              Nome:
            </label>
            <input
              type="text"
              name="name"
              value={client?.name || ''}
              onChange={handleInputChange}
              className="p-3 rounded bg-[#181818] text-[#e3e3e3] shadow focus:outline-none focus:ring-2 focus:ring-[#3b82f6]"
              placeholder="Digite o nome"
            />
          </div>
          <div className="flex flex-col">
            <label className="mb-2 text-sm font-semibold text-[#e3e3e3]">
              Email:
            </label>
            <input
              type="email"
              name="email"
              value={client?.email || ''}
              onChange={handleInputChange}
              className="p-3 rounded bg-[#181818] text-[#e3e3e3] shadow focus:outline-none focus:ring-2 focus:ring-[#3b82f6]"
              placeholder="Digite o email"
            />
          </div>
          <div className="flex flex-col">
            <label className="mb-2 text-sm font-semibold text-[#e3e3e3]">
              Telefone:
            </label>
            <input
              type="text"
              name="phone"
              value={client?.phone || ''}
              onChange={handleInputChange}
              className="p-3 mb-3 rounded bg-[#181818] text-[#e3e3e3] shadow focus:outline-none focus:ring-2 focus:ring-[#3b82f6]"
              placeholder="Digite o telefone"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-[#3b82f6] hover:bg-[#2563eb] text-[#e3e3e3] rounded-lg py-3 ease-linear transition-all focus:ring-4 focus:ring-[#181818] disabled:bg-[#181818]"
            disabled={loading}
          >
            {loading ? 'Carregando...' : 'Adicionar Produto'}
          </button>
        </form>
        <button
          onClick={() => router.back()}
          className="fixed bottom-4 right-4 bg-[#333333] hover:bg-[#1f1f1f] text-white p-4 rounded-full shadow-lg transition duration-300"
          title="Voltar para a página anterior"
        >
          <Undo2 />
        </button>
      </div>
    </div>
  )
}
