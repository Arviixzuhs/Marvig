import { ENV } from '@/constants'
import { ApolloClient, HttpLink, InMemoryCache, ApolloLink } from '@apollo/client'

let dynamicHeaders: Record<string, string> = {}

export const setDynamicHeaders = (headers: Record<string, string>) => {
  dynamicHeaders = { ...dynamicHeaders, ...headers }
}

export const clearDynamicHeaders = () => {
  dynamicHeaders = {}
}

const authLink = new ApolloLink((operation, forward) => {
  const previousContext = operation.getContext()

  operation.setContext({
    headers: {
      ...previousContext.headers,
      ...dynamicHeaders,
    },
  })

  return forward(operation)
})

const httpLink = new HttpLink({
  uri: ENV['API_URL'] + '/graphql',
  credentials: 'include',
})

export const apolloClient = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
})
