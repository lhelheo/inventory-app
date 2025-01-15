'use client'
import { Plus, Eye, PackagePlus, Box, User } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

export const HomeForm = () => {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  const handleNavigation = (path: string) => {
    setLoading(true)
    router.push(path)
  }
  return (
    <>
      <div className="bg-[#242424] shadow-lg rounded-lg p-8 max-w-xl w-full text-center">
        <h1 className="text-3xl font-bold text-[#e3e3e3] mb-4">Início</h1>
        <p className="text-lg text-[#e3e3e3] mb-6">
          Selecione uma ação abaixo para prosseguir:
        </p>
        <div className="grid grid-cols-1 gap-3">
          <button
            onClick={() => handleNavigation('/clients')}
            className="bg-[#181818] hover:bg-[#1f1f1f] text-white py-4 rounded-lg shadow-md flex p-6 justify-start items-center  ease-linear transition-all"
          >
            <div className="flex items-center gap-3">
              <User size={32} />
              <span className="font-medium">Gerenciar Clientes</span>
            </div>
          </button>

          <button
            onClick={() => handleNavigation('/products')}
            className="bg-[#181818] hover:bg-[#1f1f1f] text-white py-4 rounded-lg shadow-md flex p-6 justify-start items-center  ease-linear transition-all "
          >
            <div className="flex items-center gap-3">
              <Eye size={32} />
              <span className="font-medium">Visualizar Produtos</span>
            </div>
          </button>

          <button
            onClick={() => handleNavigation('/products/add')}
            className="bg-[#181818] hover:bg-[#1f1f1f] text-white py-4 rounded-lg shadow-md flex p-6 justify-start items-center ease-linear transition-all "
          >
            <div className="flex items-center gap-3">
              <PackagePlus size={32} />
              <span className="font-medium">Criar Produto</span>
            </div>
          </button>

          <button
            onClick={() => handleNavigation('/stock')}
            className="bg-[#181818] hover:bg-[#1f1f1f] text-white py-4 rounded-lg shadow-md flex p-6 justify-start items-center  ease-linear transition-all "
          >
            <div className="flex items-center gap-3">
              <Box size={32} />
              <span className="font-medium">Visualizar estoque</span>
            </div>
          </button>
        </div>
      </div>
      {loading && (
        <p className="mt-6 text-[#e3e3e3]">Carregando, por favor aguarde...</p>
      )}
    </>
  )
}
