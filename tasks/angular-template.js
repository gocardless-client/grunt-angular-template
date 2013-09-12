'use strict';

var generateAngularTemplate = require('generate-angular-template');

// Adds html tempalate in $templateCache and writes file to destFile
//
// $templateCache key is the filepath passed in as srcFile:
//   options.prependPrefix + options.srcFile.replace(stripPrefix, '')
//
// grunt.initConfig({
//   ngtemplatecache: {
//     app: {
//       options: {
//         stripPrefix: ''
//         prependPrefix: '',
//         cacheIdFromPath: function(filepath) {
//           // gets set as $tempalteCache key
//           return filepath;
//         }
//       },
//       files: {
//         destFile: srcFile
//       }
//     }
//   }
// });

module.exports = function(grunt) {
  grunt.task.registerMultiTask('ngtemplatecache',
    'Put angular templates in $templateCache.', function() {

    var options = this.options({
      prependPrefix: '',
      stripPrefix: ''
    });

    var stripPrefix = new RegExp('^' + options.stripPrefix);
    var prependPrefix = options.prependPrefix;
    var cacheIdFromPath = options.cacheIdFromPath ||function (filepath) {
      return prependPrefix + filepath.replace(stripPrefix, '');
    };

    this.files.map(function(el) {
      var filepath = el.src[0];
      var htmlPath = cacheIdFromPath(filepath);
      var content = grunt.file.read(filepath);
      var template = generateAngularTemplate({
        moduleName: options.moduleName,
        htmlPath: htmlPath,
        content: content
      });

      grunt.file.write(el.dest, template);
    });

  });
};
