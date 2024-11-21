'use client'
import { HomeForm } from './component'
import { useEffect } from 'react'
import router from 'next/router'

export default function Login() {
  useEffect(() => {
    const token = localStorage.getItem('token')

    if (!token) {
      router.push('/')
    }
  }, [router])

  return (
    <div className="flex flex-col min-h-screen justify-center items-center bg-gray-100">
      <div className="bg-white shadow-lg rounded-lg p-8 max-w-xl w-full text-center">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">
          Gerenciamento de Inventário
        </h1>
        <p className="text-lg text-gray-600 mb-6">
          Selecione uma ação abaixo para prosseguir:
        </p>
        <HomeForm />
      </div>
    </div>
  )
}
