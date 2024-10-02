"use client"
import { useRouter } from "next/navigation";

export default function GenericPage() {
  const router = useRouter();
  return (
    <div className='flex flex-col h-screen justify-center items-center'>
      <p className="text-xl">Bem-vindo ao sistema de Gerenciamento de Inventário</p>
      <p>Escolha alguma das ações abaixo para prosseguir</p>
      <div className="flex gap-3">
        <div className="flex gap-4 mt-4">
          <button onClick={() => router.push('/clients')} className="cursor-pointer bg-white rounded-lg p-2 ease-linear transition-all text-blue-500 hover:text-blue-700">Visualizar clientes</button>
        </div>
        <div className="flex gap-4 mt-4">
          <button onClick={() => router.push('/clients/add')} className="cursor-pointer bg-white rounded-lg p-2 ease-linear transition-all text-blue-500 hover:text-blue-700">Adicionar clientes</button>
        </div>
        <div className="flex gap-4 mt-4">
          <button 
            onClick={() => router.push('/products/client')} 
            className="cursor-pointer bg-white rounded-lg p-2 ease-linear transition-all text-blue-500 hover:text-blue-700">Adicionar produto</button>
        </div>
        <div className="flex gap-4 mt-4">
          <button onClick={() => router.push('/products')} className="cursor-pointer bg-white rounded-lg p-2 ease-linear transition-all text-blue-500 hover:text-blue-700">Visualizar produtos</button>
        </div>
        <div className="flex gap-4 mt-4">
          <button onClick={() => router.push('/products/delete')} className="cursor-pointer bg-white rounded-lg p-2 ease-linear transition-all text-blue-500 hover:text-blue-700">Deletar produto</button>
        </div>
        <div className="flex gap-4 mt-4">
          <button onClick={() => router.push('/products/edit')} className="cursor-pointer bg-white rounded-lg p-2 ease-linear transition-all text-blue-500 hover:text-blue-700">Editar produto</button>
        </div>
      </div>
    </div>
  );
};