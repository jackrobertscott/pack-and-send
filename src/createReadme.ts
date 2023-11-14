export function createReadme({
  gitUrl,
  name,
  desc,
}: {
  gitUrl: string
  name: string
  desc: string
}) {
  const url = gitUrl.replace(".git", "")
  return [
    `# ${name}`,
    `> ${desc}`,
    `## Install`,
    wrapCode("sh", `npm install ${name}`),
    `## Usage`,
    wrapCode("ts", `// todo`),
    `## API`,
    `Todo...`,
    `## Contributing`,
    `Contributions are always welcome!`,
    `## License`,
    `This project is licensed under the MIT License.`,
    `## Support`,
    `If you have any questions or issues, feel free to open an issue on the [GitHub repository](${url}).`,
  ].join("\n\n")
}

function wrapCode(language: string, code: string) {
  return ["```" + language, code, "```"].join("\n")
}
