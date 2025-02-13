'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { baseUrl } from '@/helpers/url'
import { IProduct } from '@/interface/interfaces'
import {
  Clock,
  DollarSign,
  Package,
  ShoppingCart,
  Tag,
  Undo2,
  User,
} from 'lucide-react'
import { LoadingCircle } from '@/component/loadingCircle'
import { DetailItem } from '@/component/detailItem'
import { BackButton } from '@/component/backButton'

interface ProductPageProps {
  params: {
    id: string
  }
}

export default function ProductPage(props: ProductPageProps) {
  const router = useRouter()
  const id = props.params.id
  const [product, setProduct] = useState<IProduct>()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (id) {
      fetch(`${baseUrl}/products/${id}`)
        .then((response) => response.json())
        .then((data) => setProduct(data))
        .catch((error) => console.error('Error fetching product:', error))
        .finally(() => setLoading(false))
    }
  }, [id])

  return (
    <div className="min-h-screen bg-[#181818] flex justify-center items-center p-6">
      {loading ? (
        <LoadingCircle />
      ) : (
        <div className="flex flex-col w-[90%] max-w-3xl">
          <p className="text-3xl font-bold text-[#e3e3e3] my-4">
            Detalhes do Produto
          </p>
          <div className="bg-[#242424] text-[#e3e3e3] shadow-xl rounded-xl p-8 w-full max-w-3xl">
            <h1 className="text-3xl font-medium mb-6 text-left text-[#e3e3e3]">
              {product?.name}
            </h1>

            <div className="space-y-6">
              <DetailItem
                icon={User}
                value={product?.client.name || 'N/A'}
                label="Cliente"
              />

              <DetailItem
                icon={Package}
                value={product?.description || 'N/A'}
                label="Descrição"
              />

              <DetailItem
                icon={DollarSign}
                value={product?.price.toFixed(2) || 'N/A'}
                label="Preço de Venda"
              />

              <DetailItem
                icon={DollarSign}
                value={product?.cost_price.toFixed(2) || 'N/A'}
                label="Preço de Custo"
              />

              <DetailItem
                icon={ShoppingCart}
                value={product?.supplier || 'N/A'}
                label="Fornecedor"
              />

              <DetailItem
                icon={Tag}
                value={product?.product_code || 'N/A'}
                label="Código do Produto"
              />

              <DetailItem
                icon={Clock}
                value={
                  product?.updateAt
                    ? new Date(product.updateAt).toLocaleString()
                    : 'N/A'
                }
                label="Atualizado em"
              />

              <DetailItem
                icon={Clock}
                value={
                  product?.createAt
                    ? new Date(product.createAt).toLocaleString()
                    : 'N/A'
                }
                label="Criado em"
              />
            </div>
          </div>
          <BackButton onClick={() => router.back()}>
            <Undo2 />
          </BackButton>
        </div>
      )}
    </div>
  )
}
