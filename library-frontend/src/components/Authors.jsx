import BirthYearForm from './BirthYearForm'
import { useQuery } from '@apollo/client/react'
import { ALL_AUTHORS } from '../queries'

const Authors = (props) => {
  const authorsResult = useQuery(ALL_AUTHORS)
  const authors = authorsResult.data?.allAuthors

  if (!props.show) {
    return null
  }

  if (authorsResult.loading) {
    return <div>loading...</div>
  }
  // const authors = props.authors

  return (
    <div>
      <div>
        <h2>authors</h2>
        <table>
          <tbody>
            <tr>
              <th></th>
              <th>born</th>
              <th>books</th>
            </tr>
            {authors.map((a) => (
              <tr key={a.id}>
                <td>{a.name}</td>
                <td>{a.born}</td>
                <td>{a.bookCount}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <BirthYearForm authors={authors} token={props.token} />
    </div>
  )
}

export default Authors
