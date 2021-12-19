const UglifyJS = require('uglify-js');
const fs = require('fs');

const paginationSourceCode = fs.readFileSync('lib/shadow-pagination/shadow-pagination.js', 'utf8');
const pagination = UglifyJS.minify(paginationSourceCode, {});

fs.writeFile('lib/shadow-pagination/shadow-pagination.min.js', pagination.code, (err) => {
  if (err) {
    console.error(err);
  } else {
    console.log('File was successfully saved.');
  }
});
