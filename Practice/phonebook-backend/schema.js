const typeDefs = /* GraphQL */ `
  type Address {
    street: String
    city: String
  }

  type Person {
    name: String!
    number: String
    address: Address!
    id: ID!
  }
  # type Person {
  #   name: String!
  #   phone: String
  #   address: Address!
  #   id: ID!
  # }

  enum YesNo {
    YES
    NO
  }

  type User {
    username: String!
    friends: [Person!]!
    id: ID!
  }

  type Token {
    value: String!
  }

  type Query {
    personCount: Int!
    allPersons(number: YesNo): [Person!]!
    # allPersons(phone: YesNo): [Person!]!
    # allPersons: [Person!]!
    findPerson(name: String!): Person
    me: User
  }

  type Mutation {
    addPerson(
      name: String!
      number: String
      # number: String
      street: String!
      city: String!
    ): Person

    editNumber(name: String!, number: String!): Person
    # editNumber(name: String!, phone: String!): Person

    createUser(username: String!): User

    login(username: String!, password: String!): Token

    addAsFriend(name: String!): User
  }
`
module.exports = typeDefs
