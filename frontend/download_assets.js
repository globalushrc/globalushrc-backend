import fs from "fs";
import path from "path";
import https from "https";
import { promisify } from "util";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const srcDir = path.join(__dirname, "src");
const publicDir = path.join(__dirname, "public/assets/images");

// Ensure assets directory exists
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
}

// Helper to download image with redirect handling
const downloadImage = (url, filepath) => {
  return new Promise((resolve, reject) => {
    const request = (currentUrl) => {
      https
        .get(currentUrl, (response) => {
          if (response.statusCode === 301 || response.statusCode === 302) {
            // Follow redirect
            return request(response.headers.location);
          }
          if (response.statusCode !== 200) {
            reject(
              new Error(
                `Failed to download ${currentUrl} (Status: ${response.statusCode})`,
              ),
            );
            return;
          }
          const file = fs.createWriteStream(filepath);
          response.pipe(file);
          file.on("finish", () => {
            file.close();
            resolve();
          });
        })
        .on("error", (err) => {
          fs.unlink(filepath, () => {});
          reject(err);
        });
    };
    request(url);
  });
};

// Helper to generate filename from URL or context
const getFilename = (url, prefix = "img") => {
  const urlObj = new URL(url);
  // Use the photo ID from unsplash URL if possible
  // format: https://images.unsplash.com/photo-123456...
  const matches = url.match(/photo-([a-zA-Z0-9-]+)/);
  let name = matches
    ? matches[1]
    : `image-${Math.random().toString(36).substr(2, 9)}`;

  // Clean up query params if any
  name = name.split("?")[0];
  return `${name}.jpg`; // Assuming jpg for unsplash
};

// Recursive file search
const walkDir = (dir, callback) => {
  fs.readdirSync(dir).forEach((f) => {
    const dirPath = path.join(dir, f);
    const isDirectory = fs.statSync(dirPath).isDirectory();
    if (isDirectory) {
      walkDir(dirPath, callback);
    } else {
      if (/\.(tsx|ts|js|jsx)$/.test(f)) {
        callback(dirPath);
      }
    }
  });
};

const urlMap = new Map();

// Scan files
walkDir(srcDir, (filePath) => {
  // console.log('Scanning', filePath); // debugging
  let content = fs.readFileSync(filePath, "utf8");

  // Match URLs starting with https://images.unsplash.com or https://flagcdn.com
  // terminated by quote, backtick, or whitespace
  const regex =
    /(https:\/\/(?:images\.unsplash\.com|flagcdn\.com)[^"'\s`)${}]+)/g;

  let match;
  while ((match = regex.exec(content)) !== null) {
    const url = match[1];
    // Clean up any trailing query param mess if regex grabbed too much?
    // usually the quote boundary is enough if we trust the source is valid code.

    if (!urlMap.has(url)) {
      let filename = getFilename(url);
      // Handle flagcdn naming
      if (url.includes("flagcdn")) {
        const parts = url.split("/");
        filename = "flag-" + parts[parts.length - 1];
      }
      urlMap.set(url, filename);
    }
  }
});

console.log(`Found ${urlMap.size} unique images.`);

// Download and Replace
const process = async () => {
  // 1. Download unique images
  let downloadCount = 0;
  const downloadedFiles = new Set();

  for (const [url, filename] of urlMap.entries()) {
    const destPath = path.join(publicDir, filename);
    if (fs.existsSync(destPath)) {
      downloadedFiles.add(filename);
      continue;
    }

    try {
      console.log(`Downloading ${filename}...`);
      await downloadImage(url, destPath);
      downloadCount++;
      downloadedFiles.add(filename);
    } catch (err) {
      console.error(`Error downloading ${url}:`, err.message);
    }
  }
  console.log(
    `Downloaded ${downloadCount} new images. Total available: ${downloadedFiles.size}`,
  );

  // 2. Replace in files ONLY if downloaded
  walkDir(srcDir, (filePath) => {
    let content = fs.readFileSync(filePath, "utf8");
    let hasChanges = false;

    for (const [url, filename] of urlMap.entries()) {
      if (downloadedFiles.has(filename) && content.includes(url)) {
        // Determine replacement path relative to public
        const newPath = `/assets/images/${filename}`;
        // Global replace
        const escapedUrl = url.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
        const replaceRegex = new RegExp(escapedUrl, "g");
        content = content.replace(replaceRegex, newPath);
        hasChanges = true;
      }
    }

    if (hasChanges) {
      console.log(`Updating ${path.basename(filePath)}...`);
      fs.writeFileSync(filePath, content, "utf8");
    }
  });

  console.log("Done!");
};

process();
