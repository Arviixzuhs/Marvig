interface paramItem {
  name: string
  value: number | string | null
}

export const paramsConstructor = (params: paramItem[]): string => {
  const newParams = new URLSearchParams()

  params.map((item) => {
    if (item.value) {
      newParams.append(item.name, String(item.value))
    }
  })

  return newParams.toString()
}
