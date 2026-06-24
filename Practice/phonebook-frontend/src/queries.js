import { gql } from '@apollo/client'

export const ALL_PERSONS = gql`
  query {
    allPersons {
      name
      number
      # phone
      id
    }
  }
`

export const FIND_PERSON = gql`
  query findPersonByName($nameToSearch: String!) {
    findPerson(name: $nameToSearch) {
      name
      number
      # phone
      id
      address {
        street
        city
      }
    }
  }
`

export const CREATE_PERSON = gql`
  mutation createPerson(
    $name: String!
    $street: String!
    $city: String!
    $number: String # $phone: String
  ) {
    addPerson(name: $name, street: $street, city: $city, number: $number) {
      # addPerson(name: $name, street: $street, city: $city, phone: $phone) {
      name
      number
      # phone
      id
      address {
        street
        city
      }
    }
  }
`

export const EDIT_NUMBER = gql`
  mutation editNumber($name: String!, $number: String!) {
    editNumber(name: $name, number: $number) {
      # mutation editNumber($name: String!, $phone: String!) {
      #   editNumber(name: $name, phone: $phone) {
      name
      # phone
      number
      address {
        street
        city
      }
      id
    }
  }
`

export const LOGIN = gql`
  mutation login($username: String!, $password: String!) {
    login(username: $username, password: $password) {
      value
    }
  }
`
