'use client'
import { useEffect, useState } from 'react'
import { api } from '@/app/services/api'
import { DollarSign, Home, Pencil, Trash2 } from 'lucide-react'
import { baseUrl } from '@/helpers/url'
import { useRouter } from 'next/navigation'
import { IClient } from '@/interface/interfaces'

export default function Clients() {
  const router = useRouter()
  const [customers, setCustomers] = useState<IClient[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [showConfirm, setShowConfirm] = useState(false)
  const [selectedClient, setSelectedClient] = useState<IClient | null>(null)
  const [message, setMessage] = useState<string>('') // Novo estado para a mensagem

  useEffect(() => {
    loadCustomers()
  }, [])

  async function loadCustomers() {
    try {
      const response = await api.get(`${baseUrl}/clients`)
      setCustomers(response.data)
    } catch (error) {
      console.error('Failed to load customers', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteConfirmed = async () => {
    if (!selectedClient) {
      return
    }

    try {
      const response = await api.delete(
        `${baseUrl}/client/${selectedClient.id}`,
      )
      if (response.status === 200) {
        // Atualiza o estado para exibir a mensagem de sucesso
        setMessage('Cliente excluído com sucesso!')
        const allCustomers = customers.filter(
          (customer) => customer.id !== selectedClient.id,
        )
        setCustomers(allCustomers)
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch {
      setMessage('Erro ao excluir o cliente. Tente novamente.')
    } finally {
      setShowConfirm(false)
      setSelectedClient(null)
    }
  }

  const filteredCustomers = customers.filter((customer) =>
    customer.name.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  function formatPhoneNumber(phone: string): string {
    const cleaned = phone.replace(/\D/g, '')
    if (cleaned.length !== 11) return phone

    const ddd = cleaned.slice(0, 2)
    const firstPart = cleaned.slice(2, 3)
    const secondPart = cleaned.slice(3, 7)
    const thirdPart = cleaned.slice(7)

    return `(${ddd}) ${firstPart} ${secondPart}-${thirdPart}`
  }

  return (
    <div className="p-4 flex flex-col justify-center items-center min-h-screen bg-[#181818]">
      <h1 className="text-xl font-semibold text-[#e3e3e3] mb-4">Clientes</h1>
      <p className="text-[#e3e3e3] mb-4">
        Selecione um cliente para visualizar suas vendas
      </p>
      {message && (
        <div className="mb-4 text-center text-white bg-green-500 p-2 rounded-lg">
          {message}
        </div>
      )}

      <div className="w-full max-w-4xl p-6 bg-[#242424] shadow-lg rounded-lg max-h-[600px] overflow-x-auto">
        <div className="mb-4 w-full">
          <input
            type="text"
            placeholder="Pesquise o nome"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full p-3 bg-[#181818] shadow-md rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white placeholder-[#e3e3e3]"
          />
        </div>

        {loading ? (
          <p className="text-[#e3e3e3]">Carregando clientes...</p>
        ) : filteredCustomers.length === 0 ? (
          <p className="text-[#e3e3e3]">Nenhum cliente encontrado</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="table-auto w-full bg-[#242424] shadow-md rounded-lg text-white">
              <thead>
                <tr className="bg-[#333333] text-gray-300">
                  <th className="px-4 py-2 text-left">Nome</th>
                  <th className="px-4 py-2 text-left">Email</th>
                  <th className="px-4 py-2 text-left">Telefone</th>
                  <th className="px-4 py-2 text-left">Ações</th>
                </tr>
              </thead>
              <tbody>
                {filteredCustomers.map((customer) => (
                  <tr
                    key={customer.id}
                    className="border-t border-[#444444] hover:bg-[#333333] even:bg-[#2c2c2c] transition-all duration-300"
                  >
                    <td className="px-4 py-2">
                      {customer.name || 'Não informado'}
                    </td>
                    <td className="px-4 py-2">
                      {customer.email || 'Não informado'}
                    </td>
                    <td className="px-4 py-2">
                      {formatPhoneNumber(customer.phone ?? '') ||
                        'Não informado'}
                    </td>
                    <td className="px-4 py-2 flex">
                      <div
                        className="flex items-center font-bold text-red-500 hover:text-red-700 cursor-pointer ease-linear transition-all mr-2"
                        onClick={() => {
                          setShowConfirm(true)
                          setSelectedClient(customer)
                        }}
                        title="Deletar cliente"
                      >
                        <Trash2 size={18} />
                      </div>
                      <div
                        className="flex items-center font-bold text-green-500 hover:text-green-700 cursor-pointer ease-linear transition-all mr-2"
                        onClick={() => router.push(`/clients/${customer.id}`)}
                        title="Visualizar vendas"
                      >
                        <DollarSign size={18} />
                      </div>
                      <div
                        className="flex items-center font-bold text-yellow-500 hover:text-yellow-700 cursor-pointer ease-linear transition-all"
                        onClick={() =>
                          router.push(`/clients/${customer.id}/edit`)
                        }
                        title="Editar cliente"
                      >
                        <Pencil size={18} />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {showConfirm && selectedClient && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-[#242424] p-6 rounded-lg shadow-lg text-white">
            <h2 className="text-lg font-semibold mb-4">Confirmar Exclusão</h2>
            <p className="mb-4">
              Tem certeza que deseja deletar o cliente{' '}
              <span className="font-semibold">{selectedClient.name}</span>?
            </p>
            <div className="flex justify-end">
              <button
                onClick={() => {
                  setShowConfirm(false)
                  setSelectedClient(null)
                }}
                className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold py-2 px-4 rounded mr-2"
              >
                Cancelar
              </button>
              <button
                onClick={handleDeleteConfirmed}
                className="bg-red-500 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded"
              >
                Confirmar
              </button>
            </div>
          </div>
        </div>
      )}

      <button
        onClick={() => router.push('/home')}
        className="fixed bottom-4 right-4 bg-[#333333] hover:bg-[#1f1f1f] text-white p-4 rounded-full shadow-lg transition duration-300"
        title="Voltar para a página anterior"
      >
        <Home />
      </button>
    </div>
  )
}
