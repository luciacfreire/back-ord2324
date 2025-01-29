import {MongoClient} from "mongodb";
import { ContactModel } from "./type.ts";
import { resolvers } from "./resolvers.ts";
import {ApolloServer} from "@apollo/server";
import { schema } from "./schema.ts";
import {startStandaloneServer} from "@apollo/server/standalone";

const MONGO_URL= Deno.env.get("MONGO_URL");

if(!MONGO_URL){
  console.error("Please provide a mongo url"); 
  Deno.exit(-1);
}
const client = new MongoClient(MONGO_URL);

await client.connect();
console.log("Connected succesfully to server");
// await client.close();
// console.log("Connected close");
const mongoDB = client.db("agendaContactos");

const ContactsCollection = mongoDB.collection<ContactModel>("contacto");

const server = new ApolloServer({
  typeDefs: schema,
  resolvers
});

const {url} = await startStandaloneServer(server, {
  context: async () => ({ContactsCollection}),
});

console.info(`Server ready al ${url}`);

