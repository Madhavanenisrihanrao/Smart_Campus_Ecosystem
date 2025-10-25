import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import api from '../lib/api'
import websocketService from '../lib/websocket'

export const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      
      login: async (email, password) => {
        const response = await api.post('/api/auth/login/', { email, password })
        const { access, user } = response.data
        
        set({ token: access, user })
        localStorage.setItem('token', access)
        localStorage.setItem('user', JSON.stringify(user))
        
        // Connect to WebSocket
        websocketService.connect(access)
        
        return response.data
      },
      
      register: async (data) => {
        const response = await api.post('/api/auth/register/', data)
        const { access, user } = response.data
        
        set({ token: access, user })
        localStorage.setItem('token', access)
        localStorage.setItem('user', JSON.stringify(user))
        
        // Connect to WebSocket
        websocketService.connect(access)
        
        return response.data
      },
      
      logout: () => {
        set({ token: null, user: null })
        localStorage.removeItem('token')
        localStorage.removeItem('user')
        
        // Disconnect WebSocket
        websocketService.disconnect()
      },
      
      updateUser: (user) => {
        set({ user })
        localStorage.setItem('user', JSON.stringify(user))
      },
    }),
    {
      name: 'auth-storage',
      getStorage: () => localStorage,
    }
  )
)
