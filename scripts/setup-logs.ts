import fs from "fs";
import path from "path";

const logsDir = path.join(process.cwd(), "logs");

// Create logs directory if it doesn't exist
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir, { recursive: true });
  console.log("Created logs directory:", logsDir);
}

// Add .gitignore if it doesn't exist
const gitignorePath = path.join(logsDir, ".gitignore");
if (!fs.existsSync(gitignorePath)) {
  fs.writeFileSync(gitignorePath, "*\n!.gitignore\n");
  console.log("Created .gitignore in logs directory");
}
