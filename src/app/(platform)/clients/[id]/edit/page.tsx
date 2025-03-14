'use client'
import { ChangeEvent, FormEvent, useEffect, useState } from 'react'
import axios from 'axios'
import { baseUrl } from '@/helpers/url'
import { useRouter } from 'next/navigation'
import { IClient } from '@/interface/interfaces'
import { Undo2 } from 'lucide-react'
import { Title } from '@/component/title'
import { InputField } from '@/component/inputField'
import { Form } from '@/component/form'
import { BackButton } from '@/component/backButton'

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
        <Title title="Editando cliente" />
        <Form onSubmit={handleSubmit}>
          <InputField
            label="Nome"
            name="name"
            id="name"
            placeholder="Digite o nome do cliente"
            value={client?.name}
            onChange={handleInputChange}
            type="text"
          />

          <InputField
            label="Email"
            name="email"
            id="email"
            placeholder="Digite o email do cliente"
            value={client?.email}
            onChange={handleInputChange}
            type="email"
          />

          <InputField
            label="Telefone"
            name="phone"
            id="phone"
            placeholder="Digite o telefone do cliente"
            value={client?.phone}
            onChange={handleInputChange}
            type="tel"
          />

          <div className="col-span-2 mt-4">
            <button
              type="submit"
              className="w-full p-3 bg-[#242424] hover:bg-[#333333] font-medium text-white rounded transition-all ease-linear hover:scale-[101%]"
            >
              Salvar
            </button>
          </div>
        </Form>
      </div>
      <BackButton onClick={() => router.back()}>
        <Undo2 />
      </BackButton>
    </div>
  )
}
