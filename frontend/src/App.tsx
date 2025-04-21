import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import DriverMap from './components/DriverMap'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
  <DriverMap/>
    </>
  )
}

export default App
