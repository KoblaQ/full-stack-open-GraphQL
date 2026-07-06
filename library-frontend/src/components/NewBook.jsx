import { useState } from 'react'
import { useMutation } from '@apollo/client/react'

import { CREATE_BOOK, ALL_BOOKS } from '../queries'

const NewBook = (props) => {
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [published, setPublished] = useState('')
  const [genre, setGenre] = useState('')
  const [genres, setGenres] = useState([])

  const [createBook] = useMutation(CREATE_BOOK, {
    refetchQueries: [{ query: ALL_BOOKS }],
    onCompleted: () => {
      props.setPage('books')
    },
    onError: (error) => console.log(error),
  })

  if (!props.show) {
    return null
  }

  const submit = async (event) => {
    event.preventDefault()

    const publishedYear = Number(published)

    createBook({
      variables: { title, author, published: publishedYear, genres },
    })

    setTitle('')
    setPublished('')
    setAuthor('')
    setGenres([])
    setGenre('')

    // props.setPage('books')
  }

  const addGenre = () => {
    setGenres(genres.concat(genre))
    setGenre('')
  }

  return (
    <div>
      <form onSubmit={submit}>
        <div>
          <label htmlFor="title">
            title
            <input
              id="title"
              value={title}
              onChange={({ target }) => setTitle(target.value)}
            />
          </label>
        </div>
        <div>
          <label htmlFor="author">
            author
            <input
              id="author"
              value={author}
              onChange={({ target }) => setAuthor(target.value)}
            />
          </label>
        </div>
        <div>
          <label htmlFor="published">
            published
            <input
              id="published"
              type="number"
              value={published}
              onChange={({ target }) => setPublished(target.value)}
            />
          </label>
        </div>
        <div>
          <label>
            genre
            <input
              name="genre"
              value={genre}
              onChange={({ target }) => setGenre(target.value)}
            />
          </label>
          <button onClick={addGenre} type="button">
            add genre
          </button>
        </div>
        <div>genres: {genres.join(', ')}</div>
        <button type="submit">create book</button>
      </form>
    </div>
  )
}

export default NewBook
