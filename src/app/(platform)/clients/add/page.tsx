'use client'
import React, { ChangeEvent, FormEvent, useState } from 'react'
import { baseUrl } from '@/helpers/url'
import axios from 'axios'

interface ClientFormData {
  name: string
  email?: string
  phone: string
  productName?: string
  productPrice?: number
  productCode?: string
}

export default function CreateClient() {
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

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
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
      const response = await axios.post(`${baseUrl}/client`, {
        ...formData,
        userID,
      })
      console.log(response.data)
      alert('Cliente criado com sucesso!')
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
    <div className="flex h-screen justify-center items-center">
      <form
        onSubmit={handleSubmit}
        className="flex flex-col w-full h-min max-w-md mx-auto justify-center items-center gap-6 p-6 bg-white shadow-lg rounded-lg"
      >
        <h2 className="text-2xl font-semibold text-center">Criar Cliente</h2>

        <div className="flex flex-col w-full">
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            placeholder="Nome"
            className="border border-gray-300 rounded-lg p-3 transition duration-200 focus:outline-none focus:ring-2 focus:ring-blue-600"
          />
        </div>

        <div className="flex flex-col w-full">
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Email"
            className="border border-gray-300 rounded-lg p-3 transition duration-200 focus:outline-none focus:ring-2 focus:ring-blue-600"
          />
        </div>

        <div className="flex flex-col w-full">
          <input
            type="tel"
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            required
            placeholder="Telefone"
            className="border border-gray-300 rounded-lg p-3 transition duration-200 focus:outline-none focus:ring-2 focus:ring-blue-600"
          />
        </div>

        <div>Opcional: Criação de produto</div>

        <div className="flex flex-col w-full">
          <input
            type="text"
            id="productName"
            name="productName"
            value={formData.productName}
            onChange={handleChange}
            placeholder="Nome do produto"
            className="border border-gray-300 rounded-lg p-3 transition duration-200 focus:outline-none focus:ring-2 focus:ring-blue-600"
          />
        </div>

        <div className="flex flex-col w-full">
          <input
            type="number"
            id="productPrice"
            name="productPrice"
            value={
              formData.productPrice !== undefined ? formData.productPrice : ''
            }
            onChange={handleChange}
            placeholder="Preço do produto"
            className="border border-gray-300 rounded-lg p-3 transition duration-200 focus:outline-none focus:ring-2 focus:ring-blue-600"
          />
        </div>

        <div className="flex flex-col w-full">
          <input
            type="text"
            id="productCode"
            name="productCode"
            value={formData.productCode}
            onChange={handleChange}
            placeholder="Código do produto"
            className="border border-gray-300 rounded-lg p-3 transition duration-200 focus:outline-none focus:ring-2 focus:ring-blue-600"
          />
        </div>

        <button
          type="submit"
          className="bg-blue-600 text-white rounded-lg py-3 mt-6 w-full hover:bg-blue-500 transition duration-200"
        >
          Criar Cliente
        </button>
      </form>
    </div>
  )
}
