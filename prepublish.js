const fs = require('fs');
const path = require('path');
const glob = require('glob');

const allJSFiles = glob.sync('**/*.js', {
  fs,
  ignore: [
    'node_modules/**/*',
    '__integration__/**/*',
    '__tests__/**/*',
    'examples/**/*'
  ]
});
allJSFiles.forEach(file => {
  const filePath = path.resolve(file);
  const fileData = fs.readFileSync(filePath, 'utf-8');
  const replaced = fileData.replace(
    /fs.readFileSync\(\s*__dirname\s*\+\s*'\/templates\/(.*)'\)/g,
    (match, $1) => {
      const tpl = path.join(
        "./lib/common/templates",
        $1
      );
      return JSON.stringify(fs.readFileSync(tpl, "utf8"));
    }
  );
  if (replaced !== fileData) {
    fs.writeFileSync(filePath, replaced, 'utf-8');
  }
})