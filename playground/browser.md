# Make it work in browser

🧹 = covered by browserify

🔨 = manual rewrite or rollup step

## Shims

Globals:

- process 🧹
- Buffer 🧹
- module (--> empty) 🧹

Built-ins:

- constants 🧹
- path 🧹
- fs 🧹 with a transform & browserify-fs
- os 🧹
- stream 🧹

3rd-party:

- fs-extra (only mkdirsSync is used in src it seems so maybe create our own func that uses 'fs', as fs-extra uses graceful-fs and not real fs) 🔨
- json5 (remove support for now?) 🔨

## Build

- convert cjs -> esm 🧹
- support json import 🧹

## Misc

- pass the fs shim to glob calls 🔨
- fs read file calls to static assets -> find & replace with content on build-time 🔨
- make fs/glob calls async 🔨
