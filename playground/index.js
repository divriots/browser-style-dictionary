const fs = require("fs");
const util = require("util");
const path = require("path");
const glob = require("glob");
const StyleDictionary = require("../browser.js");
const {
  initDB,
  populateFileTree,
  deleteLeftoverDB,
  createInputFiles,
  setupFileChangeHandlers,
} = require("./file-tree.js");

const asyncGlob = util.promisify(glob);

let myStyleDictionary;

const configPath = path.resolve("sd.config.json");

async function cleanPlatformOutputDirs() {
  if (!myStyleDictionary || !myStyleDictionary.platforms) {
    return;
  }
  await Promise.all(
    Object.entries(myStyleDictionary.platforms).map(([key, val]) => {
      return new Promise(async (resolve) => {
        const folderToClean = val.buildPath;
        const allFiles = await asyncGlob(`${folderToClean}/**/*`, { fs });
        await Promise.all(
          allFiles.map((file) => {
            return new Promise((resolve) => {
              fs.unlink(file, () => {
                resolve();
              });
            });
          })
        );
        resolve();
      });
    })
  );
}

async function runStyleDictionary() {
  console.log("Running style-dictionary...");
  await cleanPlatformOutputDirs();
  myStyleDictionary = await StyleDictionary.extend(configPath);
  await myStyleDictionary.buildAllPlatforms();
  await populateFileTree();
}

(async function () {
  await initDB();
  await deleteLeftoverDB();
  await createInputFiles(configPath);
  await runStyleDictionary();
  setupFileChangeHandlers();
  window.addEventListener("resize", () => {
    __MONACO_EDITOR__.layout({});
    __MONACO_EDITOR__.layout();
  });
  __MONACO_EDITOR__.layout({});
  __MONACO_EDITOR__.layout();
})();
