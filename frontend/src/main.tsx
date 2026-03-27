import App from './App.tsx'
import React from 'react'
import store from './store/index.ts'
import ReactDOM from 'react-dom/client'
import { Provider } from 'react-redux'
import { apolloClient } from './api/apollo-client.ts'
import { BrowserRouter } from 'react-router-dom'
import { ApolloProvider } from '@apollo/client/react'
import { MyHeroUIProvider } from './provider.tsx'
import { NotificationToast } from './components/NotificationToast/index.tsx'
import { ImageUploadProvider } from './components/ImageUploader/providers/ImageUploaderProvider.tsx'
import '@/styles/globals.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <Provider store={store}>
        <ApolloProvider client={apolloClient}>
          <NotificationToast />
          <MyHeroUIProvider>
            <ImageUploadProvider>
              <App />
            </ImageUploadProvider>
          </MyHeroUIProvider>
        </ApolloProvider>
      </Provider>
    </BrowserRouter>
  </React.StrictMode>,
)
