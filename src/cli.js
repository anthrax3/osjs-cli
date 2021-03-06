/*!
 * OS.js - JavaScript Cloud/Web Desktop Platform
 *
 * Copyright (c) 2011-2018, Anders Evenrud <andersevenrud@gmail.com>
 * All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions are met:
 *
 * 1. Redistributions of source code must retain the above copyright notice, this
 *    list of conditions and the following disclaimer
 * 2. Redistributions in binary form must reproduce the above copyright notice,
 *    this list of conditions and the following disclaimer in the documentation
 *    and/or other materials provided with the distribution
 *
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND
 * ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
 * WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
 * DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT OWNER OR CONTRIBUTORS BE LIABLE FOR
 * ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
 * (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
 * LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND
 * ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
 * (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
 * SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 *
 * @author  Anders Evenrud <andersevenrud@gmail.com>
 * @licence Simplified BSD License
 */

const path = require('path');
const utils = require('./utils.js');
const builder = require('./build.js')
const minimist = require('minimist');

const getPublicPath = options => path.resolve(options.root, 'dist');

const cli = async (argv, options) => {
  const args = minimist(argv);

  options = Object.assign({
    config: path.resolve(options.root, 'src/conf/webpack.config.js'),
    publicPath: getPublicPath(options),
    metaPath: path.resolve(getPublicPath(options), 'metadata.json')
  }, options);

  const pkgConfigurations = await utils.packages(options.packages, {
    publicPath: options.publicPath
  });

  const pkgManifests = await utils.manifests(options.packages);

  const configuration = require(options.config);
  const configurations = [configuration, ...pkgConfigurations];

  if (args.manifest) {
    console.log('Making manifest');
    builder.buildManifest(options.metaPath, pkgManifests);
  } else if (args.watch) {
    console.log('Watching');
    builder.watch(configurations);
  } else {
    console.log('Building'), configurations.join(', ');
    builder.build(configurations);
  }
};

module.exports = cli;
