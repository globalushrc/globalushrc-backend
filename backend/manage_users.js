const fs = require("fs");
const path = require("path");
const bcrypt = require("bcryptjs");
const readline = require("readline");

const USERS_FILE = path.join(__dirname, "users.json");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function getUsers() {
  if (!fs.existsSync(USERS_FILE)) {
    return [];
  }
  const data = fs.readFileSync(USERS_FILE, "utf8");
  try {
    return JSON.parse(data);
  } catch (err) {
    return [];
  }
}

function saveUsers(users) {
  fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));
}

function prompt(question) {
  return new Promise((resolve) => rl.question(question, resolve));
}

async function listUsers() {
  const users = getUsers();
  console.log("\n--- Current Users ---");
  if (users.length === 0) {
    console.log("No users found.");
  } else {
    users.forEach((u) => console.log(`- ${u.username} (ID: ${u.id})`));
  }
  console.log("---------------------\n");
}

async function addUser() {
  const username = await prompt("Enter new username: ");
  if (!username) return console.log("Username cannot be empty.");

  const users = getUsers();
  if (users.find((u) => u.username === username)) {
    return console.log("Error: User already exists.");
  }

  const password = await prompt("Enter password: ");
  if (!password) return console.log("Password cannot be empty.");

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  const newUser = {
    id: Date.now(),
    username,
    password: hashedPassword,
  };

  users.push(newUser);
  saveUsers(users);
  console.log(`User '${username}' created successfully.`);
}

async function changePassword() {
  const username = await prompt("Enter username to update: ");
  const users = getUsers();
  const user = users.find((u) => u.username === username);

  if (!user) {
    return console.log("Error: User not found.");
  }

  const newPassword = await prompt("Enter new password: ");
  if (!newPassword) return console.log("Password cannot be empty.");

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(newPassword, salt);

  user.password = hashedPassword;
  saveUsers(users);
  console.log(`Password for '${username}' updated successfully.`);
}

async function deleteUser() {
  const username = await prompt("Enter username to delete: ");
  let users = getUsers();
  const initialLength = users.length;

  // Prevent deleting the last admin if you want, but sticking to basic logic for now
  if (username === "admin" && users.length === 1) {
    const confirm = await prompt(
      "Warning: You are deleting the only 'admin' user. Continue? (y/n): ",
    );
    if (confirm.toLowerCase() !== "y") return;
  }

  users = users.filter((u) => u.username !== username);

  if (users.length === initialLength) {
    console.log("Error: User not found.");
  } else {
    saveUsers(users);
    console.log(`User '${username}' deleted successfully.`);
  }
}

async function main() {
  console.log("\n=== User Management Tool ===");
  while (true) {
    console.log("1. List Users");
    console.log("2. Add New User");
    console.log("3. Change Password");
    console.log("4. Delete User");
    console.log("5. Exit");

    const choice = await prompt("\nSelect an option (1-5): ");

    switch (choice) {
      case "1":
        await listUsers();
        break;
      case "2":
        await addUser();
        break;
      case "3":
        await changePassword();
        break;
      case "4":
        await deleteUser();
        break;
      case "5":
        rl.close();
        return;
      default:
        console.log("Invalid option.");
    }
  }
}

main();
