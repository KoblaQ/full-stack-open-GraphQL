import { useState } from 'react'
import { useQuery } from '@apollo/client/react'
import { ALL_BOOKS } from '../queries'

const Books = (props) => {
  const [filter, setFilter] = useState(null)
  const books = props.books

  const result = useQuery(ALL_BOOKS, {
    variables: { genre: filter },
    skip: !filter,
  })

  const filteredBooks = result.data?.allBooks ?? []

  if (!props.show) {
    return null
  }

  // console.log(books)

  // console.log(filteredBooks)

  const bookList = !filter ? books : filteredBooks
  // const bookList = !filter
  //   ? books
  //   : books.filter((book) =>
  //       book.genres.some((genre) => genre.toLowerCase() === filter),
  //     )

  // console.log(bookList)

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
          {bookList.map((a) => (
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
