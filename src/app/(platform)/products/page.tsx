'use client'
import { formatData } from '@/helpers/format'
import { baseUrl } from '@/helpers/url'
import { IProduct } from '@/interface/interfaces'
import { Pencil } from 'lucide-react'
import { useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'

export default function Products() {
  const router = useRouter()
  const [products, setProducts] = useState<IProduct[]>([])
  const [loading, setLoading] = useState<boolean>(true)

  useEffect(() => {
    loadProducts()
  }, [])

  async function loadProducts() {
    try {
      const response = await fetch(`${baseUrl}/products`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      })
      if (!response.ok) {
        throw new Error('Failed to fetch products')
      }
      const data = await response.json()
      setProducts(data)
    } catch (error) {
      console.error('Failed to load products', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      {loading ? (
        <div className="flex flex-col justify-center items-center min-h-screen bg-gray-50">
          <p className="text-lg text-gray-600">Carregando produtos...</p>
        </div>
      ) : (
        <div className="flex flex-col justify-center items-center min-h-screen bg-gray-50">
          <h1 className="text-2xl font-semibold text-gray-800 mb-6">
            Produtos
          </h1>
          <div className="bg-white shadow-md rounded-lg p-8 w-full max-w-lg border border-gray-200">
            {products.length > 0 ? (
              products.map((product) => (
                <div
                  key={product.id}
                  className="my-6 p-4 bg-gray-50 rounded-lg shadow-sm flex justify-between items-center"
                >
                  <div>
                    <p className="text-gray-700">
                      <strong>Cliente:</strong>{' '}
                      {product.client.name ?? 'Não informado'}
                    </p>
                    <p className="text-gray-700">
                      <strong>Produto:</strong>{' '}
                      {product.name ?? 'Não informado'}
                    </p>
                    <p className="text-gray-700">
                      <strong>Fornecedor:</strong>{' '}
                      {product.supplier ?? 'Não informado'}
                    </p>
                    <p className="text-gray-700">
                      <strong>Status:</strong>{' '}
                      {product.status ?? 'Não informado'}
                    </p>
                    <p className="text-gray-700">
                      <strong>Descrição:</strong>{' '}
                      {product.description ?? 'Não informado'}
                    </p>
                    <p className="text-gray-700">
                      <strong>Preço de venda:</strong>{' '}
                      {product.price ? `R$ ${product.price}` : 'Não informado'}
                    </p>
                    <p className="text-gray-700">
                      <strong>Preço de custo: </strong>{' '}
                      {product.cost_price
                        ? `R$ ${product.cost_price}`
                        : 'Não informado'}
                    </p>
                    <p className="text-gray-700">
                      <strong>Código:</strong>{' '}
                      {product.product_code ?? 'Não informado'}
                    </p>
                    <p className="text-gray-700">
                      <strong>Criado em:</strong>{' '}
                      {formatData(product.createAt) ?? 'Não informado'}
                    </p>
                    <p className="text-gray-700">
                      <strong>Atualizado em:</strong>{' '}
                      {formatData(product.updateAt) ?? 'Não informado'}
                    </p>
                  </div>
                  <Pencil
                    onClick={() => router.push(`/products/${product.id}/edit/`)}
                    className="text-blue-500 hover:text-blue-700"
                  />
                </div>
              ))
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
