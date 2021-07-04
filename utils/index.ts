export function camelToDash(str: string) {
  return str.replace(/[A-Z]/g, (item: string, index: number) => {
    return index ? '-' + item.toLowerCase() : item.toLowerCase()
  })
}
export const marker = `{{future-${String(Math.random()).slice(2)}}}`;