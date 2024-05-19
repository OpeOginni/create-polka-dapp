import * as fs from "node:fs";
const CURR_DIR = process.cwd();

export default function createDirectoryContents(
  templatePath: string,
  newProjectPath: string
) {
  const filesToCreate = fs.readdirSync(templatePath);

  for (let i = 0; i < filesToCreate.length; i++) {
    let file = filesToCreate[i];
    const origFilePath = `${templatePath}/${file}`;

    const stats = fs.statSync(origFilePath);

    if (stats.isFile()) {
      let contents = fs.readFileSync(origFilePath, "utf8");

      if (file === "_gitignore") file = ".gitignore";

      if (file === "_env_example") file = ".env.example";

      if (file === "package.json") {
        const packageJson = JSON.parse(contents);
        packageJson.name = newProjectPath;
        contents = JSON.stringify(packageJson, null, 2);
      }

      const writePath = `${CURR_DIR}/${newProjectPath}/${file}`;
      fs.writeFileSync(writePath, contents, "utf8");
    } else if (stats.isDirectory()) {
      fs.mkdirSync(`${CURR_DIR}/${newProjectPath}/${file}`);

      //recursive call

      createDirectoryContents(
        `${templatePath}/${file}`,
        `${newProjectPath}/${file}`
      );
    }
  }
}
