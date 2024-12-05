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
        .get(`${baseUrl}/client/${id}`)
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
      await axios.put(`${baseUrl}/product/${id}/client`, client)
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
    <div className="bg-[#181818] h-screen">
      <div className="container mx-auto p-4 max-w-[900px]">
        <h1 className="text-2xl font-bold mb-4 text-[#e3e3e3]">
          Editar cliente
        </h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex flex-col">
            <label className="mb-1 font-semibold text-[#e3e3e3]">Name:</label>
            <input
              type="text"
              name="name"
              value={client?.name || ''}
              onChange={handleInputChange}
              className="p-2 border border-gray-300 rounded"
            />
          </div>
          <div className="flex flex-col">
            <label className="mb-1 font-semibold text-[#e3e3e3]">Email:</label>
            <input
              type="email"
              name="email"
              value={client?.email || ''}
              onChange={handleInputChange}
              className="p-2 border border-gray-300 rounded"
            />
          </div>
          <div className="flex flex-col">
            <label className="mb-1 font-semibold text-[#e3e3e3]">Phone:</label>
            <input
              type="text"
              name="phone"
              value={client?.phone || ''}
              onChange={handleInputChange}
              className="p-2 border border-gray-300 rounded"
            />
          </div>
          <button
            type="submit"
            className="px-4 py-2 bg-[#252525] text-white rounded hover:bg-[#414141] ease-linear transition-all"
          >
            Salvar
          </button>
        </form>
      </div>
      <button
        onClick={() => router.back()}
        className="fixed bottom-4 right-4 bg-[#333333] hover:bg-[#1f1f1f] text-white p-4 rounded-full shadow-lg transition duration-300"
        title="Voltar para a página anterior"
      >
        <Undo2 />
      </button>
    </div>
  )
}
