// import { useState } from 'react'
import { useQuery } from '@apollo/client/react'
import { ALL_BOOKS, ME } from '../queries'

const Recommendations = (props) => {
  const me = useQuery(ME, { skip: !props.token })
  const genre = me?.data?.me?.favoriteGenre

  // console.log(genre)
  // const genre = props.favoriteGenre

  const result = useQuery(ALL_BOOKS, {
    variables: { genre },
    skip: !genre,
  })

  const books = result.data?.allBooks ?? []

  if (!props.show) {
    return null
  }

  // console.log(books)

  // const filteredBooks = !favoriteGenre
  //   ? books
  //   : books.filter((book) =>
  //       book.genres.some((genre) => genre.toLowerCase() === favoriteGenre),
  //     )

  return (
    <div>
      <h2>recommendations</h2>
      {genre && (
        <div>
          books in your favorite genre <strong>{genre}</strong>
        </div>
      )}

      <table>
        <tbody>
          <tr>
            <th></th>
            <th>author</th>
            <th>published</th>
          </tr>
          {books.map((a) => (
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
