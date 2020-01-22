const express = require('express');
const bodyParser = require('body-parser');
const graphqlHttp = require('express-graphql');
// object destructuring
// pull out properties, store values in equally named vars
const { buildSchema } = require('graphql');
const mongoose = require('mongoose');
const User = require('./models/user')
const bcrypt = require('bcryptjs')

const Event = require('./models/event');
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
            type Event {
                _id: ID!
                title: String!
                description: String!
                price: Float!
                date: String!
            }

            type User {
                _id: ID!
                email: String!
                password: String
            }
            input EventInput {
                title: String!
                description: String!
                price: Float!
                date: String!
            }
            input UserInput {
                email: String!
                password: String!
            }
            type RootQuery {
                events: [Event!]!
            }
            type RootMutation {
                createEvent(eventInput: EventInput): Event
                createUser(userInput: UserInput): User
            }
            schema {
                query: RootQuery
                mutation: RootMutation
            }
    `),
    // resolver
    rootValue: {
        events: () => {
            // tell graphql async function
            return Event.find()
                .then(events => {
                    return events.map(event => {
                        return { ...event._doc, _id: event.id };
                    })
                })
                .catch(err => {
                throw err;
            });
        },
        createEvent : args => {
            const event = new Event({
                title: args.eventInput.title,
                description: args.eventInput.description,
                price: +args.eventInput.price,
                date: new Date(args.eventInput.date),
                creator: '5e2795b6c7a0fd1bea64b53d'
            });
            //return promise
                // graphql returns promise

            let createdEvent;
            return event
                .save()
                .then(result => {
                    // edit user
                    createdEvent = { ...result._doc, _id: result._doc._id.toString()}
                    return User.findById('5e2795b6c7a0fd1bea64b53d')

                })
                .then(user => {
                    if(!user){
                        throw new Error('User not found');
                    }
                    user.createdEvents.push(event);
                    return user.save();
                })
                .then(result => {
                    return createdEvent;
                })
                .catch(err => {
                console.log(err);
                throw err;
            }) // provided by mongoose package.
        },
        createUser: args => {
            return User.findOne({email: args.userInput.email})
                .then(user => {
                    if(user) {
                        throw new Error('User already exists');
                    }
                    return bcrypt.hash(args.userInput.password, 12)
                })
                .then(hashedPassword => {
                const user = new User({
                    email: args.userInput.email,
                    password: hashedPassword
                });
                return user.save();
            })
            .then(result => {
                return {...result._doc, _id: result.id, password: null}
            })
            
            
            .catch(err => {
                throw err;
            })
            const user = new User({
                email: args.userInput.email,
                password: args.userInput.pasword
            });
        }
    },
    graphiql: true
}));

mongoose
    .connect(
        `mongodb+srv://${process.env.MONGO_USER}:${
            process.env.MONGO_PASSWORD
        }@cluster0-vppzb.mongodb.net/${process.env.MONGO_DB}?retryWrites=true&w=majority`
    )
    .then(() => {
        app.listen(3001);
    })
    .catch(err => {
        console.log(err);
    })

app.listen(3000);