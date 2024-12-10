import { baseUrl } from '@/helpers/url'
import { IProduct } from '@/interface/interfaces'
import axios from 'axios'
import { StockPage } from './content'

export default async function Stock() {
  const fetchProducts = async (): Promise<IProduct[]> => {
    try {
      const response = await axios.get(`${baseUrl}/products`)
      return response.data
    } catch (error) {
      console.error('Error ao carregar os produtos:', error)
      return []
    }
  }

  const products = await fetchProducts()
  return <StockPage products={products} />
}
