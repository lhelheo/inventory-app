'use client'
import React, { ChangeEvent, FormEvent, useState } from 'react'
import { baseUrl } from '@/helpers/url'
import axios from 'axios'
import { useRouter } from 'next/navigation'
import { Home } from 'lucide-react'

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
        className="flex flex-col w-full h-min max-w-md mx-auto justify-center items-center gap-6 px-10 py-8 bg-[#242424] shadow-lg rounded-lg"
      >
        <h2 className="text-2xl font-semibold text-center text-[#e3e3e3]">
          Criar Cliente
        </h2>

        <div className="flex flex-col w-full">
          <label htmlFor="name" className="text-[#e3e3e3] font-medium mb-1">
            Nome
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            className=" rounded-lg p-3 bg-[#181818] text-[#e3e3e3] transition duration-200 focus:outline-none focus:ring-2 focus:ring-blue-600"
          />
        </div>

        <div className="flex flex-col w-full">
          <label htmlFor="email" className="text-[#e3e3e3] font-medium mb-1">
            Email
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className=" rounded-lg p-3 bg-[#181818] text-[#e3e3e3] transition duration-200 focus:outline-none focus:ring-2 focus:ring-blue-600"
          />
        </div>

        <div className="flex flex-col w-full">
          <label htmlFor="phone" className="text-[#e3e3e3] font-medium mb-1">
            Telefone
          </label>
          <input
            type="tel"
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            required
            className=" rounded-lg p-3 bg-[#181818] text-[#e3e3e3] transition duration-200 focus:outline-none focus:ring-2 focus:ring-blue-600"
          />
        </div>

        <button
          type="submit"
          className="bg-[#3b82f6] hover:bg-[#2563eb] text-[#e3e3e3] rounded-lg py-3 mt-6 w-full transition duration-200"
        >
          Salvar
        </button>
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

      <button
        onClick={() => router.push('/home')}
        className="fixed bottom-4 right-4 bg-[#181818] hover:bg-[#1f1f1f] text-white p-4 rounded-full shadow-lg transition duration-300"
        title="Voltar para a página anterior"
      >
        <Home />
      </button>
    </div>
  )
}
