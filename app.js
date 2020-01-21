const express = require('express');
const bodyParser = require('body-parser');
const graphqlHttp = require('express-graphql');
// object destructuring
// pull out properties, store values in equally named vars
const { buildSchema } = require('graphql')
    // function that takes js template literal string, used to define schema

// creates express app object
const app = express();

const events = [];

app.use(bodyParser.json());

// app.get('/', (req, res, next) =>{
//     res.send('Hello World!');
// })

// must adhere to standards set in graphql... aka use the right keywords
// graphql is a type language


app.use('/graphql', graphqlHttp({
    schema: buildSchema(`
            type Event {
                _id: ID!
                title: String!
                description: String!
                price: Float!
                date: String!
            }

            input EventInput {
                title: String!
                description: String!
                price: Float!
                date: String!
            }

            type RootQuery {
                events: [Event!]!
            }
            type RootMutation {
                createEvent(eventInput: EventInput): Event
            }
            schema {
                query: RootQuery
                mutation: RootMutation
            }
    `),
    // resolver
    rootValue: {
        events: () => {
            return events;
        },
        createEvent : (args) => {
            const event = {
                _id : Math.random().toString(),
                title: args.eventInput.title,
                description: args.eventInput.description,
                price: +args.eventInput.price,
                date: args.eventInput.date
            }
            events.push(event);
            return event;
        }
    },
    graphiql: true
}));

app.listen(3000);