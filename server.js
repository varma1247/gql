const express = require("express");
const bodyParser = require("body-parser");
const graphqlhttp = require("express-graphql");
const { buildSchema } = require("graphql");
const app = express();
app.use(bodyParser.json());
const events=[]
app.use(
  "/api",
  graphqlhttp({
    schema: buildSchema(`
        type Event{
            _id:ID!
            title: String!
            description: String!
            price:Float!
            date: String!
        }
        input EventInput{
            title: String!
            description: String!
            price:Float!
            date: String!
        }
        type RootQuery{
            events:[Event!]!
        }
        type RootMutation{
            createEvent(eventinput:EventInput): Event
        }
        schema {
            query: RootQuery,
            mutation:RootMutation
        }
    `),
    rootValue: {
      events: () => {
        return events;
      },
      createEvent:(args)=>{
        const event={
            _id: Math.random().toString(),
            title: args.eventinput.title,
            description:args.eventinput.description,
            price:+args.eventinput.price,
            date: args.eventinput.date
        }
        console.log(args)
        events.push(event)
        return event
      }
    },
    graphiql:true
  })
);
app.listen(process.env.PORT || 5000, (err) => {
  if (err) {
    console.log(err);
  } else {
    console.log("listening on port 5000");
  }
});
