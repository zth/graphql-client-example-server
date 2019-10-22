let packageJson = require("./package.json");
let fs = require("fs");
let path = require("path");

delete packageJson.dependencies;
delete packageJson.devDependencies;
delete packageJson.husky;
delete packageJson.scripts;

fs.writeFileSync(
  path.resolve(path.join(__dirname, "./out/package.json")),
  JSON.stringify(packageJson, null, 2)
);
