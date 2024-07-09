import bodyParser from 'body-parser'
import cors from 'cors'
import express from 'express'
import morgan from 'morgan'
import * as path from 'path'
import { fileURLToPath } from 'url';
import { loadFilesSync } from '@graphql-tools/load-files'
import { makeExecutableSchema } from '@graphql-tools/schema'
import { mergeTypeDefs, mergeResolvers } from '@graphql-tools/merge'
import { createYoga } from 'graphql-yoga'

// Importing resolvers manually
import { problemResolver } from './modules/problem/problemInfo.resolvers.js'

const app = express();

app.use(cors());
app.use(morgan('combined'));
app.use(bodyParser.urlencoded({ limit: '10mb', extended: true }));
app.use(bodyParser.json({limit: '10mb'})); 

// GraphQL app config
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const typesArray = loadFilesSync(path.join(__dirname, '**/*.graphql'));
// const resolversArray = loadFilesSync(path.join(__dirname, '**/*.resolvers.js'));
const resolversArray = [problemResolver];
const schema = makeExecutableSchema({
	typeDefs: mergeTypeDefs(typesArray),
	resolvers: mergeResolvers(resolversArray),
})
const graphQLServer = createYoga({schema})

app.use('/graphql', graphQLServer)

app.use('/test', function (req, res) {
  const file = req.file
  console.log(req.body)
  return res.status(200).json({
    file: 'file'
  })
})

app.get('/healthz', function (req, res) {
	
	res.send('I am happy and healthy\n');
});

export default app;
