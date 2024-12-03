'use client'
import { api } from '@/app/services/api'
import { formatData } from '@/helpers/format'
import { baseUrl } from '@/helpers/url'
import { IClient } from '@/interface/interfaces'
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
          <div className="flex flex-col w-full max-w-7xl mt-4 items-center">
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
                className="bg-[#424242] hover:bg-[#181818] transition ease-in-out duration-300 text-white font-bold py-2 px-6 rounded-lg mt-4"
              >
                Realizar Pagamento
              </button>
            </div>

            {/* Título do histórico de compras */}
            <p className="font-semibold text-lg mb-2 text-[#e3e3e3]">
              Histórico de compras de {client?.name}
            </p>

            {/* Tabela de produtos */}
            <div className="overflow-x-auto w-full bg-[#242424] shadow-lg rounded-lg">
              <table className="table-auto w-full text-sm text-left text-white">
                <thead className="bg-[#333333] text-gray-300">
                  <tr>
                    <th className="px-4 py-3">DATA COMPRA</th>
                    <th className="px-4 py-3">FORNECEDOR</th>
                    <th className="px-4 py-3">DESCRIÇÃO</th>
                    <th className="px-4 py-3">PRODUTO</th>
                    <th className="px-4 py-3">REFERÊNCIA</th>
                    <th className="px-4 py-3">VALOR VENDA</th>
                    <th className="px-4 py-3">VALOR CUSTO</th>
                    <th className="px-4 py-3">SITUAÇÃO</th>
                  </tr>
                </thead>
                <tbody>
                  {client?.product?.map((product) => (
                    <tr
                      key={product.id}
                      className="border-t border-[#444444] hover:bg-[#333333] transition-all duration-300"
                    >
                      <td className="px-4 py-3">
                        {formatData(product.createAt)}
                      </td>
                      <td className="px-4 py-3">
                        {product.supplier || 'Não informado'}
                      </td>
                      <td className="px-4 py-3">{product.description}</td>
                      <td className="px-4 py-3">{product.name}</td>
                      <td className="px-4 py-3">{product.product_code}</td>
                      <td className="px-4 py-3">
                        R$ {product.price.toFixed(2)}
                      </td>
                      <td className="px-4 py-3">
                        R$ {product.cost_price.toFixed(2)}
                      </td>
                      <td className="px-4 py-3">{product.status}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
