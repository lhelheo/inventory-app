'use client'
import { api } from '@/app/services/api'
import { formatData } from '@/helpers/format'
import { baseUrl } from '@/helpers/url'
import { IClient } from '@/interface/interfaces'
import { Undo2 } from 'lucide-react'
import { useParams, useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'

export default function Client() {
  const router = useRouter()
  const { id } = useParams<{ id: string }>()
  const [client, setClient] = useState<IClient>()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadCustomers()
  }, [])

  async function loadCustomers() {
    try {
      const response = await api.get(`${baseUrl}/client/${id}`)
      setClient(response.data)
    } catch (error) {
      console.error('Failed to load customers', error)
    } finally {
      setLoading(false)
    }
  }

  const totalSoldPrice = client?.product
    ?.filter((product) => product.status === 'Vendido')
    .reduce((total, product) => total + Number(product.price), 0)

  const totalPending = client?.product
    .filter(
      (product) => product.status !== 'Vendido' || product.remaining_balance,
    )
    .reduce(
      (total, product) =>
        total + Number(product.remaining_balance ?? product.price),
      0,
    )

  return (
    <>
      {loading ? (
        <p className="flex justify-center text-[#e3e3e3] items-center h-screen bg-[#181818]">
          Carregando cliente...
        </p>
      ) : (
        <div className="flex flex-col h-screen justify-center items-center bg-[#181818]">
          <div className="flex justify-center w-full max-w-7xl mt-4 items-center">
            <div className="flex flex-col justify-center items-center my-6 p-6 bg-[#242424] shadow-lg rounded-lg w-full max-w-md">
              <h1 className="text-2xl text-white font-semibold mb-4">
                {client?.id} - {client?.name}
              </h1>

              <div className="flex my-6 gap-12">
                <div className="text-center">
                  <h2 className="font-semibold text-lg text-white mb-2">
                    Total em produtos vendidos
                  </h2>
                  <p className="text-3xl text-green-400 font-bold">
                    R$ {totalSoldPrice?.toFixed(2)}
                  </p>
                </div>

                <div className="text-center">
                  <h2 className="font-semibold text-lg text-white mb-2">
                    Total em produtos pendentes
                  </h2>
                  <p className="text-3xl text-yellow-400 font-bold">
                    R$ {totalPending?.toFixed(2)}
                  </p>
                </div>
              </div>

              <button
                onClick={() => router.push(`/clients/${id}/payment`)}
                className="bg-[#181818] hover:bg-[#1f1f1f] transition ease-in-out duration-300 text-white font-bold py-2 px-6 rounded-lg mt-4"
              >
                Realizar Pagamento
              </button>
            </div>
          </div>

          <button
            onClick={() => router.back()}
            className="fixed bottom-4 right-4 bg-[#333333] hover:bg-[#1f1f1f] text-white p-4 rounded-full shadow-lg transition duration-300"
            title="Voltar para a página anterior"
          >
            <Undo2 />
          </button>
        </div>
      )}
    </>
  )
}
