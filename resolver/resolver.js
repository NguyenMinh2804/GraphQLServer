const {books, authors} = require('../data/static')
const {PubSub} = require("graphql-subscriptions")

const pubsub = new PubSub();
const resolvers = {
    // QUERY
    Query:{
        books:() => books,
        book:(parent, args) => {
            return books.find(book => book.id == args.id)
        },
        authors:() => authors,
        author:(parent, args) => {
           return  authors.find(author => author.id == args.id);
        },
    },
    Book: {
        author: (parent, args) =>
        {
            return authors.find(author => author.id == parent.authorId)
        }
    },
    Author: {
        books: (parent, args) =>
        {
            return books.filter(book => book.authorId == parent.id)
        }
    },

    // MUTATION
    Mutation: {
        createAuthor: (parent, args) => {
            var author = authors.find(auth => auth.id == args.id);
            if(author != null)
            {
                return;
            }        
            authors.push(args);
            pubsub.publish("AUTHOR_CREATE",{
                onCreateAuthor: args
            });
            return args;
        },
        editAuthor: (parent, args) => {
            var author = authors.findIndex(auth => auth.id == args.id);
            if(author == 0)
            {
                return;
            }
            authors.splice(author, 1);
            authors.push(args);
            return args;  
        },
        deleteAuthor: (parent, args) => {
            console.log(args.id);
            var author = authors.findIndex(auth => auth.id == args.id);
            if(author == -1)
            {
                return false;
            }
            authors.splice(author, 1);
            return true;  
        },
        createBook: (parent, args) => {
            var book = books.find(book => book.id == args.id);
            if(book != null)
            {
                return;
            }        
            books.push(args);
            return args;
        },
        editBook: (parent, args) => {
            var book = books.findIndex(book => book.id == args.id);
            if(book == 0)
            {
                return;
            }
            books.splice(book, 1);
            books.push(args);
            return args;  
        },
        deleteBook: (parent, args) => {
            var book = books.findIndex(book => book.id == args.id);
            if(book == -1)
            {
                return false;
            }
            books.splice(book, 1);
            return true;  
        }
    },


    // SUBSCRIPTION
    Subscription:
    {
        onCreateAuthor : {
            subscribe: () => pubsub.asyncIterator("AUTHOR_CREATE")
        }
    },

}

module.exports = resolvers;