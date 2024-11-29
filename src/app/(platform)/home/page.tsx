'use client'
import { HomeForm } from './component'

export default function Login() {
  return (
    <div className="flex flex-col min-h-screen justify-center items-center bg-[#181818]">
      <div className="bg-gray-100 shadow-lg rounded-lg p-8 max-w-xl w-full text-center">
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
