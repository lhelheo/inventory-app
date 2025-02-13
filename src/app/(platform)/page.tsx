'use client'
import { FormEvent, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import axios from 'axios'
import { baseUrl } from '@/helpers/url'
import { LoadingCircle } from '@/component/loadingCircle'
import { InputField } from '@/component/inputField'

export default function LoginPage() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  useEffect(() => {
    localStorage.removeItem('token')
  }, [])

  async function handleLogin(event: FormEvent) {
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
    <div className="flex flex-col justify-center items-center h-screen bg-[#181818]">
      {loading ? (
        <LoadingCircle />
      ) : (
        <>
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-[#e3e3e3]">Duda Brandão</h1>
            <p className="text-xl text-[#e3e3e3]">Sistema de Gestão</p>
          </div>
          <form
            onSubmit={handleLogin}
            className="flex flex-col space-y-2 w-[370px] bg-[#181818] border border-gray-500 border-opacity-35 rounded-lg shadow px-6 py-4"
          >
            <h2 className="text-2xl my-3 font-medium text-center text-[#e3e3e3]">
              Login
            </h2>
            <div className="my-4 gap-5 flex flex-col">
              <InputField
                label="Usuário"
                type="text"
                value={username}
                placeholder="Digite seu usuário"
                onChange={(e) => setUsername(e.target.value)}
                name={'usuario'}
              />
              <InputField
                label="Senha"
                type="password"
                value={password}
                placeholder="Digite sua senha"
                onChange={(e) => setPassword(e.target.value)}
                name={'senha'}
              />
            </div>

            <div className="relative">
              <button
                type="submit"
                className={`px-4 py-3 mt-4 bg-[#242424] hover:bg-[#333333] font-medium text-[#e3e3e3] rounded w-full hover:scale-[101%] ease-linear transition-all ${
                  loading ? 'opacity-50 cursor-not-allowed' : ''
                }`}
                disabled={loading}
              >
                {loading ? 'Carregando...' : 'Entrar'}
              </button>
              {error && (
                <p className="flex justify-center text-red-500 my-4">{error}</p>
              )}
            </div>
          </form>
        </>
      )}
    </div>
  )
}
