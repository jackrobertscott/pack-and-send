export function createPrettierrc() {
  return JSON.stringify(
    {
      semi: false,
      singleQuote: false,
      bracketSpacing: true,
      tabWidth: 2,
    },
    null,
    2
  )
}
