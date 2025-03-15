'use client'
import { useState, useEffect, useRef, FormEvent } from 'react'
import { useRouter } from 'next/navigation'
import axios from 'axios'
import { baseUrl } from '@/helpers/url'
import { IProduct, IClient } from '@/interface/interfaces'
import { LoadingCircle } from '@/component/loadingCircle'
import { Title } from '@/component/title'
import { BackButton } from '@/component/backButton'
import { Undo2 } from 'lucide-react'

interface ProductProps {
  params: {
    id: string
  }
  customers: IClient[] // Clientes para o select de cliente
}

export default function ProductPage(props: ProductProps) {
  const router = useRouter()

  const [message, setMessage] = useState<string | null>(null)
  const [loading, setLoading] = useState<boolean>(false)
  const [product, setProduct] = useState<IProduct | null>(null)

  const nameRef = useRef<HTMLInputElement>(null)
  const priceRef = useRef<HTMLInputElement>(null)
  const descriptionRef = useRef<HTMLInputElement>(null)
  const statusRef = useRef<HTMLSelectElement>(null)
  const supplierRef = useRef<HTMLInputElement>(null)
  const costPriceRef = useRef<HTMLInputElement>(null)
  const productCodeRef = useRef<HTMLInputElement>(null)
  const clientIDRef = useRef<HTMLSelectElement>(null)

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.get(
          `${baseUrl}/products/${props.params.id}`,
        )
        setProduct(response.data)
        setLoading(false)
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (error) {
        setMessage('Erro ao carregar o produto.')
        setLoading(false)
      }
    }

    fetchProduct()
  }, [props.params.id])

  // Atualiza os campos do formulário quando o produto é carregado
  useEffect(() => {
    if (product) {
      nameRef.current!.value = product.name
      priceRef.current!.value = product.price.toString()
      descriptionRef.current!.value = product.description || ''
      statusRef.current!.value = product.status
      supplierRef.current!.value = product.supplier
      costPriceRef.current!.value = product.cost_price?.toString() || '0'
      productCodeRef.current!.value = product.product_code || ''
      clientIDRef.current!.value = product.clientID?.toString() || ''
    }
  }, [product])

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault()
    setLoading(true)

    const updatedProduct = {
      name: nameRef.current!.value,
      price: parseFloat(priceRef.current!.value),
      description: descriptionRef.current!.value,
      status: statusRef.current!.value,
      supplier: supplierRef.current!.value,
      cost_price: parseFloat(costPriceRef.current!.value),
      product_code: productCodeRef.current!.value,
      clientID: clientIDRef.current!.value
        ? Number(clientIDRef.current!.value)
        : null,
    }

    try {
      await axios.put(`${baseUrl}/products/${props.params.id}`, updatedProduct)
      setMessage('Produto atualizado com sucesso.')
      // Se necessário, redireciona após o sucesso
      router.push('/products')
    } catch (error) {
      if (axios.isAxiosError(error)) {
        setMessage(
          error.response?.data?.error || 'Erro ao atualizar o produto.',
        )
      } else {
        setMessage('Erro desconhecido ao atualizar o produto.')
      }
    } finally {
      setLoading(false)
    }
  }
  return (
    <div>
      {loading ? (
        <LoadingCircle />
      ) : (
        <>
          <div className="flex flex-col justify-center items-center min-h-screen bg-[#181818] p-4">
            <div className="text-[#e3e3e3] shadow-md rounded-lg p-8 w-full max-w-4xl border border-gray-500 border-opacity-35">
              <div className="mb-4">
                <Title title="Editar Produto" />
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label
                      className="block text-[#e3e3e3] font-semibold mb-2"
                      htmlFor="name"
                    >
                      Nome do produto
                    </label>
                    <input
                      ref={nameRef}
                      type="text"
                      id="name"
                      className="p-3 rounded bg-[#242424] text-[#e3e3e3] shadow focus:outline-none w-full border border-gray-500 border-opacity-35"
                      placeholder="Nome do produto"
                      required
                    />
                  </div>

                  <div>
                    <label
                      className="block text-[#e3e3e3] font-semibold mb-2"
                      htmlFor="price"
                    >
                      Preço
                    </label>
                    <input
                      ref={priceRef}
                      type="number"
                      step="0.01"
                      id="price"
                      className="p-3 rounded bg-[#242424] text-[#e3e3e3] shadow focus:outline-none w-full border border-gray-500 border-opacity-35"
                      placeholder="Preço do produto"
                      required
                    />
                  </div>
                  <div>
                    <label
                      className="block text-[#e3e3e3] font-semibold mb-2"
                      htmlFor="costPrice"
                    >
                      Preço de Custo
                    </label>
                    <input
                      ref={costPriceRef}
                      type="number"
                      step="0.01"
                      id="costPrice"
                      className="p-3 rounded bg-[#242424] text-[#e3e3e3] shadow focus:outline-none w-full border border-gray-500 border-opacity-35"
                      placeholder="Preço de Custo"
                      required
                    />
                  </div>

                  <div>
                    <label
                      className="block text-[#e3e3e3] font-semibold mb-2"
                      htmlFor="description"
                    >
                      Descrição
                    </label>
                    <input
                      ref={descriptionRef}
                      type="text"
                      id="description"
                      className="p-3 rounded bg-[#242424] text-[#e3e3e3] shadow focus:outline-none w-full border border-gray-500 border-opacity-35"
                      placeholder="Descrição do produto"
                    />
                  </div>

                  <div>
                    <label
                      className="block text-[#e3e3e3] font-semibold mb-2"
                      htmlFor="supplier"
                    >
                      Fornecedor
                    </label>
                    <input
                      ref={supplierRef}
                      type="text"
                      id="supplier"
                      className="p-3 rounded bg-[#242424] text-[#e3e3e3] shadow focus:outline-none w-full border border-gray-500 border-opacity-35"
                      placeholder="Fornecedor"
                    />
                  </div>

                  <div>
                    <label
                      className="block text-[#e3e3e3] font-semibold mb-2"
                      htmlFor="productCode"
                    >
                      Código do Produto
                    </label>
                    <input
                      ref={productCodeRef}
                      type="text"
                      id="productCode"
                      className="p-3 rounded bg-[#242424] text-[#e3e3e3] shadow focus:outline-none w-full border border-gray-500 border-opacity-35"
                      placeholder="Código do Produto"
                    />
                  </div>

                  <div>
                    <label
                      className="block text-[#e3e3e3] font-semibold mb-2"
                      htmlFor="status"
                    >
                      Status
                    </label>
                    <select
                      ref={statusRef}
                      id="status"
                      className="p-3 rounded bg-[#242424] text-[#e3e3e3] shadow focus:outline-none w-full border border-gray-500 border-opacity-35"
                      required
                    >
                      <option value="Disponivel">Disponível</option>
                      <option value="Vendido">Vendido</option>
                      <option value="Em pagamento">Em pagamento</option>
                    </select>
                  </div>

                  <div>
                    <label
                      className="block text-[#e3e3e3] font-semibold mb-2"
                      htmlFor="clientID"
                    >
                      Cliente
                    </label>
                    <select
                      ref={clientIDRef}
                      id="clientID"
                      className="p-3 rounded bg-[#242424] text-[#e3e3e3] shadow focus:outline-none w-full border border-gray-500 border-opacity-35"
                    >
                      <option value="">Selecione um cliente (opcional)</option>
                      {props.customers?.map((client) => (
                        <option key={client.id} value={client.id}>
                          {client.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-3 bg-[#242424] hover:bg-[#333333] hover:scale-[101%] font-semibold rounded-md text-[#e3e3e3] ease-linear transition-all"
                  disabled={loading}
                >
                  {loading ? 'Carregando...' : 'Salvar'}
                </button>

                {message && (
                  <p className="mt-4 text-center text-green-600 font-semibold">
                    {message}
                  </p>
                )}
              </form>
            </div>
            <BackButton onClick={() => router.back()}>
              <Undo2 />
            </BackButton>
          </div>
        </>
      )}
    </div>
  )
}
