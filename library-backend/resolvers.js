const { GraphQLError } = require('graphql')
// const { v1: uuid } = require('uuid')

const Author = require('./models/author')
const Book = require('./models/book')

// let authors = [
//   {
//     name: 'Robert Martin',
//     id: 'afa51ab0-344d-11e9-a414-719c6709cf3e',
//     born: 1952,
//   },
//   {
//     name: 'Martin Fowler',
//     id: 'afa5b6f0-344d-11e9-a414-719c6709cf3e',
//     born: 1963,
//   },
//   {
//     name: 'Fyodor Dostoevsky',
//     id: 'afa5b6f1-344d-11e9-a414-719c6709cf3e',
//     born: 1821,
//   },
//   {
//     name: 'Joshua Kerievsky', // birthyear not known
//     id: 'afa5b6f2-344d-11e9-a414-719c6709cf3e',
//   },
//   {
//     name: 'Sandi Metz', // birthyear not known
//     id: 'afa5b6f3-344d-11e9-a414-719c6709cf3e',
//   },
// ]

const resolvers = {
  Query: {
    // bookCount: () => books.length,
    bookCount: async () => Book.collection.countDocuments(),
    // authorCount: () => authors.length,
    authorCount: async () => Author.collection.countDocuments(),
    // allBooks: () => books,
    // allBooks: (root, args) => {
    //   if (!args.author && !args.genre) {
    //     return books
    //   }

    //   return books.filter(
    //     (book) =>
    //       (!args.author || book.author === args.author) &&
    //       (!args.genre || book.genres.includes(args.genre)),
    //   )
    // },
    allBooks: async (root, args) => {
      if (!args.author && !args.genre) {
        return Book.find({}).populate('author')
      }
      // return books.filter(
      //   (book) =>
      //     (!args.author || book.author === args.author) &&
      //     (!args.genre || book.genres.includes(args.genre)),
      // )
    },
    // allAuthors: () => authors,
    allAuthors: async () => await Author.find({}),
  },

  Author: {
    bookCount: async (root) => {
      // return books.filter((book) => book.author === root.name).length
      return await Book.collection.countDocuments({ author: root._id })
    },
  },

  Mutation: {
    addBook: async (root, args) => {
      // let author = authors.find((author) => author.name === args.author)
      let author = await Author.findOne({ name: args.author })

      if (!author) {
        author = new Author({
          name: args.author,
          // id: uuid(),
        })
        // authors = authors.concat(author)
        await author.save()
      }

      const titleExists = await Book.exists({ title: args.title })

      if (titleExists) {
        throw new GraphQLError(`Book title must be unique: ${args.title}`, {
          extensions: {
            code: 'BAD_USER_INPUT',
            invalidArgs: args.title,
          },
        })
      }

      // const book = { ...args, id: uuid() }
      // books = books.concat(book)
      const book = new Book({ ...args, author: author._id })

      try {
        const savedBook = await book.save()
        return await savedBook.populate('author')
      } catch (error) {
        throw new GraphQLError(`Saving book failed: ${error.message}`, {
          extensions: {
            code: 'BAD_USER_INPUT',
            invalidArgs: args.title,
            error,
          },
        })
      }
    },

    editAuthor: (root, args) => {
      const author = authors.find((author) => author.name === args.name)

      if (!author) {
        return null
      }

      const updatedAuthor = { ...author, born: args.setBornTo }
      authors = authors.map((author) =>
        author.name === args.name ? updatedAuthor : author,
      )

      return updatedAuthor
    },
  },
}

module.exports = resolvers
