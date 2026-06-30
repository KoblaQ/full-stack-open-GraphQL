import { useState } from 'react'
import { useMutation } from '@apollo/client/react'
import { EDIT_AUTHOR, ALL_AUTHORS } from '../queries'

const BirthYearForm = ({ authors, token }) => {
  const [name, setName] = useState('')
  const [birthYear, setBirthYear] = useState('')

  const [changeBirthYear] = useMutation(EDIT_AUTHOR)

  const submit = (event) => {
    event.preventDefault()

    changeBirthYear({ variables: { name, setBornTo: Number(birthYear) } })

    setName('')
    setBirthYear('')
  }

  // if (!show) {
  //   return null
  // }
  if (!token) {
    return null
  }

  return (
    <div>
      <h2>Set birthyear</h2>
      <form onSubmit={submit}>
        <div>
          <label htmlFor="name">
            name
            <select
              name="name"
              id="name"
              onChange={({ target }) => setName(target.value)}
              value={name}
            >
              <option value="">select the author</option>
              {authors.map((author) => (
                <option key={author.id} value={author.name}>
                  {author.name}
                </option>
              ))}
            </select>
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
