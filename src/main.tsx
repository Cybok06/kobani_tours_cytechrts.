import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'
import './i18n'
import LanguageSwitcher from './components/LanguageSwitcher'
import DocumentTranslator from './components/DocumentTranslator'
import { AuthProvider } from './AuthContext'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <div className="global-language-switcher fixed right-2 top-1 z-[200] rounded-lg bg-[#0B0B0B]">
      <LanguageSwitcher />
    </div>
    <DocumentTranslator />
    <AuthProvider><App /></AuthProvider>
  </React.StrictMode>,
)
