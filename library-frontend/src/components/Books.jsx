import { useState } from 'react'

const Books = (props) => {
  const [filter, setFilter] = useState(null)

  if (!props.show) {
    return null
  }

  const books = props.books
  // console.log(books)

  const filteredBooks = !filter
    ? books
    : books.filter((book) =>
        book.genres.some((genre) => genre.toLowerCase() === filter),
      )

  // console.log(filteredBooks)

  const genreList = [
    ...new Set(
      books.flatMap((book) => book.genres.map((genre) => genre.toLowerCase())),
    ),
  ] // Use To lowercase to prevent duplicates
  // console.log(genreList)

  return (
    <div>
      <h2>books</h2>
      {filter && (
        <div>
          in genre <strong>{filter}</strong>
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

      <label>
        {genreList.map((genre) => (
          <button
            key={genre}
            onClick={() => setFilter(filter === genre ? null : genre)} // can be unselected to show the full list
          >
            {genre}
          </button>
        ))}
      </label>
    </div>
  )
}

export default Books
