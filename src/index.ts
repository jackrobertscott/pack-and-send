#!/usr/bin/env node

import { confirm, input } from "@inquirer/prompts"
import { execSync } from "child_process"
import { mkdirSync, writeFileSync } from "fs"
import { join } from "path"
import { createGitignore } from "./createGitignore"
import { createPackage } from "./createPackage"
import { createPrettierrc } from "./createPrettierrc"
import { createTSConfig } from "./createTSConfig"

async function main() {
  const url = await input({ message: "GitHub repository url:" })
  if (!url.startsWith("https://"))
    throw new Error("Invalid repository url provided")
  if (!url.endsWith(".git"))
    throw new Error(`Repository url must end with ".git"`)
  let name = url.split("/").pop()?.slice(0, -4)
  if (!name || !name.match(/^[a-zA-Z0-9]+(-[a-zA-Z0-9]+)*$/))
    throw new Error("Unable to extract name from url")
  const startDir = process.cwd()
  const rootDir = join(startDir, name)
  const srcDir = join(rootDir, "src")
  console.log("Output directory:", rootDir)
  const desc = await input({ message: "Breif description:" })
  const author = await input({ message: "Author's name:" })
  const ok = await confirm({ message: "Confirm and proceed:" })
  if (!ok) process.exit()

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

  // Push to GitHub
  execSync(`git branch -M master`)
  execSync(`git remote add origin`)
  execSync(`git push -u origin master`)

  // Happy message
  console.log("Repository created 👍")
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
