export function concatClass(...classes: unknown[]) {
  return classes.filter(c => typeof c === 'string').join(' ')
}
