import { input } from "@inquirer/prompts"

async function main() {
  const name = await input({ message: "Your name:" })
  console.log(name)
}

main()
