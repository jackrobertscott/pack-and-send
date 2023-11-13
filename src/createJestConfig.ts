export function createJestConfig() {
  return JSON.stringify(
    {
      preset: "ts-jest",
      testEnvironment: "node",
    },
    null,
    2
  )
}
