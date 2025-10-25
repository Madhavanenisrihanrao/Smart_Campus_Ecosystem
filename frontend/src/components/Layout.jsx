import { Outlet } from 'react-router-dom'
import Navbar from './Navbar'
import Sidebar from './Sidebar'
// import ChatBot from './ChatBot'
// import { useEffect } from 'react'
// import { useAuthStore } from '../store/authStore'
// import { useNotificationStore } from '../store/notificationStore'
// import websocketService from '../lib/websocket'
// import toast from 'react-hot-toast'

export default function Layout() {
  // const { token } = useAuthStore()
  // const { addNotification } = useNotificationStore()

  // Temporarily disabled WebSocket to prevent errors
  // useEffect(() => {
  //   if (token) {
  //     // Connect to WebSocket
  //     websocketService.connect(token)

  //     // Add notification listener
  //     const listenerId = 'layout-notifications'
  //     websocketService.addListener(listenerId, (data) => {
  //       if (data.type && data.action) {
  //         addNotification(data)
  //         toast.success(`New ${data.type}: ${data.action}`)
  //       }
  //     })

  //     return () => {
  //       websocketService.removeListener(listenerId)
  //     }
  //   }
  // }, [token, addNotification])

  return (
    <div className="min-h-screen bg-slate-50">
      <Sidebar />
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-1 p-6">
          <Outlet />
        </main>
      </div>
      {/* <ChatBot /> */}
    </div>
  )
}
