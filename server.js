import express from 'express';
import graphQlHTTP from 'express-graphql';
import { 
    GraphQLObjectType, 
    GraphQLString,
    GraphQLInt,
    GraphQLList,
    GraphQLNonNull,
    GraphQLSchema
} from "graphql";
import axios from 'axios';
//Data 
/* const customers = [
    {id: "1", name: "T800", email:"t8@gmail.com", age: 600},
    {id: "2", name: "John Connor", email:"jc@gmail.com", age: 15},
    {id: "3", name: "Sarah Connor", email:"sc@gmail.com", age: 45},
    {id: "4", name: "Jeff Coates", email:"jeff.c@gmail.com", age: 65},
    {id: "5", name: "John Doe", email:"jd@gmail.com", age: 75},
] */
const CustomerType = new GraphQLObjectType({
    name: "Customer",
    fields: () => ({
        id: { type: GraphQLString },
        name: { type: GraphQLString },
        email: { type: GraphQLString },
        age: { type: GraphQLInt}
    })
})

const rootQuery = new GraphQLObjectType({
    name: "RootQueryType",
    fields: {
        customer: {
            type: CustomerType,
            args: {
                id: { type: GraphQLString },
            },
            resolve(_, args) {
                //return customers.find(c => c.id === args.id) 
                return axios.get(`http://localhost:3000/customers/${args.id}`)
                    .then(res => res.data);
            }
        },
        customers: {
            type: new GraphQLList(CustomerType),
            resolve(_, args) {
                //return customers;
                return axios.get(`http://localhost:3000/customers`)
                    .then(res => res.data);
            }

        }
    }
    
})

const mutation = new GraphQLObjectType({
    name: "Mutation",
    fields: {
        addCustomer: {
            type: CustomerType,
            args: {
                name: {type: new GraphQLNonNull(GraphQLString)},
                age: { type: new GraphQLNonNull(GraphQLInt)},
                email: {type: new GraphQLNonNull(GraphQLString)},
            },
            resolve(_, args) {
                return axios.post(`http://localhost:3000/customers`,{
                    name: args.name,
                    age: args.age,
                    email: args.email
                }).then(res => res.data);
            }

        },
        delCustomer: {
            type: CustomerType,
            args: {
                id: {type: new GraphQLNonNull(GraphQLString)}
            },
            resolve(_, args) {
                return axios.delete(`http://localhost:3000/customers${args.id}`)
                .then(res => res.data);
            }
        },
        editCustomer: {
            type: CustomerType,
            args: {
                id: {type: new GraphQLNonNull(GraphQLString)},
                name: {type: GraphQLString},
                age: { type: GraphQLInt},
                email: {type: GraphQLString},
            },
            resolve(_, args) {
                return axios.patch(`http://localhost:3000/customers${args.id}`,args)
                .then(res => res.data);
            }
        }
    }
})

const schema = new GraphQLSchema({
    query: rootQuery,
    mutation
})

let app = express();
const PORT = 4500;

app.use('/graphql', graphQlHTTP({
    schema: schema,
    graphiql: true
}))
app.listen(PORT, () => console.log("running on: ", PORT))