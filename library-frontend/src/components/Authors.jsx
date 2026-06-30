import BirthYearForm from './BirthYearForm'

const Authors = (props) => {
  if (!props.show) {
    return null
  }
  const authors = props.authors

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
      <BirthYearForm authors={props.authors} token={props.token} />
    </div>
  )
}

export default Authors
