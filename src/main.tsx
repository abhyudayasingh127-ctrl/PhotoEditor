import { StrictMode, useState } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import LandingPage from './components/LandingPage.tsx'

function Root() {
  const [inEditor, setInEditor] = useState(false)

  if (!inEditor) {
    return <LandingPage onLaunch={() => setInEditor(true)} />
  }

  return <App />
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Root />
  </StrictMode>,
)
