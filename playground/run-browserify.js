const browserify = require("browserify");
const watchify = require("watchify");
const fs = require("fs");
const path = require("path");
const through = require("through2");
const yargs = require("yargs");
const { hideBin } = require("yargs/helpers");
const argv = yargs(hideBin(process.argv)).argv;

const outputDir = path.resolve("dist");

if (!(fs.existsSync(outputDir) && fs.lstatSync(outputDir).isDirectory())) {
  fs.mkdirSync(outputDir);
}

const b = browserify({
  entries: ["./playground/index.js"],
  cache: {},
  packageCache: {},
  plugin: argv.watch ? [watchify] : [],
  // Perhaps there's a better way to replace imports, but `-r fs:browserify-fs` didn't work
  transform: function (file) {
    return through(function (buf, enc, next) {
      this.push(
        buf
          .toString("utf8")
          .replace(/require\(("|')fs("|')\)/g, "require('browserify-fs')")
      );
      next();
    });
  },
});

b.on("update", bundle);
bundle();

function bundle() {
  console.log("(re)bundling");
  b.bundle((err, src) => {
    if (err) {
      console.error(err);
      return;
    }
    fs.writeFileSync(path.join(outputDir, "browserified.js"), src);
  }).on("error", console.error);
}
