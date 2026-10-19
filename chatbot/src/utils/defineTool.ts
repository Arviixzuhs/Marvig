export const Type = {
  OBJECT: 'object',
  STRING: 'string',
  NUMBER: 'number',
  INTEGER: 'integer',
  BOOLEAN: 'boolean',
  ARRAY: 'array',
} as const

export interface ToolSchema {
  name: string
  description: string
  parameters?: {
    type: 'object'
    properties: Record<string, any>
    required?: string[]
  }
}

export function defineTool<TArgs = any, TResult = any>(config: {
  schema: ToolSchema
  execute: (args: TArgs) => Promise<TResult> | TResult
}) {
  return {
    name: config.schema.name,
    declaration: {
      ...config.schema,
      parameters: config.schema.parameters ?? { type: 'object' as const, properties: {} },
    },
    execute: config.execute,
  }
}
