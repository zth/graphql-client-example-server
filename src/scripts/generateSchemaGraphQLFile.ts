import { printSchema } from "graphql";
import fs from "fs";
import path from "path";
import { schema } from "../schema";

fs.writeFileSync(
  path.resolve(path.join(__dirname, "../../schema.graphql")),
  printSchema(schema)
);
