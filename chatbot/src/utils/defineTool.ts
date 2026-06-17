import { FunctionDeclaration } from '@google/genai'

export function defineTool<TArgs = any, TResult = any>(config: {
  schema: FunctionDeclaration
  execute: (args: TArgs) => Promise<TResult>
}) {
  return {
    name: config.schema.name,
    declaration: config.schema,
    execute: config.execute,
  }
}
