import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { UserProvider } from './lib/UserContext.jsx'

import {BrowserRouter, Routes, Route} from 'react-router'

import './index.css'
import App from './App.jsx'
import DiscordCallback from './pages/DiscordCallback.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <UserProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<App />} />
          <Route path='/callback' element={<DiscordCallback />} />
        </Routes>
      </BrowserRouter>
    </UserProvider>
  </StrictMode>,
)
