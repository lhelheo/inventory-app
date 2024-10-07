"use client"
import { Eye, PackagePlus, Pencil, Plus, Trash2, User2 } from "lucide-react";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();
  return (
    <div className="flex flex-col min-h-screen justify-center items-center bg-gray-100">
  <div className="bg-white shadow-lg rounded-lg p-8 max-w-xl w-full text-center">
    <h1 className="text-3xl font-bold text-gray-800 mb-4">Gerenciamento de Inventário</h1>
    <p className="text-lg text-gray-600 mb-6">Selecione uma ação abaixo para prosseguir:</p>
    
    <div className="grid grid-cols-2 gap-4">
      <button 
        onClick={() => router.push('/clients')}
        className="bg-blue-500 text-white py-4 rounded-lg shadow-md flex flex-col items-center hover:bg-blue-600 transition-all">
        <User2 size={32} className="mb-2" />
        <span className="font-medium">Visualizar Clientes</span>
      </button>

      <button 
        onClick={() => router.push('/clients/add')}
        className="bg-green-500 text-white py-4 rounded-lg shadow-md flex flex-col items-center hover:bg-green-600 transition-all">
        <Plus size={32} className="mb-2" />
        <span className="font-medium">Adicionar Cliente</span>
      </button>

      <button 
        onClick={() => router.push('/products')}
        className="bg-blue-500 text-white py-4 rounded-lg shadow-md flex flex-col items-center hover:bg-blue-600 transition-all">
        <Eye size={32} className="mb-2" />
        <span className="font-medium">Visualizar Produtos</span>
      </button>

      <button 
        onClick={() => router.push('/products/add')}
        className="bg-green-500 text-white py-4 rounded-lg shadow-md flex flex-col items-center hover:bg-green-600 transition-all">
        <PackagePlus size={32} className="mb-2" />
        <span className="font-medium">Adicionar Produto</span>
      </button>

      <button 
        onClick={() => router.push('/products/edit')}
        className="bg-yellow-500 text-white py-4 rounded-lg shadow-md flex flex-col items-center hover:bg-yellow-600 transition-all">
        <Pencil size={32} className="mb-2" />
        <span className="font-medium">Editar Produto</span>
      </button>

      <button 
        onClick={() => router.push('/products/delete')}
        className="bg-red-500 text-white py-4 rounded-lg shadow-md flex flex-col items-center hover:bg-red-600 transition-all">
        <Trash2 size={32} className="mb-2" />
        <span className="font-medium">Deletar Produto</span>
      </button>
    </div>
  </div>
</div>
  );
};
