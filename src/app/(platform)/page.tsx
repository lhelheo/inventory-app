"use client"
import { Eye, PackagePlus, Pencil, Plus, Trash2, User2 } from "lucide-react";
import { useRouter } from "next/navigation";

export const GenericPage = () => {
  const router = useRouter();
  return (
    <div className='flex flex-col h-screen justify-center items-center'>
      <p className="text-xl">Bem-vindo ao sistema de Gerenciamento de Inventário</p>
      <p>Escolha alguma das ações abaixo para prosseguir</p>
      
      <div className="flex gap-3">
        <div className="flex gap-4 mt-4">
          <button onClick={() => router.push('/clients')} 
          className="flex cursor-pointer bg-white rounded-lg p-2 ease-linear transition-all text-blue-500 hover:text-blue-700">
            <User2 size={24} />
            Visualizar clientes
          </button>
          
        </div>
        <div className="flex gap-4 mt-4">
          <button onClick={() => router.push('/clients/add')} 
            className="flex cursor-pointer bg-white rounded-lg p-2 ease-linear transition-all text-blue-500 hover:text-blue-700">
              <Plus size={24} />
              Adicionar clientes
            </button>
        </div>
        <div className="flex gap-4 mt-4">
          <button 
            onClick={() => router.push('/products/add')} 
            className="flex cursor-pointer bg-white rounded-lg p-2 ease-linear transition-all text-blue-500 hover:text-blue-700">
              <PackagePlus size={24} />
              Adicionar produto
            </button>
        </div>
        <div className="flex gap-4 mt-4">
          <button onClick={() => router.push('/products')} 
            className="flex cursor-pointer bg-white rounded-lg p-2 ease-linear transition-all text-blue-500 hover:text-blue-700">
              <Eye size={24}/>
              Visualizar produtos
            </button>
        </div>
        <div className="flex gap-4 mt-4">
          <button onClick={() => router.push('/products/delete')} 
            className="flex cursor-pointer bg-white rounded-lg p-2 ease-linear transition-all text-blue-500 hover:text-blue-700">
              <Trash2 size={24}/>
              Deletar produto
            </button>
        </div>
        <div className="flex gap-4 mt-4">
          <button onClick={() => router.push('/products/edit')} 
            className="flex cursor-pointer bg-white rounded-lg p-2 ease-linear transition-all text-blue-500 hover:text-blue-700">
              <Pencil size={24}/>
              Editar produto
            </button>
        </div>
      </div>
    </div>
  );
};

export default GenericPage;