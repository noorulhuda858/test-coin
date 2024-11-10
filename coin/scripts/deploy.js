const { run } = require("hardhat");

async function main() {
  await run("ignition", { module: "scripts/Nosark.js" });
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
