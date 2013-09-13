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
      separator: grunt.util.linefeed,
      prependPrefix: '',
      stripPrefix: ''
    });

    var stripPrefix = new RegExp('^' + options.stripPrefix);
    var prependPrefix = options.prependPrefix;
    var cacheIdFromPath = options.cacheIdFromPath ||function (filepath) {
      return prependPrefix + filepath.replace(stripPrefix, '');
    };

    this.files.forEach(function(file) {
      var src = file.src.filter(function(filepath) {
        if (!grunt.file.exists(filepath)) {
          grunt.log.warn('Source file "' + filepath + '" not found.');
          return false;
        } else {
          return true;
        }
      }).map(function(filepath) {
        var htmlPath = cacheIdFromPath(filepath);
        var content = grunt.file.read(filepath);
        var template = generateAngularTemplate({
          moduleName: options.moduleName,
          htmlPath: htmlPath,
          content: content
        });

        return template;
      }).join(options.separator);

      // Write the destination file.
      grunt.file.write(file.dest, src);

      // Print a success message.
      grunt.log.writeln('Template "' + file.dest + '" created.');
    });

  });
};
