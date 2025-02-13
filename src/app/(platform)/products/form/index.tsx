'use client'
import CustomTable from '@/component/customTable'
import CustomModal from '@/component/modal'
import { formatData } from '@/helpers/format'
import { baseUrl } from '@/helpers/url'
import { IProduct } from '@/interface/interfaces'
import axios from 'axios'
import { Pencil, Eye, Trash2, Home } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

interface ProductsFormProps {
  products: IProduct[]
}

export const ProductsForm = (props: ProductsFormProps) => {
  const router = useRouter()
  const [search, setSearch] = useState<string>('')
  const [products, setProducts] = useState<IProduct[]>(props.products)
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [loading, setLoading] = useState<boolean>(true)
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [message, setMessage] = useState<string | null>(null)
  const [showConfirm, setShowConfirm] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState<IProduct | null>(null)

  async function handleDeleteConfirmed() {
    if (!selectedProduct) return
    setLoading(true)
    try {
      await axios.delete(`${baseUrl}/products/${selectedProduct.id}`)
      setMessage('Produto deletado com sucesso.')
      setProducts(
        props.products.filter((product) => product.id !== selectedProduct.id),
      )
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      setMessage('Erro ao deletar o produto.')
    } finally {
      setLoading(false)
      setShowConfirm(false)
      setSelectedProduct(null)
    }
  }

  const filteredProducts = products.filter(
    (product) =>
      product.name.toLowerCase().includes(search.toLowerCase()) ||
      product.client?.name.toLowerCase().includes(search.toLowerCase()) ||
      product.product_code?.toLowerCase().includes(search.toLowerCase()),
  )

  return (
    <>
      <div className="flex flex-col justify-center items-center min-h-screen bg-[#181818] px-20 py-10">
        <div className="bg-[#181818] border border-gray-500 border-opacity-35 w-full max-h-[700px] shadow-md rounded-lg px-10 py-8">
          <h1 className="text-2xl font-bold text-[#e3e3e3] mb-6">Produtos</h1>

          <div className="mb-6 w-full">
            <input
              type="text"
              placeholder="Digite para pesquisar..."
              className="w-full p-3 bg-[#181818] rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-[#e3e3e3] border border-gray-500 border-opacity-35"
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          {props.products.length > 0 ? (
            <div className="overflow-x-auto max-h-[500px]">
              <CustomTable
                columns={[
                  { label: 'Nome', key: 'name' },
                  { label: 'Comprador', key: 'client.name' },
                  { label: 'Status', key: 'status' },
                  { label: 'Código', key: 'product_code' },
                  {
                    label: 'Custo',
                    key: 'cost_price',
                    formatAs: (value) => `R$ ${value}`,
                  },
                  {
                    label: 'Venda',
                    key: 'price',
                    formatAs: (value) => `R$ ${value}`,
                  },
                  { label: 'Descrição', key: 'description' },
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
                data={filteredProducts}
                key={filteredProducts.length}
                actions={[
                  {
                    icon: <Pencil size={18} />,
                    label: 'Editar',
                    className: 'text-yellow-500 hover:text-yellow-700',
                    onClick: (product) =>
                      router.push(`/products/${product.id}/edit/`),
                  },
                  {
                    icon: <Eye size={18} />,
                    label: 'Visualizar',
                    className: 'text-blue-500 hover:text-blue-700',
                    onClick: (product) =>
                      router.push(`/products/${product.id}`),
                  },
                  {
                    icon: <Trash2 size={18} />,
                    label: 'Deletar',
                    className: 'text-red-500 hover:text-red-700',
                    onClick: (product) => {
                      setShowConfirm(true)
                      setSelectedProduct(product as IProduct)
                    },
                  },
                ]}
              />
            </div>
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

      <CustomModal
        isOpen={showConfirm}
        onClose={() => setShowConfirm(false)}
        title="Confirmar Exclusão"
        message={`Tem certeza que deseja deletar o produto ${selectedProduct?.name}?`}
        actions={[
          {
            label: 'Cancelar',
            onClick: () => {
              setShowConfirm(false)
              setSelectedProduct(null)
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
    </>
  )
}
