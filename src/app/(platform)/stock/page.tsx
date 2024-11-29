'use client'
import { formatData } from '@/helpers/format'
import { baseUrl } from '@/helpers/url'
import { IProduct } from '@/interface/interfaces'
import React, { useEffect, useState } from 'react'

export default function Stock() {
  const [products, setProducts] = useState<IProduct[]>([])
  const [loading, setLoading] = useState<boolean>(true)

  useEffect(() => {
    fetch(`${baseUrl}/products`)
      .then((response) => response.json())
      .then((data) => {
        setProducts(data)
        setLoading(false)
      })
      .catch((error) => {
        console.error('Error fetching products:', error)
        setLoading(false)
      })
  }, [])

  return (
    <>
      {loading ? (
        <div className="flex flex-col justify-center items-center min-h-screen bg-[#181818]">
          <p className="text-lg text-[#e3e3e3]">Carregando produtos...</p>
        </div>
      ) : (
        <div className="flex flex-col justify-center items-center min-h-screen bg-[#181818]">
          <h1 className="text-2xl font-semibold text-[#e3e3e3] mb-6">
            Estoque
          </h1>
          <div className="bg-white shadow-md rounded-lg p-8 w-[85%] border border-gray-200 overflow-x-auto">
            {products.length > 0 ? (
              <table className="min-w-full bg-white border border-gray-200 rounded-lg">
                <thead>
                  <tr>
                    <th className="py-3 px-4 bg-gray-100 text-gray-600 font-semibold text-left">
                      Nome
                    </th>
                    <th className="py-3 px-4 bg-gray-100 text-gray-600 font-semibold text-left">
                      Fornecedor
                    </th>
                    <th className="py-3 px-4 bg-gray-100 text-gray-600 font-semibold text-left">
                      Preço
                    </th>
                    <th className="py-3 px-4 bg-gray-100 text-gray-600 font-semibold text-left">
                      Preço de custo
                    </th>
                    <th className="py-3 px-4 bg-gray-100 text-gray-600 font-semibold text-left">
                      Código
                    </th>
                    <th className="py-3 px-4 bg-gray-100 text-gray-600 font-semibold text-left">
                      Descrição
                    </th>
                    <th className="py-3 px-4 bg-gray-100 text-gray-600 font-semibold text-left">
                      Criado em
                    </th>
                    <th className="py-3 px-4 bg-gray-100 text-gray-600 font-semibold text-left">
                      Atualizado em
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {products
                    .filter(
                      (product) =>
                        !product.client ||
                        (product.status === 'Disponivel' && !product.client),
                    )
                    .map((product) => (
                      <tr key={product.id} className="border-t">
                        <td className="py-3 px-4 text-gray-700">
                          {product.name ? product.name : 'Não informado'}
                        </td>
                        <td className="py-3 px-4 text-gray-700">
                          {product.supplier
                            ? product.supplier
                            : 'Não informado'}
                        </td>
                        <td className="py-3 px-4 text-gray-700">
                          {product.price
                            ? `R$ ${product.price}`
                            : 'Não informado'}
                        </td>
                        <td className="py-3 px-4 text-gray-700">
                          {product.price
                            ? `R$ ${product.cost_price}`
                            : 'Não informado'}
                        </td>
                        <td className="py-3 px-4 text-gray-700">
                          {product.product_code
                            ? product.product_code
                            : 'Não informado'}
                        </td>
                        <td className="py-3 px-4 text-gray-700">
                          {product.description
                            ? product.description
                            : 'Não informado'}
                        </td>
                        <td className="py-3 px-4 text-gray-700">
                          {formatData(product.createAt)}
                        </td>
                        <td className="py-3 px-4 text-gray-700">
                          {formatData(product.updateAt)}
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            ) : (
              <p className="text-center text-gray-600">
                Nenhum produto disponível.
              </p>
            )}
          </div>
        </div>
      )}
    </>
  )
}
