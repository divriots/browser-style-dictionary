/*
 * Copyright 2017 Amazon.com, Inc. or its affiliates. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License"). You may not use this file except in compliance with
 * the License. A copy of the License is located at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * or in the "license" file accompanying this file. This file is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR
 * CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions
 * and limitations under the License.
 */

/**
 * Style Dictionary module
 *
 * @module style-dictionary
 * @typicalname StyleDictionary
 * @example
 * ```js
 * const StyleDictionary = require('style-dictionary').extend('config.json');
 *
 * StyleDictionary.buildAllPlatforms();
 * ```
 */
var StyleDictionary = {
  VERSION: require("./package.json").version,
  properties: {},
  allProperties: [],
  // Starting in v3 we are moving towards "tokens" rather than "properties"
  // keeping both for backwards compatibility
  tokens: {},
  allTokens: [],
  options: {},

  transform: require("./lib/common/transforms"),
  transformGroup: require("./lib/common/transformGroups"),
  format: require("./lib/common/formats"),

  // Commented out because our playground does not support uploading & copying assets for now
  // action: require("./lib/common/actions"),
  formatHelpers: require("./lib/common/formatHelpers"),
  filter: {}, // we need to initialise the object, since we don't have built-in filters
  parsers: [], // ditto ^
  fileHeader: {},

  registerTransform: require("./lib/register/transform"),
  registerTransformGroup: require("./lib/register/transformGroup"),
  registerFormat: require("./lib/register/format"),
  // Commented out because our playground does not support registering custom templates with node API for now
  // registerTemplate: require("./lib/register/template"),
  registerAction: require("./lib/register/action"),
  registerFilter: require("./lib/register/filter"),
  registerParser: require("./lib/register/parser"),
  registerFileHeader: require("./lib/register/fileHeader"),

  exportPlatform: require("./lib/exportPlatform"),
  buildPlatform: require("./lib/buildPlatform"),
  buildAllPlatforms: require("./lib/buildAllPlatforms"),

  // Commented out below, we have our own cleanup for output dirs from platforms for now
  // cleanPlatform: require("./lib/cleanPlatform"),
  // cleanAllPlatforms: require("./lib/cleanAllPlatforms"),

  extend: require("./lib/extend"),
};

module.exports = StyleDictionary;
