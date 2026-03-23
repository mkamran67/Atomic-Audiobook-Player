import { StrictMode } from 'react'
import { Provider } from 'react-redux'
import './i18n'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App'
import { store } from './store'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </StrictMode>,
)
