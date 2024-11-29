'use client'
import { Plus, Eye, PackagePlus, Box, CircleDollarSign } from 'lucide-react'
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
          className="bg-[#181818] hover:bg-[#3e3e3e] text-white py-4 rounded-lg shadow-md flex flex-col items-center  ease-linear transition-all"
        >
          <CircleDollarSign size={32} className="mb-2" />
          <span className="font-medium">Vendas</span>
        </button>

        <button
          onClick={() => handleNavigation('/clients/add')}
          className="bg-[#181818] hover:bg-[#3e3e3e] text-white py-4 rounded-lg shadow-md flex flex-col items-center transition-all"
        >
          <Plus size={32} className="mb-2" />
          <span className="font-medium">Criar Cliente</span>
        </button>

        <button
          onClick={() => handleNavigation('/products')}
          className="bg-[#181818] text-white py-4 rounded-lg shadow-md flex flex-col items-center hover:bg-[#3e3e3e] transition-all"
        >
          <Eye size={32} className="mb-2" />
          <span className="font-medium">Visualizar Produtos</span>
        </button>

        <button
          onClick={() => handleNavigation('/products/add')}
          className="bg-[#181818] text-white py-4 rounded-lg shadow-md flex flex-col items-center hover:bg-[#3e3e3e] transition-all"
        >
          <PackagePlus size={32} className="mb-2" />
          <span className="font-medium">Criar Produto</span>
        </button>

        <button
          onClick={() => handleNavigation('/stock')}
          className="bg-[#181818] text-white py-4 rounded-lg shadow-md flex flex-col items-center hover:bg-[#3e3e3e] transition-all"
        >
          <Box size={32} className="mb-2" />
          <span className="font-medium">Visualizar estoque</span>
        </button>
      </div>
      {loading && (
        <p className="mt-6 text-[#181818]">Carregando, por favor aguarde...</p>
      )}
    </div>
  )
}
