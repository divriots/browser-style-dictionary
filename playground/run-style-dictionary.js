const fs = require("fs");
const glob = require("glob");
const util = require("util");
const { populateFileTree } = require("./file-tree.js");
const StyleDictionary = require('../browser.js');
const asyncGlob = util.promisify(glob);

let oldStyleDictionary;

async function cleanPlatformOutputDirs(sd) {
  if (!oldStyleDictionary || !oldStyleDictionary.platforms) {
    return;
  }
  await Promise.all(
    Object.entries(oldStyleDictionary.platforms).map(([key, val]) => {
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

module.exports = async function(configPath) {
  console.log("Running style-dictionary...");
  await cleanPlatformOutputDirs();
  const newStyleDictionary = await StyleDictionary.extend(configPath);
  await newStyleDictionary.buildAllPlatforms();
  await populateFileTree(configPath);
  oldStyleDictionary = newStyleDictionary;
  return newStyleDictionary;
}