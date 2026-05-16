const Authors = (props) => {
  if (!props.show) {
    return null
  }
  const authors = props.authors
  // const authors = [
  //   {
  //     name: 'Robert Martin',
  //     born: 1952,
  //     bookCount: 2,
  //   },
  //   {
  //     name: 'Martin Fowler',
  //     born: 1963,
  //     bookCount: 1,
  //   },
  //   {
  //     name: 'Fyodor Dostoevsky',
  //     born: 1821,
  //     bookCount: 2,
  //   },
  //   {
  //     name: 'Joshua Kerievsky',
  //     born: null,
  //     bookCount: 1,
  //   },
  //   {
  //     name: 'Sandi Metz',
  //     born: null,
  //     bookCount: 1,
  //   },
  // ]

  return (
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
  )
}

export default Authors
