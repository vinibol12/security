import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { trpc } from './trpc/client'

function App() {
  const [count, setCount] = useState(0)
  const [name, setName] = useState('')
  
  // Using tRPC query
  const greeting = trpc.greeting.useQuery({ name: name || undefined })
  
  // Using tRPC mutation
  const counterMutation = trpc.counter.useMutation()
  
  const handleIncrement = () => {
    setCount((count) => count + 1)
    counterMutation.mutate({ action: 'increment' })
  }
  
  const handleDecrement = () => {
    setCount((count) => count - 1)
    counterMutation.mutate({ action: 'decrement' })
  }

  return (
    <>
      <div>
        <a href="https://vite.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React with tRPC</h1>
      
      <div className="card">
        <h2>tRPC Query Example</h2>
        <input 
          type="text" 
          value={name} 
          onChange={(e) => setName(e.target.value)} 
          placeholder="Enter your name"
        />
        <p>
          {greeting.isLoading 
            ? 'Loading...' 
            : greeting.data?.greeting || 'No greeting'}
        </p>
        <p className="small">
          Timestamp: {greeting.data?.timestamp || 'N/A'}
        </p>
      </div>
      
      <div className="card">
        <h2>tRPC Mutation Example</h2>
        <div className="counter-controls">
          <button onClick={handleDecrement}>-</button>
          <span>count is {count}</span>
          <button onClick={handleIncrement}>+</button>
        </div>
        <p>
          {counterMutation.isLoading 
            ? 'Processing...' 
            : counterMutation.data?.message || 'Use the buttons to update'}
        </p>
        <p className="small">
          Last action: {counterMutation.data?.action || 'none'}
        </p>
      </div>
      
      <p className="read-the-docs">
        This example demonstrates tRPC communication with a Node.js backend
      </p>
    </>
  )
}

export default App
