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

  return (
    <>
      {loading ? (
        <p className="flex justify-center items-center h-screen">
          Carregando cliente...
        </p>
      ) : (
        <div className="flex flex-col h-screen justify-center items-center bg-gray-100">
          <div className="my-6 p-6 bg-white shadow-md rounded-lg">
            <h1 className="font-semibold text-xl text-gray-800">
              Informações do cliente
            </h1>
            <p className="text-gray-600">
              {client?.id} - {client?.name}
            </p>
            <p className="text-gray-600">
              Contato - {client?.email} / {client?.phone}
            </p>
          </div>
          <div className="w-full max-w-2xl mt-4">
            <p className="font-semibold text-lg mb-2 text-gray-800">Produtos</p>
            <table className="table-auto w-full bg-white shadow-md rounded-lg overflow-hidden">
              <thead>
                <tr className="bg-gray-200 text-gray-700">
                  <th className="px-4 py-2 text-left">Data</th>
                  <th className="px-4 py-2 text-left">Nome</th>
                  <th className="px-4 py-2 text-left">Código</th>
                  <th className="px-4 py-2 text-left">Preço</th>
                  <th className="px-4 py-2 text-left">Status</th>
                </tr>
              </thead>
              <tbody>
                {client?.product?.map((product) => (
                  <tr key={product.id} className="border-t border-gray-200">
                    <td className="px-4 py-2">
                      {formatData(product.createAt)}
                    </td>
                    <td className="px-4 py-2">{product.name}</td>
                    <td className="px-4 py-2">{product.product_code}</td>
                    <td className="px-4 py-2">{product.price}</td>
                    <td className="px-4 py-2">{product.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="flex flex-col justify-center items-center my-6 p-6 bg-white shadow-md rounded-lg w-full max-w-md">
            <h2 className="font-semibold text-xl text-gray-800 mb-4">
              Total em produtos vendidos
            </h2>
            <p className="text-gray-600 text-2xl mb-6">
              R$ {totalSoldPrice?.toFixed(2)}
            </p>
            <button
              onClick={() => router.push(`/clients/${id}/payment`)}
              className="bg-blue-500 hover:bg-blue-700 transition ease-in-out duration-300 text-white font-bold py-2 px-6 rounded-full"
            >
              Realizar Pagamento
            </button>
          </div>
        </div>
      )}
    </>
  )
}
