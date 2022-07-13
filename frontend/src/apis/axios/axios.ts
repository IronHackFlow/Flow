import axios from 'axios'

const BASE_URL =
  process.env.NODE_ENV === 'production'
    ? 'https://iron-flow.herokuapp.com/api'
    : 'http://localhost:5000/api' || process.env.REACT_APP_IP

export default axios.create({
  baseURL: BASE_URL,
})

export const axiosPrivate = axios.create({
  baseURL: BASE_URL,
  headers: { 'Content-Type': 'application/json' },
  withCredentials: true,
})
