export function formatData(date: Date, options?: Intl.DateTimeFormatOptions) {
  return new Intl.DateTimeFormat(undefined, options).format(date);
}
