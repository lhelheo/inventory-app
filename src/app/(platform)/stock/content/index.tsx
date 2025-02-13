'use client'
import { BackButton } from '@/component/backButton'
import CustomTable from '@/component/customTable'
import { formatData } from '@/helpers/format'
import { IProduct } from '@/interface/interfaces'
import { Home } from 'lucide-react'
import { useRouter } from 'next/navigation'

interface Product {
  products: IProduct[]
}

export const StockPage = (props: Product) => {
  const router = useRouter()
  return (
    <div className="flex flex-col px-20 py-10 items-center min-h-screen bg-[#181818]">
      {props.products && (
        <>
          <div className="bg-[#181818] border border-gray-500 border-opacity-35 max-h-[800px] w-full shadow-md rounded-lg py-8 px-10 overflow-x-auto">
            <h1 className="text-2xl font-bold text-[#e3e3e3] mb-6">Estoque</h1>
            {props.products.length > 0 ? (
              <CustomTable
                columns={[
                  {
                    label: 'Nome',
                    key: 'name',
                  },
                  {
                    label: 'Fornecedor',
                    key: 'supplier',
                  },
                  {
                    label: 'Preço',
                    key: 'price',
                    formatAs: (value) => `R$ ${value}`,
                  },
                  {
                    label: 'Preço de custo',
                    key: 'cost_price',
                    formatAs: (value) => `R$ ${value}`,
                  },
                  {
                    label: 'Código',
                    key: 'product_code',
                  },
                  {
                    label: 'Descrição',
                    key: 'description',
                  },
                  {
                    label: 'Criado em',
                    key: 'createAt',
                    formatAs: formatData,
                  },
                  {
                    label: 'Atualizado em',
                    key: 'updateAt',
                    formatAs: formatData,
                  },
                ]}
                data={props.products.filter(
                  (product) =>
                    !product.client ||
                    (product.status === 'Disponivel' && !product.client),
                )}
              />
            ) : (
              <p className="text-center text-[#e3e3e3]">
                Nenhum produto disponível.
              </p>
            )}
          </div>
          <BackButton onClick={() => router.push('/home')}>
            <Home />
          </BackButton>
        </>
      )}
    </div>
  )
}
