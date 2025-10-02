import axios from 'axios'
import type { AxiosInstance } from 'axios'
import { setInterceptors } from '@/api/common/interceptors'

const urlMap = {
  sample: `/api/sample`,
}

export function create(baseURL: string, options?: any): AxiosInstance {
  //options = Object.assign({ withCredentials: true }, options)
  const axiosInstance = axios.create(Object.assign({ baseURL }, options))
  return setInterceptors(axiosInstance)
}

export const sample = create(urlMap.sample);