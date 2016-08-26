# Webriq Roots Sitemap Generator



## Installation

*  make sure you're in your roots project directory
*  `npm install webriq-roots-sitemap-v2 --save`
*  modify your `app.coffee` file to include the extension


   ```coffee
   roots_webriq_sitemap = require 'webriq-roots-sitemap-v2'

   module.exports =
     extensions: [roots_webriq_sitemap(options)]
   ```
## Example

  ````
  roots_webriq_sitemap (
    url: "https://samplesite.com",
    directory: ["!admin", "!node_modules"],
    file: "**/*.html"
  )
  ````

  make sure to put this on last part of all extension's list.


## Options

* url - website url
* directory - filter your directory either to include or exclude the directory from scanning just add `!`
* file - filter your file
