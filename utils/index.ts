export function camelToDash(str: string) {
  return str.replace(/[A-Z]/g, (item: string, index: number) => {
    return index ? '-' + item.toLowerCase() : item.toLowerCase()
  })
}
export const marker = `{{lit-${String(Math.random()).slice(2)}}}`;
// export const nodeMarker = `<!--${marker}-->`;

// export const markerRegex = new RegExp(`${marker}|${nodeMarker}`);