import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'

import {
  ApolloClient,
  // gql,
  HttpLink,
  InMemoryCache,
} from '@apollo/client'
import { ApolloProvider } from '@apollo/client/react'
import { SetContextLink } from '@apollo/client/link/context' // for the header

const authLink = new SetContextLink(({ headers }) => {
  const token = localStorage.getItem('library-user-token')
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : null,
    },
  }
})

const httpLink = new HttpLink({ uri: 'http://localhost:4000' })

const client = new ApolloClient({
  // link: new HttpLink({
  //   uri: 'http://localhost:4000',
  // }),
  cache: new InMemoryCache(),
  link: authLink.concat(httpLink),
})

// const query = gql`
//   query {
//     allAuthors {
//       name
//       born
//       bookCount
//       id
//     }

//     allBooks {
//       title
//       author
//       published
//       id
//     }
//   }
// `

// client.query({ query }).then((response) => {
//   console.log(response.data)
// })

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ApolloProvider client={client}>
      <App />
    </ApolloProvider>
  </StrictMode>,
)
