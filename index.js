class IncRequireEnsurePlugin {
  apply (compiler) {
    compiler.plugin('compilation', function (compilation) {
      compilation.mainTemplate.plugin('require-ensure', function (source, chunk, hash) {
        var chunkFilename = this.outputOptions.chunkFilename
        var chunkMaps = chunk.getChunkMaps()
        return this.asString([
          'if(installedChunks[chunkId] === 0)',
          this.indent([
            'return Promise.resolve();'
          ]),
          '',
          '// a Promise means \'currently loading\'.',
          'if(installedChunks[chunkId]) {',
          this.indent([
            'return installedChunks[chunkId][2];'
          ]),
          '}',
          '// start chunk loading',
          'window.inc.add("chunk:" + chunkId, {',
          this.indent([
            'path: ' + this.requireFn + '.p + ' +
              this.applyPluginsWaterfall('asset-path', JSON.stringify(chunkFilename), {
                hash: '" + ' + this.renderCurrentHashCode(hash) + ' + "',
                hashWithLength: function (length) {
                  return '" + ' + this.renderCurrentHashCode(hash, length) + ' + "';
                }.bind(this),
                chunk: {
                  id: '" + chunkId + "',
                  hash: '" + ' + JSON.stringify(chunkMaps.hash) + '[chunkId] + "',
                  hashWithLength: function (length) {
                    var shortChunkHashMap = {}
                    Object.keys(chunkMaps.hash).forEach(function (chunkId) {
                      if (typeof chunkMaps.hash[chunkId] === 'string') {
                        shortChunkHashMap[chunkId] = chunkMaps.hash[chunkId].substr(0, length)
                      }
                    })
                    return '" + ' + JSON.stringify(shortChunkHashMap) + '[chunkId] + "'
                  },
                  name: '" + (' + JSON.stringify(chunkMaps.name) + '[chunkId]||chunkId) + "'
                }
              }) + ',',
            'type: "js",',
            'version: ' + JSON.stringify(chunkMaps.hash) + '[chunkId]'
          ]),
          '});',
          'var promise = new Promise(function(resolve, reject) {',
          this.indent([
            'installedChunks[chunkId] = [resolve, reject];'
          ]),
          '});',
          'installedChunks[chunkId][2] = promise;',
          '',
          'window.inc.use("chunk:" + chunkId, function() {',
          this.indent([
            'var chunk = installedChunks[chunkId];',
            'if(chunk !== 0) {',
            this.indent([
              'if(chunk) chunk[1](new Error("Loading chunk " + chunkId + " failed."));',
              'installedChunks[chunkId] = undefined;'
            ]),
            '}'
          ]),
          '})',
          'return promise;'
        ])
      })
    })
  }
}

module.exports = IncRequireEnsurePlugin
