// Divide por líneas en blanco, sin cortar bloques de código ```
export function splitBlocks(text: string): string[] {
  const blocks: string[] = []
  let current = ''
  let inFence = false

  for (const line of text.split('\n')) {
    if (line.trim().startsWith('```')) inFence = !inFence
    current += line + '\n'

    if (!inFence && line.trim() === '') {
      blocks.push(current)
      current = ''
    }
  }

  if (current) blocks.push(current)
  return blocks
}
