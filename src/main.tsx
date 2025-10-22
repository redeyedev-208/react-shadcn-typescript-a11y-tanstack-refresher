import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import './index.css'
import './i18n'
import App from './App.tsx'
import { LanguageProvider } from './contexts/LanguageContext.tsx'
import { ThemeProvider } from './contexts/ThemeContext.tsx'

const queryClient = new QueryClient()

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider defaultTheme="system" storageKey="accessibility-showcase-theme">
      <QueryClientProvider client={queryClient}>
        <LanguageProvider>
          <App />
          <ReactQueryDevtools initialIsOpen={false} />
        </LanguageProvider>
      </QueryClientProvider>
    </ThemeProvider>
  </StrictMode>,
)
