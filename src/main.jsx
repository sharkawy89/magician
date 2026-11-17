import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'
import CartProvider from './components/context/CartContext.jsx'
import MiniCartProvider from './components/context/MiniCartProvider.jsx'
import CategoryProvider from './components/category/CategoryProvider.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter basename='/'>
      <CartProvider>
        <MiniCartProvider>
          <CategoryProvider>
            <App />
          </CategoryProvider>
        </MiniCartProvider>
      </CartProvider>
    </BrowserRouter>
  </StrictMode>,
)
