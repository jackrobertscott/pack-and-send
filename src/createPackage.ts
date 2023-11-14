export function createPackage({
  gitUrl,
  name,
  desc,
  author,
}: {
  gitUrl: string
  name: string
  desc: string
  author: string
}) {
  return JSON.stringify(
    {
      name,
      description: desc,
      author: author,
      version: "0.1.0",
      license: "MIT",
      main: "dist/index.js",
      types: "dist/index.d.ts",
      files: ["dist", "readme.md"],
      keywords: [],
      repository: {
        type: "git",
        url: gitUrl,
      },
      scripts: {
        build: "tsc",
        watch: "tsc --watch",
        clean: "rm -rf dist/*",
        dev: "ts-node-dev src/index.ts",
        prepublishOnly: "npm run test && npm run clean && npm run build",
        test: "jest",
      },
      devDependencies: {
        "@types/jest": "^29.5.7",
        "@types/node": "^20.8.10",
        jest: "^29.7.0",
        "ts-jest": "^29.1.1",
        "ts-node-dev": "^2.0.0",
        typescript: "^5.2.2",
      },
    },
    null,
    2
  )
}
