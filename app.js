
  var _, W, node, fs, moment, path, readdirp, util, readDir, es, readdir;

  fs        = require('fs');
  path      = require('path');
  readdirp  = require('readdirp');
  _         = require('lodash');
  util      = require('util');
  moment    = require('moment');
  W         = require('when');
  node      = require('when/node');
  es        = require('event-stream');
  readdir   = require("readdir-plus");



  module.exports = function(opts) {
    var WebriqExtension, directory, file, folder, helperName, url;
    opts || (opts = {});
    folder = opts.folder || path.join(__dirname); // directory folder to scan
    url = opts.url || "https://sample.com"; // website url to use in sitemap
    directory = opts.directory || "!node_modules"; // excluded directory
    file = opts.file || "**/*.html"; // file filter, find all html files in the directory
    helperName = opts.name || folder;

    return WebriqExtension = (function() {


      function WebriqExtension() {
        var result, roots;

        roots = this;
        result = ''

        this.writing = function (err) {
          if (err){
            return roots.callError(err);
          }
        }


      setTimeout(function(){ // This will execute 6s after all file compiled to make sure that the public folder is already present.

        roots.readdirp({
        root: folder,
        fileFilter: file,
        directoryFilter: directory
        })
        .on('data', function(entry){


          var str, url_path, url_file, buf;

          buf = new Buffer(1024);

          url_path = entry.path;
          str = roots.replace(url_path);
          url_file = str.substr(6);

          result += "\n<url><loc>" + url + url_file + "</loc></url>";

          roots.stat('./public/sitemap.xml', function(err, stat){
            if(err == null){
              //console.log('File exists');

              roots.open('./public/sitemap.xml', 'r+', function(err, fd){
                 if (err){
                    return roots.callError('Error Openning File', err);
                  }
                  roots.read(fd, buf, 0, buf.length, 0, function(err, bytes){
                    if (err){
                      return roots.callError('Error Reading', err);
                    }
                    else{
                      roots.writeFile('./public/sitemap.xml', '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">' + result + '\n</urlset>' , 'UTF-8', roots.writing);
                    }

                  }) // end roots.read

              });

            }
            else if(err.code == 'ENOENT') {

              roots.writeFile('./public/sitemap.xml', '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">' + result + '\n</urlset>' , 'UTF-8', roots.writing);

            }
            else {
              roots.callError('Some other error: ', err.code);
            }


          }) // end stat


        })


      }, 6000);



      } // end of WebriqExtension

      WebriqExtension.prototype.readdirp = function(source, file, directory) {
        return readdirp(source, file , directory);
      }


      WebriqExtension.prototype.read = function(fd, buffer, offset, length, position, callback) {
        fs.read(fd, buffer, offset, length, position, callback)
      }

      WebriqExtension.prototype.open = function(path, flags, callback) {
        fs.open(path, flags, callback)
      }

      WebriqExtension.prototype.replace = function(pathurl) {
        return pathurl.replace(/\\/g, "/");
      };

      WebriqExtension.prototype.callError = function(element) {
        return console.log('Error has been found', element);
      };


      WebriqExtension.prototype.writeFile = function(source, data, type, callback) {

        return fs.writeFile(source, data, 'UTF-8', this.writing);

      };

      WebriqExtension.prototype.stat = function(file, callback) {
        fs.stat(file, callback);
      };


      return WebriqExtension
    })();
  };
