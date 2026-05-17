import { useState } from 'react'
import { useMutation } from '@apollo/client/react'
import { EDIT_AUTHOR } from '../queries'

const BirthYearForm = ({ show }) => {
  const [name, setName] = useState('')
  const [birthYear, setBirthYear] = useState('')

  const [changeBirthYear] = useMutation(EDIT_AUTHOR)

  const submit = (event) => {
    event.preventDefault()

    changeBirthYear({ variables: { name, setBornTo: Number(birthYear) } })

    setName('')
    setBirthYear('')
  }

  if (!show) {
    return null
  }

  return (
    <div>
      <h2>Set birthyear</h2>
      <form onSubmit={submit}>
        <div>
          <label htmlFor="name">
            name
            <input
              id="name"
              value={name}
              onChange={({ target }) => setName(target.value)}
            />
          </label>
        </div>
        <div>
          <label htmlFor="born">
            born
            <input
              id="born"
              value={birthYear}
              onChange={({ target }) => setBirthYear(target.value)}
            />
          </label>
        </div>
        <button type="submit">update author</button>
      </form>
    </div>
  )
}

export default BirthYearForm
