'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { baseUrl } from '@/helpers/url'
import { IProduct } from '@/interface/interfaces'

interface ProductPageProps {
  params: {
    id: string
  }
}

export default function ProductPage(props: ProductPageProps) {
  const router = useRouter()
  const id = props.params.id
  const [product, setProduct] = useState<IProduct>()

  useEffect(() => {
    if (id) {
      fetch(`${baseUrl}/product/${id}`)
        .then((response) => response.json())
        .then((data) => setProduct(data))
        .catch((error) => console.error('Error fetching product:', error))
    }
  }, [id])

  //   if (!product) {
  //     return <div>Loading...</div>
  //   }

  return (
    <div className="min-h-screen bg-[#181818] flex justify-center items-center p-6">
      <div className="bg-[#242424] text-[#e3e3e3] shadow-xl rounded-xl p-8 w-full max-w-3xl">
        <h1 className="text-3xl font-bold mb-6 text-center text-[#e3e3e3]">
          {product?.name}
        </h1>

        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <p className="text-lg font-semibold text-[#b0b0b0]">Cliente:</p>
            <p className="text-lg">{product?.client.name || 'N/A'}</p>
          </div>

          <div className="flex items-center justify-between">
            <p className="text-lg font-semibold text-[#b0b0b0]">Descrição:</p>
            <p className="text-lg">{product?.description || 'N/A'}</p>
          </div>

          <div className="flex items-center justify-between">
            <p className="text-lg font-semibold text-[#b0b0b0]">
              Preço de Venda:
            </p>
            <p className="text-lg font-semibold text-green-400">
              R$ {product?.price.toFixed(2)}
            </p>
          </div>

          <div className="flex items-center justify-between">
            <p className="text-lg font-semibold text-[#b0b0b0]">
              Preço de Custo:
            </p>
            <p className="text-lg font-semibold text-red-400">
              R$ {product?.cost_price.toFixed(2)}
            </p>
          </div>

          <div className="flex items-center justify-between">
            <p className="text-lg font-semibold text-[#b0b0b0]">Fornecedor:</p>
            <p className="text-lg">{product?.supplier || 'N/A'}</p>
          </div>

          <div className="flex items-center justify-between">
            <p className="text-lg font-semibold text-[#b0b0b0]">
              Código do Produto:
            </p>
            <p className="text-lg">{product?.product_code || 'N/A'}</p>
          </div>

          <div className="flex items-center justify-between">
            <p className="text-lg font-semibold text-[#b0b0b0]">
              Atualizado em:
            </p>
            <p className="text-lg">
              {product?.updateAt
                ? new Date(product.updateAt).toLocaleString()
                : 'N/A'}
            </p>
          </div>

          <div className="flex items-center justify-between">
            <p className="text-lg font-semibold text-[#b0b0b0]">Criado em:</p>
            <p className="text-lg">
              {product?.createAt
                ? new Date(product.createAt).toLocaleString()
                : 'N/A'}
            </p>
          </div>
        </div>
      </div>
      <button
        onClick={() => router.back()}
        className="fixed bottom-4 right-4 bg-[#333333] hover:bg-[#1f1f1f] text-white p-4 rounded shadow-lg transition duration-300"
        title="Voltar para a página anterior"
      >
        ←
      </button>
    </div>
  )
}
