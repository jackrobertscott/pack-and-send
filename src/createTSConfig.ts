export function createTSConfig() {
  return JSON.stringify(
    {
      compilerOptions: {
        strict: true,
        declaration: true,
        skipLibCheck: true,
        esModuleInterop: true,
        forceConsistentCasingInFileNames: true,
        moduleResolution: "Node",
        module: "ESNext",
        target: "ESNext",
        outDir: "dist",
      },
      include: ["src"],
      exclude: ["node_modules", "**/*.test.ts"],
    },
    null,
    2
  )
}
