import { execFileSync } from "node:child_process";

const executable = process.platform === "win32" ? "npx.cmd" : "npx";

function run(command, args) {
  execFileSync(command, args, {
    env: process.env,
    stdio: "inherit",
  });
}

run(executable, ["prisma", "migrate", "deploy"]);

if (process.env.SEED_PRODUCTION_DATA === "true") {
  run(process.execPath, ["prisma/seed.mjs"]);
}

run(executable, ["next", "build"]);
