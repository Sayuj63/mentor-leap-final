import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './styles/index.css'
import App from './App.jsx'
import LivePage from './pages/LivePage.jsx'

import AdminDashboard from './pages/AdminDashboard.jsx'
import CommandPanel from './pages/CommandPanel.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/live" element={<LivePage />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/command-panel" element={<CommandPanel />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>,
)
