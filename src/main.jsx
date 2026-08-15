import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Route, Routes } from 'react-router'
import './index.css'
import App from './App.jsx'
import SampleBreakdown from './components/SampleBreakdown.jsx'

createRoot(document.getElementById('root')).render(
  <BrowserRouter basename="/SampleBreakdown/">
    <Routes>
      <Route index element={<App/>}/>
      <Route path="dev" element={<SampleBreakdown authoring />} />
    </Routes>
  </BrowserRouter>,
)
