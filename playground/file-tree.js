const fs = require("fs");
const util = require("util");
const path = require("path");
const glob = require("glob");

const asyncGlob = util.promisify(glob);
const extensionMap = {
  js: "javascript",
  css: "css",
  html: "html",
  json: "json",
  scss: "scss",
  xml: "xml",
  swift: "swift",
};
const maxDbs = 5;
const tokensPath = path.resolve("tokens");

const file = {};
file.onDidSave = (file) => {};

function setupFileChangeHandlers(configPath) {
  __MONACO_EDITOR__.onDidChangeModelContent((ev) => {
    if (!ev.isFlush) {
      currentFileContentChanged();
    }
  });
  __MONACO_EDITOR__._domElement.addEventListener("keydown", (ev) => {
    if (ev.key === "s" && ev.ctrlKey) {
      ev.preventDefault();
      saveCurrentFile();
    }
  });
}

function checkFirstFile() {
  const fileTreeContainer = document.getElementById("file-tree");
  const firstFileBtn = Array.from(fileTreeContainer.children)[0];
  firstFileBtn.setAttribute("checked", "");
  switchToFile(firstFileBtn.innerText);
}

async function saveCurrentFile() {
  const selectedFileBtn = getSelectedFileBtn();
  if (!selectedFileBtn) {
    return;
  }
  const selectedFile = selectedFileBtn.innerText;
  if (!selectedFile) {
    return;
  }
  await new Promise((resolve) => {
    fs.writeFile(selectedFile, __MONACO_EDITOR__.getValue(), () => {
      resolve();
    });
  });
  selectedFileBtn.removeAttribute("unsaved");
  file.onDidSave(selectedFile);
  return selectedFile;
}

async function currentFileContentChanged() {
  const selectedFileBtn = getSelectedFileBtn();
  if (selectedFileBtn) {
    selectedFileBtn.setAttribute("unsaved", "");
  }
}

/**
 * Makes sure only to keep the 5 most recent DB instances related to this playground.
 * This assumes people will not have more than 5 running playgrounds
 * simultaneously in the same browser.
 *
 * We used to run on a static db name, but that meant you could not have
 * multiple playgrounds open in the same browser. Now we prefix the db name
 * with a timestamp and a unique ID, but that could end up filling the user's
 * disk eventually with these playground dbs, which I don't want to do.
 */
async function deleteLeftoverDB() {
  const dbs = await indexedDB.databases();
  dbs
    .filter((db) => db.name.startsWith("IDBWrapper-level-filesystem-"))
    .sort((a, b) => {
      const timestampA = a.name.split("-")[3];
      const timestampB = b.name.split("-")[3];
      if (timestampA > timestampB) {
        return -1;
      }
      if (timestampA < timestampB) {
        return 1;
      }
      return 0;
    })
    .reverse();

  // If we exceed max amount of level-DBs
  // Take the oldest ones and delete

  if (dbs.length > maxDbs) {
    const amountToDelete = dbs.length - maxDbs;
    const dbsToDelete = dbs.slice(0, amountToDelete);
    await Promise.all(
      dbsToDelete.map((db) => {
        return new Promise(async (resolve) => {
          await indexedDB.deleteDatabase(db.name);
          resolve();
        });
      })
    );
  }
}

async function initDB() {
  await new Promise((resolve) => {
    fs.mkdir(tokensPath, (err) => {
      resolve();
    });
  });
}

async function createInputFiles(configPath) {
  // Create SD config
  await new Promise((resolve) => {
    fs.writeFile(
      configPath,
      JSON.stringify(
        {
          source: ["tokens/**/*.json"],
          platforms: {
            scss: {
              transformGroup: "scss",
              prefix: "sd",
              buildPath: "build/scss/",
              files: [
                {
                  destination: "_variables.scss",
                  format: "scss/variables",
                },
              ],
            },
          },
        },
        null,
        2
      ),
      (err) => {
        resolve();
      }
    );
  });

  // Create some tokens (color)
  await new Promise((resolve) => {
    fs.writeFile(
      path.join(tokensPath, "color.json"),
      JSON.stringify(
        {
          color: {
            firebrick: { value: "#B22222" },
            orchid: { value: "#DA70D6" },
            turquoise: {
              pale: { value: "#AFEEEE" },
              medium: { value: "#48D1CC" },
              dark: { value: "#00CED1" },
            },
          },
        },
        null,
        2
      ),
      (err) => {
        resolve();
      }
    );
  });
}

function getSelectedFileBtn() {
  const fileTreeContainer = document.getElementById("file-tree");
  const selectedFileBtn = Array.from(fileTreeContainer.children).find((child) =>
    child.hasAttribute("checked")
  );
  return selectedFileBtn;
}

async function switchToFile(file) {
  const ext = path.extname(file).slice(1);
  const lang = extensionMap[ext];
  const fileData = await new Promise((resolve) => {
    fs.readFile(file, "utf-8", (err, data) => {
      resolve(data);
    });
  });
  window.__MONACO_EDITOR__.setValue(fileData);
  changeLang(lang);
  window.__MONACO_EDITOR__.setScrollTop(0);
}

async function populateFileTree(configPath) {
  const files = await asyncGlob("**/*", { fs, nodir: true });
  const fileTreeContainer = document.getElementById("file-tree");
  fileTreeContainer.innerHTML = "";
  files.forEach((file) => {
    const btn = document.createElement("button");
    btn.innerText = file;
    fileTreeContainer.appendChild(btn);
  });
  const btns = Array.from(fileTreeContainer.children);

  btns.forEach((btn) => {
    btn.addEventListener("click", async () => {
      const oldCheckedBtn = btns.find((btn) => btn.hasAttribute("checked"));
      if (oldCheckedBtn) {
        if (oldCheckedBtn.hasAttribute("unsaved")) {
          await saveCurrentFile(configPath);
        }
        oldCheckedBtn.removeAttribute("checked");
      }
      btn.setAttribute("checked", "");
      switchToFile(btn.innerText);
    });
  });

  checkFirstFile();
}

function changeLang(lang) {
  window.__MONACO__.editor.setModelLanguage(
    window.__MONACO_EDITOR__.getModel(),
    lang
  );
}

module.exports = {
  file,
  setupFileChangeHandlers,
  checkFirstFile,
  saveCurrentFile,
  currentFileContentChanged,
  deleteLeftoverDB,
  initDB,
  createInputFiles,
  getSelectedFileBtn,
  switchToFile,
  populateFileTree,
  changeLang,
};
