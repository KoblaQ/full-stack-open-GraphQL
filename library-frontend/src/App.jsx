import { useState } from 'react'
import Authors from './components/Authors'
import Books from './components/Books'
import NewBook from './components/NewBook'
import BirthYearForm from './components/BirthYearForm'
import LoginForm from './components/LoginForm'

import { useApolloClient, useQuery } from '@apollo/client/react'
import { ALL_AUTHORS, ALL_BOOKS } from './queries'

const App = () => {
  const [page, setPage] = useState('authors')
  const [token, setToken] = useState(localStorage.getItem('library-user-token'))

  const authorsResult = useQuery(ALL_AUTHORS)
  const booksResult = useQuery(ALL_BOOKS)

  const client = useApolloClient()

  if (authorsResult.loading || booksResult.loading) {
    return <div>loading...</div>
  }

  const onLogout = () => {
    setToken(null)
    localStorage.clear()
    client.resetStore()

    setPage('books')
  }

  return (
    <div>
      <div>
        <button onClick={() => setPage('authors')}>authors</button>
        <button onClick={() => setPage('books')}>books</button>
        {token && <button onClick={() => setPage('add')}>add book</button>}
        {!token && <button onClick={() => setPage('login')}>login</button>}
        {token && <button onClick={onLogout}>logout</button>}
      </div>

      {/* <Authors show={page === 'authors'} /> */}
      <Authors
        show={page === 'authors'}
        authors={authorsResult.data?.allAuthors}
        token={token}
      />
      {/* <BirthYearForm
        show={page === 'authors'}
        authors={authorsResult.data?.allAuthors}
      /> */}
      <Books show={page === 'books'} books={booksResult.data.allBooks} />

      <NewBook show={page === 'add'} token={token} />

      <LoginForm
        show={page === 'login'}
        setToken={setToken}
        setPage={setPage}
      />
    </div>
  )
}

export default App
