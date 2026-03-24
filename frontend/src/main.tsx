import App from './App.tsx'
import React from 'react'
import store from './store/index.ts'
import ReactDOM from 'react-dom/client'
import { Provider } from 'react-redux'
import { apolloClient } from './api/apollo-client.ts'
import { BrowserRouter } from 'react-router-dom'
import { ApolloProvider } from '@apollo/client/react'
import { NotificationToast } from './components/NotificationToast/index.tsx'
import '@/styles/globals.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <Provider store={store}>
        <ApolloProvider client={apolloClient}>
          <NotificationToast />
          <App />
        </ApolloProvider>
      </Provider>
    </BrowserRouter>
  </React.StrictMode>,
)
