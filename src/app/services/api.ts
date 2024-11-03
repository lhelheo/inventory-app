import axios from 'axios'

export const api = axios.create({
  baseURL: 'https://userlist-testing.vercel.app',
})
