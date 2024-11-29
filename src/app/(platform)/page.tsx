'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import axios from 'axios'
import { baseUrl } from '@/helpers/url'

export default function LoginPage() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  useEffect(() => {
    localStorage.removeItem('token')
  }, [])

  const handleLogin = async (event: React.FormEvent) => {
    event.preventDefault()
    setError(null)
    setLoading(true)

    try {
      const response = await axios.post(`${baseUrl}/login`, {
        username,
        password,
      })

      if (response.status === 200 && response.data?.token) {
        localStorage.setItem('token', response.data.token)
        localStorage.setItem('user', JSON.stringify(response.data.user))

        router.push('/home')
      } else {
        setError('Invalid login credentials')
        console.log('Login failed:', response.data)
      }
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        console.error('Login error:', error.response.data)
        setError(error.response.data.message || 'Login failed')
      } else {
        console.error('Login error:', error)
        setError('An unexpected error occurred')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex justify-center items-center h-screen bg-[#181818]">
      <form
        onSubmit={handleLogin}
        className="flex flex-col w-[400px] border border-gray-200 bg-gray-100 rounded shadow p-20"
      >
        <div className="flex justify-center text-xl">
          <p className="text-[#252525] font-semibold">Acesse sua conta</p>
        </div>
        <div className="my-4 gap-3 flex flex-col">
          <label>
            <input
              type="text"
              className="flex border rounded w-full mb-2 p-2"
              value={username}
              placeholder="Usuário"
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </label>
          <label>
            <input
              type="password"
              placeholder="Senha"
              className="flex border rounded w-full mb-2 p-2"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </label>
        </div>

        <div className="flex flex-col">
          <button
            type="submit"
            className="px-4 py-2 bg-[#c7c7c7] text-[#181818] rounded hover:bg-[#b4b4b4] ease-linear transition-all"
            disabled={loading}
          >
            {loading ? 'Carregando...' : 'Login'}
          </button>
          {error && (
            <p className="flex justify-center text-red-500 my-4">{error}</p>
          )}
        </div>
      </form>
    </div>
  )
}
