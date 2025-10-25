import React from 'react'
import ReactDOM from 'react-dom/client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Toaster } from 'react-hot-toast'
import App from './App.jsx'
import './index.css'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
      onError: (error) => {
        console.error('Query error:', error)
      },
    },
  },
})

// Simple error boundary fallback
const ErrorFallback = ({ error }) => (
  <div style={{ padding: '20px', fontFamily: 'Arial', backgroundColor: '#fff' }}>
    <h1 style={{ color: '#e53e3e' }}>Something went wrong</h1>
    <p>Please refresh the page or clear your browser cache.</p>
    <details style={{ marginTop: '10px' }}>
      <summary>Error details</summary>
      <pre style={{ backgroundColor: '#f7fafc', padding: '10px', marginTop: '10px' }}>
        {error?.message || 'Unknown error'}
      </pre>
    </details>
    <button 
      onClick={() => window.location.reload()} 
      style={{ 
        marginTop: '20px', 
        padding: '10px 20px', 
        backgroundColor: '#3182ce', 
        color: 'white', 
        border: 'none', 
        borderRadius: '5px',
        cursor: 'pointer'
      }}
    >
      Reload Page
    </button>
  </div>
)

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }

  componentDidCatch(error, errorInfo) {
    console.error('React Error Boundary caught:', error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      return <ErrorFallback error={this.state.error} />
    }
    return this.props.children
  }
}

try {
  ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
      <ErrorBoundary>
        <QueryClientProvider client={queryClient}>
          <App />
          <Toaster position="top-right" />
        </QueryClientProvider>
      </ErrorBoundary>
    </React.StrictMode>,
  )
} catch (error) {
  console.error('Failed to render app:', error)
  document.getElementById('root').innerHTML = `
    <div style="padding: 20px; font-family: Arial;">
      <h1 style="color: #e53e3e;">Failed to start application</h1>
      <p>Please check the browser console for details.</p>
      <pre style="background: #f7fafc; padding: 10px; margin-top: 10px;">${error.message}</pre>
    </div>
  `
}
