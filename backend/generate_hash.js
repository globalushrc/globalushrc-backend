const bcrypt = require("bcryptjs");
const fs = require("fs");

async function generateHash() {
  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash("admin123", salt);
  fs.writeFileSync("hash.txt", hash);
  console.log("Hash written to hash.txt");
}

generateHash();
