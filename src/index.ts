#!/usr/bin/env node

import { input } from "@inquirer/prompts"
import { execSync } from "child_process"
import { mkdirSync, writeFileSync } from "fs"
import { join } from "path"
import { createGitignore } from "./createGitignore"
import { createPackage } from "./createPackage"
import { createPrettierrc } from "./createPrettierrc"
import { createTSConfig } from "./createTSConfig"

async function main() {
  const url = toKebabCase(await input({ message: "GitHub repository url:" }))
  if (!url.startsWith("https://"))
    throw new Error("Invalid repository url provided")
  const name = url.split("/").pop()
  if (!name || !name.match(/^[a-zA-Z0-9]+(-[a-zA-Z0-9]+)*$/))
    throw new Error("Unable to extract name from url")
  const startDir = process.cwd()
  const rootDir = join(startDir, name)
  const srcDir = join(rootDir, "src")
  console.log("Output directory:", rootDir)
  const desc = await input({ message: "Breif description:" })
  const author = await input({ message: "Author's name:" })

  // Create the git directory
  mkdirSync(srcDir, { recursive: true })
  process.chdir(rootDir)
  execSync("git init")

  // Write and commit the files
  writeFileSync("readme.md", `# ${name}\n\n${desc}\n`)
  gitCommit("added readme")
  writeFileSync(".gitignore", createGitignore())
  gitCommit("added gitignore")
  writeFileSync(".prettierrc", createPrettierrc())
  gitCommit("added prettierrc")
  writeFileSync("package.json", createPackage({ url, name, author, desc }))
  gitCommit("added package")
  writeFileSync("tsconfig.json", createTSConfig())
  gitCommit("added tsconfig")
  writeFileSync("src/index.ts", `console.log("Hello, World!")`)
  writeFileSync("src/index.test.ts", "")
  gitCommit("added index files")
}

main()

function gitCommit(message: string) {
  execSync(`git add .`)
  execSync(`git commit -m "${message}"`)
}

function toKebabCase(value: string): string {
  return value
    .toLowerCase()
    .replace(/[\s_]/g, "-")
    .replace(/[^a-z0-9-]/g, "")
    .replace(/-{2,}/g, "-")
}
