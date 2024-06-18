import type { CodegenConfig } from '@graphql-codegen/cli'
 
const config: CodegenConfig = {
  schema: 'https://iit-backend-v2.vercel.app/api/graphql',
  overwrite: true,
  documents: "./hooks/**/*.tsx",
  generates: {
    './gql/': {
      preset: 'client',
    },
    "./gql/json/schema.json": {
      plugins: ["introspection"]
    }
  }
}
export default config