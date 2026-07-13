const { ApolloServer } = require('@apollo/server')
// const { startStandaloneServer } = require('@apollo/server/standalone')

const {
  ApolloServerPluginDrainHttpServer,
} = require('@apollo/server/plugin/drainHttpServer')
const { expressMiddleware } = require('@as-integrations/express5')
const cors = require('cors')
const express = require('express')
const { makeExecutableSchema } = require('@graphql-tools/schema')
const http = require('http')

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
  return User.findById(decodedToken.id).populate('friends')
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
        return { currentUser }
      },
    }),
  )

  httpServer.listen(port, () =>
    console.log(`Server is now running on http://localhost:${port}`),
  )
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
