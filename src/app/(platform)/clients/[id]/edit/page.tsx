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
      <div className="w-full border border-gray-500 border-opacity-35 max-w-2xl mx-auto rounded-lg p-6 bg-[#181818]">
        <h2 className="text-2xl font-bold mb-4 text-[#e3e3e3]">
          Editando cliente
        </h2>
        <form onSubmit={handleSubmit} className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <label htmlFor="name" className="block font-medium text-[#e3e3e3]">
              Nome
            </label>
            <input
              id="name"
              name="name"
              placeholder="Digite o nome do cliente"
              value={client?.name}
              onChange={handleInputChange}
              required
              className="w-full p-2 rounded text-[#e3e3e3] bg-[#242424] border border-gray-500 border-opacity-35"
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="email" className="block font-medium text-[#e3e3e3]">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              placeholder="Digite o email do cliente"
              value={client?.email}
              onChange={handleInputChange}
              required
              className="w-full p-2 rounded bg-[#242424] text-[#e3e3e3] border border-gray-500 border-opacity-35"
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="phone" className="block font-medium text-[#e3e3e3]">
              Telefone
            </label>
            <input
              id="phone"
              name="phone"
              type="tel"
              placeholder="Digite o telefone do cliente"
              value={client?.phone}
              onChange={handleInputChange}
              required
              className="w-full p-2 bg-[#242424] rounded text-[#e3e3e3] border border-gray-500 border-opacity-35"
            />
          </div>
          <div className="col-span-2 mt-4">
            <button
              type="submit"
              className="w-full p-3 bg-[#242424] hover:bg-[#333333] font-medium text-white rounded transition-all ease-linear hover:scale-[101%]"
            >
              Salvar
            </button>
          </div>
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
