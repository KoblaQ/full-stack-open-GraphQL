// import { gql } from '@apollo/client'
import { useQuery } from '@apollo/client/react'
import Persons from './components/Persons'
import PersonForm from './components/PersonForm'
import PhoneForm from './components/PhoneForm'
import Notify from './components/Notify'
import { ALL_PERSONS } from './queries'
import { useState } from 'react'

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
  const [errorMessage, setErrorMessage] = useState(null)

  const result = useQuery(
    ALL_PERSONS,
    //   {
    //   pollInterval: 2000,
    // }
  )

  if (result.loading) {
    return <div>loading...</div>
  }

  const notify = (message) => {
    setErrorMessage(message)
    setTimeout(() => {
      setErrorMessage(null)
    }, 10000)
  }

  // return <div>{result.data.allPersons.map((p) => p.name).join(', ')}</div>
  return (
    <div>
      <Notify errorMessage={errorMessage} />
      <Persons persons={result.data.allPersons} />
      <PersonForm setError={notify} />
      <PhoneForm setError={notify} />
    </div>
  )
}

export default App
