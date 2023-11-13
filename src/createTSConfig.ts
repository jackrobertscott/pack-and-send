export function createTSConfig() {
  return JSON.stringify(
    {
      compilerOptions: {
        strict: true,
        declaration: true,
        skipLibCheck: true,
        esModuleInterop: true,
        forceConsistentCasingInFileNames: true,
        module: "CommonJS",
        target: "ES2020",
        lib: ["ES2020"],
        outDir: "dist",
      },
      include: ["src"],
      exclude: ["node_modules", "**/*.test.ts"],
    },
    null,
    2
  )
}
