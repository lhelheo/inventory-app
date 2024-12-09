'use client'
import { formatData } from '@/helpers/format'
import { baseUrl } from '@/helpers/url'
import { IProduct } from '@/interface/interfaces'
import { Home } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

export default function Stock() {
  const router = useRouter()
  const [products, setProducts] = useState<IProduct[]>([])
  const [loading, setLoading] = useState<boolean>(true)

  async function loadProducts() {
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
  }

  useEffect(() => {
    loadProducts()
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
          <div className="bg-[#242424] w-full max-w-4xl shadow-md rounded-lg p-8 max-h-[600px] overflow-x-auto">
            {products.length > 0 ? (
              <table className="min-w-full bg-[#242424] rounded-lg">
                <thead>
                  <tr>
                    <th className="py-3 px-4 bg-[#333333] text-[#e3e3e3] font-semibold text-left">
                      Nome
                    </th>
                    <th className="py-3 px-4 bg-[#333333] text-[#e3e3e3] font-semibold text-left">
                      Fornecedor
                    </th>
                    <th className="py-3 px-4 bg-[#333333] text-[#e3e3e3] font-semibold text-left">
                      Preço
                    </th>
                    <th className="py-3 px-4 bg-[#333333] text-[#e3e3e3] font-semibold text-left">
                      Preço de custo
                    </th>
                    <th className="py-3 px-4 bg-[#333333] text-[#e3e3e3] font-semibold text-left">
                      Código
                    </th>
                    <th className="py-3 px-4 bg-[#333333] text-[#e3e3e3] font-semibold text-left">
                      Descrição
                    </th>
                    <th className="py-3 px-4 bg-[#333333] text-[#e3e3e3] font-semibold text-left">
                      Criado em
                    </th>
                    <th className="py-3 px-4 bg-[#333333] text-[#e3e3e3] font-semibold text-left">
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
                      <tr
                        key={product.id}
                        className="border-t ease-linear transition-all even:bg-[#2a2a2a] hover:bg-[#3b3b3b]"
                      >
                        <td className="py-3 px-4 text-[#e3e3e3]">
                          {product.name ? product.name : 'Não informado'}
                        </td>
                        <td className="py-3 px-4 text-[#e3e3e3]">
                          {product.supplier
                            ? product.supplier
                            : 'Não informado'}
                        </td>
                        <td className="py-3 px-4 text-[#e3e3e3]">
                          {product.price
                            ? `R$ ${product.price}`
                            : 'Não informado'}
                        </td>
                        <td className="py-3 px-4 text-[#e3e3e3]">
                          {product.price
                            ? `R$ ${product.cost_price}`
                            : 'Não informado'}
                        </td>
                        <td className="py-3 px-4 text-[#e3e3e3]">
                          {product.product_code
                            ? product.product_code
                            : 'Não informado'}
                        </td>
                        <td className="py-3 px-4 text-[#e3e3e3]">
                          {product.description
                            ? product.description
                            : 'Não informado'}
                        </td>
                        <td className="py-3 px-4 text-[#e3e3e3]">
                          {formatData(product.createAt)}
                        </td>
                        <td className="py-3 px-4 text-[#e3e3e3]">
                          {formatData(product.updateAt)}
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            ) : (
              <p className="text-center text-[#e3e3e3]">
                Nenhum produto disponível.
              </p>
            )}
          </div>
          <button
            onClick={() => router.push('/home')}
            className="fixed bottom-4 right-4 bg-[#333333] hover:bg-[#1f1f1f] text-white p-4 rounded-full shadow-lg transition duration-300"
            title="Voltar para a página anterior"
          >
            <Home />
          </button>
        </div>
      )}
    </>
  )
}
