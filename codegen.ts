import type { CodegenConfig } from '@graphql-codegen/cli'
 
const config: CodegenConfig = {
   schema: 'https://iit-backend-v2.vercel.app/api/graphql',
   overwrite: true,
   documents: ['src/api/*.tsx'],
   generates: {
      './gql/': {
        preset: 'client',
      },
      "./gql/json/": {
        plugins: ["introspection"]
      }
   }
}
export default config