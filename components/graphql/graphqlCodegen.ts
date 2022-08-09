import { buildSchema, printSchema, parse } from 'graphql'
import schema from './schema.grpahql'
import * as typescriptPlugin from '@graphql-codegen/typescript'

const schemaAST = buildSchema(schema)
const config = {
  documents: [],
  config: {},
  // used by a plugin internally, although the 'typescript' plugin currently
  // returns the string output, rather than writing to a file
  filename: outputFile,
  schema: parse(printSchema(schema)),
  plugins: [
    // Each plugin should be an object
    {
      typescript: {}, // Here you can pass configuration to the plugin
    },
  ],
  pluginMap: {
    typescript: typescriptPlugin,
  },
}
