import copy from "rollup-plugin-copy";
import * as path from "path";
import * as fs from "fs";

const plugins = [
  {
    name: "inline-fs",
    transform(code, id) {
      return code.replace(
        /fs.readFileSync\(\s*__dirname\s*\+\s*'\/templates\/(.*)'\)/g,
        (match, $1) => {
          const tpl = path.join("./lib/common/templates", $1);
          return JSON.stringify(fs.readFileSync(tpl, "utf8"));
        }
      );
    },
  },
  {
    name: "watch-external",
    buildStart() {
      this.addWatchFile(path.resolve(__dirname, "index.html"));
      this.addWatchFile(path.resolve(__dirname, "style.css"));
    },
  },
  copy({
    targets: [
      {
        src: path.resolve(__dirname, "index.html"),
        dest: "dist",
      },
      {
        src: path.resolve(__dirname, "style.css"),
        dest: "dist",
      },
      {
        src: path.resolve(__dirname, "codicon.ttf"),
        dest: "dist",
      },
    ],
  }),
];

export default {
  input: "dist/browserified.js",
  output: {
    format: "es",
    file: "dist/index.js",
  },
  plugins,
};
