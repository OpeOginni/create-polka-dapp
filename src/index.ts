#!/usr/bin/env node

import { input, select, Separator } from "@inquirer/prompts";

import ora from "ora";

import * as fs from "node:fs";
import path, { dirname } from "node:path";
import { fileURLToPath } from "node:url";
import createDirectoryContents from "./createDirectoryContents.js";

type Choice<Value> = {
  value: Value;
  name?: string;
  description?: string;
  short?: string;
  disabled?: boolean | string;
};

const CURR_DIR = process.cwd();

// dirname is not available in ES6 modules
const __dirname = dirname(fileURLToPath(import.meta.url));

const PROJECT_TYPE_CHOICES: Choice<string>[] = fs
  .readdirSync(path.join(__dirname, "..", "templates"))
  .map((type) => {
    const projectType = type.replace(/-/g, " + ").replace(/_/g, " ");
    return {
      value: type,
      name: projectType,
    };
  });

const PROJECT_CHOICES = (type: string) =>
  fs
    .readdirSync(path.join(__dirname, "..", "templates", type))
    .map((project) => {
      return {
        value: project,
        name: project.replace(/-/g, " + ").replace(/_/g, " "),
      };
    });

const selectedProjectType = await select({
  message: "What Polkadot app type are you building",
  choices: PROJECT_TYPE_CHOICES,
});

const selectedProject = await select({
  message: "What project template would you like to generate?",
  choices: PROJECT_CHOICES(selectedProjectType),
});

const projectName = await input({
  message: "Project name:",
  validate: (input: string) => {
    if (
      /^(?:@[a-zA-Z\d\-*~][a-zA-Z\d\-*._~]*\/)?[a-zA-Z\d\-~][a-zA-Z\d\-._~]*$/.test(
        input
      )
    )
      return true;

    return "Project name may only include letters, numbers, underscores and hashes.";
  },
});

const spinner = ora(
  `creating a new Polkadot Dapp in ${CURR_DIR}/${projectName}`
).start();

const templatePath = path.join(
  __dirname,
  "..",
  `templates/${selectedProjectType}/${selectedProject}`
);

fs.mkdirSync(`${CURR_DIR}/${projectName}`);

createDirectoryContents(templatePath, projectName);

spinner.succeed();

console.log("\n");

console.log("Done. Now run:\n");

console.log(`cd ${projectName}`);
console.log("npm install");
console.log("npm run dev");

process.exit(0);
