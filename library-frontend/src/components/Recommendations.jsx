// import { useState } from 'react'

const Recommendations = (props) => {
  // const [filter, setFilter] = useState(null)

  const favoriteGenre = props.favoriteGenre
  console.log(favoriteGenre)

  if (!props.show) {
    return null
  }

  const books = props.books
  // console.log(books)

  const filteredBooks = !favoriteGenre
    ? books
    : books.filter((book) =>
        book.genres.some((genre) => genre.toLowerCase() === favoriteGenre),
      )

  return (
    <div>
      <h2>recommendations</h2>
      {favoriteGenre && (
        <div>
          books in your favorite genre <strong>{favoriteGenre}</strong>
        </div>
      )}

      <table>
        <tbody>
          <tr>
            <th></th>
            <th>author</th>
            <th>published</th>
          </tr>
          {filteredBooks.map((a) => (
            <tr key={a.id}>
              <td>{a.title}</td>
              <td>{a.author.name}</td>
              <td>{a.published}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default Recommendations
