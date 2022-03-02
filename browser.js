/**
 * Style Dictionary module
 *
 * @module style-dictionary
 * @typicalname StyleDictionary
 * @example
 * ```js
 * const sd = require('browser-style-dictionary');
 * const StyleDictionary = await sd.extend('config.json');
 *
 * await StyleDictionary.buildAllPlatforms();
 * ```
 */
var StyleDictionary = {
  VERSION: require('./package.json').version,
  properties: {},
  allProperties: [],
  // Starting in v3 we are moving towards "tokens" rather than "properties"
  // keeping both for backwards compatibility
  tokens: {},
  allTokens: [],
  options: {},

  transform: require('./lib/common/transforms'),
  transformGroup: require('./lib/common/transformGroups'),
  format: require('./lib/common/formats'),

  action: require('./lib/common/actions'),
  formatHelpers: require('./lib/common/formatHelpers'),
  filter: {}, // we need to initialise the object, since we don't have built-in filters
  parsers: [], // ditto ^
  fileHeader: {},

  registerTransform: require('./lib/register/transform'),
  registerTransformGroup: require('./lib/register/transformGroup'),
  registerFormat: require('./lib/register/format'),
  // Commented out because our playground does not support registering custom templates with node API for now
  // registerTemplate: require('./lib/register/template'),
  registerAction: require('./lib/register/action'),
  registerFilter: require('./lib/register/filter'),
  registerParser: require('./lib/register/parser'),
  registerFileHeader: require('./lib/register/fileHeader'),

  exportPlatform: require('./lib/exportPlatform'),
  buildPlatform: require('./lib/buildPlatform'),
  buildAllPlatforms: require('./lib/buildAllPlatforms'),

  cleanPlatform: require('./lib/cleanPlatform'),
  cleanAllPlatforms: require('./lib/cleanAllPlatforms'),

  extend: require('./lib/extend')
};

module.exports = StyleDictionary;
