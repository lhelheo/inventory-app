'use client'
import React, { ChangeEvent, FormEvent, useState } from 'react'
import { baseUrl } from '@/helpers/url'
import axios from 'axios'
import { useRouter } from 'next/navigation'
import { Home } from 'lucide-react'
import { Title } from '@/component/title'
import { InputField } from '@/component/inputField'
import { Button } from '@/component/bottom'
import { BackButton } from '@/component/backButton'

// TODO: Adicionar feedback visual para o usuario ao concluir ação e clique para visualizar cliente

interface ClientFormData {
  name: string
  email?: string
  phone: string
  productName?: string
  productPrice?: number
  productCode?: string
}

export default function CreateClient() {
  const router = useRouter()
  const [message, setMessage] = useState<string | null>(null)
  const [formData, setFormData] = useState<ClientFormData>({
    name: '',
    email: '',
    phone: '',
    productName: '',
    productPrice: undefined,
    productCode: '',
  })

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prevData) => ({
      ...prevData,
      [name]: name === 'productPrice' ? Number(value) : value,
    }))
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()

    const token = localStorage.getItem('token')
    if (!token) {
      alert('Usuário não autenticado.')
      return
    }

    let userID: number | undefined
    try {
      const decodedToken = JSON.parse(atob(token.split('.')[1]))
      userID = decodedToken.id
    } catch (error) {
      console.error('Erro ao decodificar o token:', error)
      alert('Erro ao processar o token de autenticação.')
      return
    }

    if (userID === undefined) {
      alert('ID de usuário não encontrado no token.')
      return
    }

    try {
      const response = await axios.post(`${baseUrl}/clients`, {
        ...formData,
        userID,
      })
      console.log(response.data)
      setMessage('Cliente criado com sucesso.')
      clearForm()
    } catch (error) {
      console.error('Erro ao criar cliente:', error)
      alert('Falha ao criar cliente. Verifique os dados e tente novamente.')
    }
  }

  const clearForm = () => {
    setFormData({
      name: '',
      email: '',
      phone: '',
      productName: '',
      productPrice: undefined,
      productCode: '',
    })
  }

  return (
    <div className="flex flex-col h-screen justify-center items-center bg-[#181818]">
      <form
        onSubmit={handleSubmit}
        className="flex flex-col w-full h-min max-w-2xl mx-auto justify-center items-center gap-6 px-10 py-8 border border-gray-500 border-opacity-35 shadow-lg rounded"
      >
        <Title title="Criar Cliente" />

        <div className="grid grid-cols-2 gap-6 w-full">
          <InputField
            label="Nome"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Ex: João da Silva"
            type="text"
          />

          <InputField
            label="Email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Ex: teste@gmail.com"
            type="email"
          />

          <InputField
            label="Telefone"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            placeholder="Ex: (11) 99999-9999"
            type="tel"
          />
        </div>

        <Button type="submit">Salvar</Button>
      </form>

      {message && (
        <div className="my-4">
          <p className="text-center text-green-600">
            Cliente criado com sucesso!
          </p>
          <p
            onClick={() => router.push(`/clients`)}
            className="mt-4 text-center underline cursor-pointer text-green-600"
          >
            Clique aqui para visualizar a lista de clientes
          </p>
        </div>
      )}

      <BackButton onClick={() => router.push('/home')}>
        <Home />
      </BackButton>
    </div>
  )
}
