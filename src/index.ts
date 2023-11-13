#!/usr/bin/env node

import { confirm, input } from "@inquirer/prompts"
import { execSync } from "child_process"
import { existsSync, mkdirSync, writeFileSync } from "fs"
import { basename, join } from "path"
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
  const desc = await input({ message: "NPM package description:" })
  const author = await input({ message: "Author's name:" })
  console.log("Output directory:", rootDir)
  const ok = await confirm({ message: "Confirm and proceed:" })
  if (!ok) process.exit()

  // Ensure directory does not exist
  if (existsSync(rootDir))
    throw new Error("Directory already exists at: " + rootDir)

  // Create the git directory
  mkdirSync(srcDir, { recursive: true })
  process.chdir(rootDir)
  execSync("git init")

  // Write and commit the files
  writeCommit("readme.md", `# ${name}\n\n${desc}\n`)
  writeCommit(".gitignore", createGitignore())
  writeCommit(".prettierrc", createPrettierrc())
  writeCommit("package.json", createPackage({ url, name, author, desc }))
  writeCommit("tsconfig.json", createTSConfig())
  writeCommit("src/index.ts", `console.log("Hello, World!")`)
  writeCommit("src/index.test.ts", "")

  // Push to GitHub
  execSync(`git branch -M master`)
  execSync(`git remote add origin ${url}`)
  execSync(`git push -u origin master`)

  // Happy message
  console.log("Repository created 👍")

  // Install dependencies
  console.log("Installing npm dependencies...")
  execSync(`npm install`)

  // Finishing message
  console.log("Finished ✅")
  console.log("Run: cd " + name)
}

main()

function writeCommit(filePath: string, content: string) {
  writeFileSync(filePath, content)
  const fileName = basename(filePath)
  execSync(`git add ${filePath}`)
  execSync(`git commit -m "added ${fileName}"`)
}
