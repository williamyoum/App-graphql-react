const express = require('express');
const bodyParser = require('body-parser');
const graphqlHttp = require('express-graphql');
// object destructuring
// pull out properties, store values in equally named vars
const { buildSchema } = require('graphql')
    // function that takes js template literal string, used to define schema

// creates express app object
const app = express();

app.use(bodyParser.json());

// app.get('/', (req, res, next) =>{
//     res.send('Hello World!');
// })

// must adhere to standards set in graphql... aka use the right keywords
// graphql is a type language


app.use('/graphql', graphqlHttp({
    schema: buildSchema(`
            type RootQuery {
                events: [String!]!
                
            }
            type RootMutation {
                createEvent(name: String): String
            }
            schema {
                query: RootQuery
                mutation: RootMutation
            }
    `),
    // resolver
    rootValue: {
        events: () => {
            return ['item1', 'item2', 'item3']
        },
        createEvent: (args) =>{
            const eventName = args.name;
            return eventName;
        }
    },
    graphiql: true
}));

app.listen(3000);