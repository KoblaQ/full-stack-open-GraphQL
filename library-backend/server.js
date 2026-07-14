const { ApolloServer } = require('@apollo/server')
// const { startStandaloneServer } = require('@apollo/server/standalone')

// Express
const {
  ApolloServerPluginDrainHttpServer,
} = require('@apollo/server/plugin/drainHttpServer')
const { expressMiddleware } = require('@as-integrations/express5')
const cors = require('cors')
const express = require('express')
const { makeExecutableSchema } = require('@graphql-tools/schema')
const http = require('http')
const mongoose = require('mongoose')

// Websocket
const { WebSocketServer } = require('ws')
const { useServer } = require('graphql-ws/use/ws')

const jwt = require('jsonwebtoken')

const resolvers = require('./resolvers')
const typeDefs = require('./schema')
const User = require('./models/user')

const getUserFromAuthHeader = async (auth) => {
  if (!auth || !auth.startsWith('Bearer ')) {
    return null
  }

  const decodedToken = jwt.verify(auth.substring(7), process.env.JWT_SECRET)

  return User.findById(decodedToken.id)
}

const createBookCountLoader = () => {
  let queue = new Map()
  let scheduled = false

  const dispatch = async () => {
    const entries = [...queue.entries()]
    queue = new Map()
    scheduled = false

    try {
      const authorIds = entries.map(([authorId]) => authorId)
      const objectIds = authorIds.map((authorId) => new mongoose.Types.ObjectId(authorId))

      const counts = await mongoose.connection.collection('books').aggregate([
        {
          $match: {
            author: { $in: objectIds },
          },
        },
        {
          $group: {
            _id: '$author',
            count: { $sum: 1 },
          },
        },
      ]).toArray()

      const countsByAuthorId = new Map(
        counts.map(({ _id, count }) => [_id.toString(), count]),
      )

      entries.forEach(([authorId, resolvers]) => {
        const count = countsByAuthorId.get(authorId) ?? 0
        resolvers.resolve.forEach((resolve) => resolve(count))
      })
    } catch (error) {
      entries.forEach(([, resolvers]) => {
        resolvers.reject.forEach((reject) => reject(error))
      })
    }
  }

  return {
    load(authorId) {
      const key = authorId.toString()

      return new Promise((resolve, reject) => {
        const existing = queue.get(key)

        if (existing) {
          existing.resolve.push(resolve)
          existing.reject.push(reject)
        } else {
          queue.set(key, {
            resolve: [resolve],
            reject: [reject],
          })
        }

        if (!scheduled) {
          scheduled = true
          queueMicrotask(dispatch)
        }
      })
    },
  }
}

// Using the express middleware
const startServer = async (port) => {
  const app = express()
  const httpServer = http.createServer(app)

  // Websocket for subscriptions
  const wsServer = new WebSocketServer({
    server: httpServer,
    path: '/',
  })

  const schema = makeExecutableSchema({ typeDefs, resolvers })
  const serverCleanup = useServer({ schema }, wsServer)

  const server = new ApolloServer({
    // schema: makeExecutableSchema({ typeDefs, resolvers }),
    schema,
    plugins: [
      ApolloServerPluginDrainHttpServer({ httpServer }),
      {
        async serverWillStart() {
          return {
            async drainServer() {
              await serverCleanup.dispose()
            },
          }
        },
      },
    ],
  })

  await server.start()

  app.use(
    '/',
    cors(),
    express.json(),
    expressMiddleware(server, {
      context: async ({ req }) => {
        const auth = req.headers.authorization
        const currentUser = await getUserFromAuthHeader(auth)
        return {
          currentUser,
          bookCountLoader: createBookCountLoader(),
        }
      },
    }),
  )

  httpServer.listen(port, () => {
    console.log(`Server is now running on http://localhost:${port}`)
  })
}

// const startServer = (port) => {
//   const server = new ApolloServer({
//     typeDefs,
//     resolvers,
//   })

//   startStandaloneServer(server, {
//     listen: { port: 4000 },
//     context: async ({ req }) => {
//       const auth = req.headers.authorization
//       const currentUser = await getUserFromAuthHeader(auth)
//       return { currentUser }
//     },
//   }).then(({ url }) => {
//     console.log(`Server ready at ${url}`)
//   })
// }

module.exports = startServer
