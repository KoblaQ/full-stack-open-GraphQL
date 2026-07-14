// import { gql } from '@apollo/client'
import {
  useApolloClient,
  useQuery,
  useSubscription,
} from '@apollo/client/react'
import Persons from './components/Persons'
import PersonForm from './components/PersonForm'
import PhoneForm from './components/PhoneForm'
import Notify from './components/Notify'
import LoginForm from './components/LoginForm'

import { ALL_PERSONS, PERSON_ADDED } from './queries'
import { useState } from 'react'

import { addPersonToCache } from './utils/apolloCache'

// const ALL_PERSONS = gql`
//   query {
//     allPersons {
//       name
//       phone
//       id
//     }
//   }
// `

const App = () => {
  const [token, setToken] = useState(
    localStorage.getItem('phonebook-user-token'),
  )
  const [errorMessage, setErrorMessage] = useState(null)

  const result = useQuery(
    ALL_PERSONS,
    //   {
    //   pollInterval: 2000,
    // }
  )

  const client = useApolloClient()

  useSubscription(PERSON_ADDED, {
    onData: ({ data }) => {
      // console.log(data)
      const addedPerson = data.data.personAdded
      notify(`${addedPerson.name} added`)
      addPersonToCache(client.cache, addedPerson)
    },
  })

  if (result.loading) {
    return <div>loading...</div>
  }

  const onLogout = () => {
    setToken(null)
    localStorage.clear()
    client.resetStore()
  }

  const notify = (message) => {
    setErrorMessage(message)
    setTimeout(() => {
      setErrorMessage(null)
    }, 10000)
  }

  if (!token) {
    return (
      <div>
        <Notify errorMessage={errorMessage} />
        <h2>Login</h2>
        <LoginForm setToken={setToken} setError={notify} />
      </div>
    )
  }

  // return <div>{result.data.allPersons.map((p) => p.name).join(', ')}</div>
  return (
    <div>
      <Notify errorMessage={errorMessage} />
      <button onClick={onLogout}>logout</button>
      <Persons persons={result.data.allPersons} />
      <PersonForm setError={notify} />
      <PhoneForm setError={notify} />
    </div>
  )
}

export default App
