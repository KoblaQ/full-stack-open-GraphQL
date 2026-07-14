import { useState } from 'react'
import { gql } from '@apollo/client'
import { useMutation } from '@apollo/client/react'

const CREATE_PERSON = gql`
  mutation createPerson(
    $name: String!
    $street: String!
    $city: String!
    $number: String # $phone: String
  ) {
    addPerson(name: $name, street: $street, city: $city, number: $number) {
      # addPerson(name: $name, street: $street, city: $city, phone: $phone) {
      name
      number
      # phone
      id
      address {
        street
        city
      }
    }
  }
`

// const ALL_PERSONS = gql`
//   query {
//     allPersons {
//       name
//       # phone
//       number
//       id
//     }
//   }
// `

import { addPersonToCache } from '../utils/apolloCache'

const PersonForm = ({ setError }) => {
  const [name, setName] = useState('')
  const [number, setNumber] = useState('')
  // const [phone, setPhone] = useState('')
  const [street, setStreet] = useState('')
  const [city, setCity] = useState('')

  // const [createPerson] = useMutation(CREATE_PERSON)
  const [createPerson] = useMutation(CREATE_PERSON, {
    onError: (error) => setError(error.message),
    // refetchQueries: [{ query: ALL_PERSONS }],
    update: (cache, response) => {
      const addedPerson = response.data.addPerson
      addPersonToCache(cache, addedPerson)

      // cache.updateQuery({ query: ALL_PERSONS }, ({ allPersons }) => {
      //   return {
      //     allPersons: allPersons.concat(response.data.addPerson),
      //   }
      // })
    },
  })

  const submit = (event) => {
    event.preventDefault()

    createPerson({
      variables: {
        name,
        number: number.length > 0 ? number : undefined,
        street,
        city,
      },
    })
    // createPerson({ variables: { name, phone, street, city } })

    setName('')
    setNumber('')
    // setPhone('')
    setStreet('')
    setCity('')
  }

  return (
    <div>
      <h2>create new</h2>
      <form onSubmit={submit}>
        <div>
          name
          <input
            value={name}
            onChange={({ target }) => setName(target.value)}
          />
        </div>
        <div>
          phone{' '}
          <input
            value={number}
            // value={phone}
            onChange={({ target }) => setNumber(target.value)}
            // onChange={({ target }) => setPhone(target.value)}
          />
        </div>
        <div>
          street{' '}
          <input
            value={street}
            onChange={({ target }) => setStreet(target.value)}
          />
        </div>
        <div>
          city{' '}
          <input
            value={city}
            onChange={({ target }) => setCity(target.value)}
          />
        </div>
        <button type="submit">add!</button>
      </form>
    </div>
  )
}

export default PersonForm
