'use client'
import { useEffect, useState } from 'react'
import { api } from '@/app/services/api'
import { DollarSign, Home, Pencil, Plus, Trash2 } from 'lucide-react'
import { baseUrl } from '@/helpers/url'
import { useRouter } from 'next/navigation'
import { IClient } from '@/interface/interfaces'
import { LoadingCircle } from '@/component/loadingCircle'
import { Title } from '@/component/title'
import { Button } from '@/component/bottom'
import { SearchBar } from '@/component/searchBar'
import CustomTable from '@/component/customTable'
import { formatPhoneNumber } from '@/helpers/format'
import CustomModal from '@/component/modal'
import { BackButton } from '@/component/backButton'

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
        `${baseUrl}/clients/${selectedClient.id}`,
      )
      if (response.status === 200) {
        // Atualiza o estado para exibir a mensagem de sucesso
        setMessage('Cliente excluído com sucesso!')
        const allCustomers = customers.filter(
          (customer) => customer.id !== selectedClient.id,
        )
        setCustomers(allCustomers)
        // Remove a mensagem após 5 segundos
        setTimeout(() => {
          setMessage('')
        }, 5000)
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

  return (
    <div>
      {loading ? (
        <LoadingCircle />
      ) : (
        <div className="flex flex-col items-center min-h-screen bg-[#181818] px-20 py-10">
          {message && (
            <div className="mb-4 text-center text-white bg-green-500 p-2 rounded-lg">
              {message}
            </div>
          )}

          <div className="w-full px-10 py-8 bg-[#181818] border border-gray-500 border-opacity-35 shadow-lg rounded-lg max-h-[780px]">
            <div className="flex justify-between mb-6 w-full items-center">
              <Title title="Clientes" />
              <Button
                icon={<Plus />}
                width="w-76"
                onClick={() => router.push('/clients/add')}
              >
                Criar cliente
              </Button>
            </div>
            <div className="mb-4 w-full">
              <SearchBar
                placeholder="Buscar cliente..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            {loading ? (
              <p className="text-[#e3e3e3]">Carregando clientes...</p>
            ) : filteredCustomers.length === 0 ? (
              <p className="text-[#e3e3e3]">Nenhum cliente encontrado</p>
            ) : (
              <div className="max-h-[500px] overflow-y-auto">
                <CustomTable
                  columns={[
                    { key: 'name', label: 'Nome' },
                    { key: 'email', label: 'Email' },
                    {
                      key: 'phone',
                      label: 'Telefone',
                      formatAs: formatPhoneNumber,
                    },
                  ]}
                  data={filteredCustomers}
                  actions={[
                    {
                      className: 'text-green-400',
                      label: 'Visualizar vendas',
                      icon: <DollarSign size={18} />,
                      onClick: (row) =>
                        router.push(`/clients/${row.id}/payment`),
                    },
                    {
                      className: 'text-yellow-400',
                      label: 'Editar cliente',
                      icon: <Pencil size={18} />,
                      onClick: (row) => router.push(`/clients/${row.id}/edit`),
                    },
                    {
                      className: 'text-red-400',
                      label: 'Deletar cliente',
                      icon: <Trash2 size={18} />,
                      onClick: (row) => {
                        setShowConfirm(true)
                        setSelectedClient(row as IClient)
                      },
                    },
                  ]}
                />
              </div>
            )}
          </div>

          {showConfirm && selectedClient && (
            <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
              <div className="bg-[#242424] p-6 rounded-lg shadow-lg text-white">
                <h2 className="text-lg font-semibold mb-4">
                  Confirmar Exclusão
                </h2>
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

          <CustomModal
            isOpen={showConfirm}
            onClose={() => setShowConfirm(false)}
            title="Confirmar Exclusão"
            message={`Tem certeza que deseja deletar o cliente ${selectedClient?.name}?`}
            actions={[
              {
                label: 'Cancelar',
                onClick: () => {
                  setShowConfirm(false)
                  setSelectedClient(null)
                },
                className:
                  'bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold py-2 px-4 rounded ease-linear transition-all',
              },
              {
                label: 'Confirmar',
                onClick: handleDeleteConfirmed,
                className:
                  'bg-red-500 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded ease-linear transition-all',
              },
            ]}
          />

          <BackButton onClick={() => router.push('/home')}>
            <Home />
          </BackButton>
        </div>
      )}
    </div>
  )
}
