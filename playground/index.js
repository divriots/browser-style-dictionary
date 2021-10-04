const path = require("path");
const {
  initDB,
  deleteLeftoverDB,
  createInputFiles,
  setupFileChangeHandlers,
  file,
} = require("./file-tree.js");
const runStyleDictionary = require('./run-style-dictionary.js');

const configPath = path.resolve("sd.config.json");

(async function () {
  await initDB();
  await deleteLeftoverDB();
  await createInputFiles(configPath);
  await runStyleDictionary(configPath);
  setupFileChangeHandlers();
  file.onDidSave = (file) => {
    // TODO: Check if file is not part of output by taking the path
    // and looping over configured platforms to see if it matches
    // with any of the output paths
    runStyleDictionary(configPath);
  };
  window.addEventListener("resize", () => {
    __MONACO_EDITOR__.layout({});
    __MONACO_EDITOR__.layout();
  });
  __MONACO_EDITOR__.layout({});
  __MONACO_EDITOR__.layout();
})();
