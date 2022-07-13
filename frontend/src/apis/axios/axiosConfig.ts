import React from 'react'
import { AxiosRequestConfig } from 'axios'

const baseURL =
  process.env.NODE_ENV === 'production'
    ? 'https://iron-flow.herokuapp.com/api'
    : 'http://localhost:5000/api' || process.env.REACT_APP_IP

export const axiosConfig = (
  url: string,
  data?: {},
  { headers: customHeaders = {}, ...customConfig } = {},
) => {
  const token = localStorage.getItem('token')

  const config: any = {
    url: `${baseURL}${url}`,
    method: data ? 'POST' : 'GET',
    data: data ? JSON.stringify(data) : undefined,
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': data ? 'application/json' : undefined,
      ...customHeaders,
    },
    ...customConfig,
  }
  console.log(config, 'NAW ERRED HERE')
  return config
}
