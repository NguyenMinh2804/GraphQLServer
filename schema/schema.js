const { gql } = require("apollo-server-express");

const typeDefs = gql`
    type Book{
        id: ID
        name: String
        price: String
        authorId: ID
        author: Author
    }
    type Author{
        id: ID
        name: String
        books: [Book]
    }

    # TYPE QUERY
    type Query {
        books: [Book]
        book(id: ID!): Book
        authors: [Author]
        author(id: ID!): Author
    }

    # TYPE MUNTATION
    type Mutation{
        createAuthor(id: ID!, name: String): Author,
        editAuthor(id: ID!, name: String): Author,
        deleteAuthor(id: ID!): Boolean,
        createBook(id: ID!, name: String, price: Int, authorId: ID!): Book
        editBook(id: ID!, name: String, price: Int, authorId: ID!): Book
        deleteBook(id: ID!): Boolean
    }

    # TYPE SUBSCRIPTION
    type Subscription
    {
        onCreateAuthor: Author
    }

`
module.exports = typeDefs;