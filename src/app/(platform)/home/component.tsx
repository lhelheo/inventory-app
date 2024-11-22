'use client'
import { User2, Plus, Eye, PackagePlus, Box, Trash2 } from 'lucide-react'
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
    <div>
      <div className="grid grid-cols-2 gap-4">
        <button
          onClick={() => handleNavigation('/clients')}
          className="bg-blue-500 text-white py-4 rounded-lg shadow-md flex flex-col items-center hover:bg-blue-600 transition-all"
        >
          <User2 size={32} className="mb-2" />
          <span className="font-medium">Visualizar Clientes</span>
        </button>

        <button
          onClick={() => handleNavigation('/clients/add')}
          className="bg-green-500 text-white py-4 rounded-lg shadow-md flex flex-col items-center hover:bg-green-600 transition-all"
        >
          <Plus size={32} className="mb-2" />
          <span className="font-medium">Adicionar Cliente</span>
        </button>

        <button
          onClick={() => handleNavigation('/products')}
          className="bg-blue-500 text-white py-4 rounded-lg shadow-md flex flex-col items-center hover:bg-blue-600 transition-all"
        >
          <Eye size={32} className="mb-2" />
          <span className="font-medium">Visualizar Produtos</span>
        </button>

        <button
          onClick={() => handleNavigation('/products/add')}
          className="bg-green-500 text-white py-4 rounded-lg shadow-md flex flex-col items-center hover:bg-green-600 transition-all"
        >
          <PackagePlus size={32} className="mb-2" />
          <span className="font-medium">Adicionar Produto</span>
        </button>

        <button
          onClick={() => handleNavigation('/stock')}
          className="bg-blue-500 text-white py-4 rounded-lg shadow-md flex flex-col items-center hover:bg-blue-600 transition-all"
        >
          <Box size={32} className="mb-2" />
          <span className="font-medium">Visualizar estoque</span>
        </button>

        <button
          onClick={() => handleNavigation('/products/delete')}
          className="bg-red-500 text-white py-4 rounded-lg shadow-md flex flex-col items-center hover:bg-red-600 transition-all"
        >
          <Trash2 size={32} className="mb-2" />
          <span className="font-medium">Deletar Produto</span>
        </button>
      </div>
      {loading && (
        <p className="mt-6 text-blue-600">Carregando, por favor aguarde...</p>
      )}
    </div>
  )
}