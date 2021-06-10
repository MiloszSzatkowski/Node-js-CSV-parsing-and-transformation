const csv = require('csv-parser')
var fs = require('fs');
var util = require('util');

const { convertArrayToCSV } = require('convert-array-to-csv');
const converter = require('convert-array-to-csv');


const results = [];

var filtered = [];

var new_prices = [];

go_next();

// const header = ["ID","Name","Description","Parent","SKU"];
const header = ["sku","qty","title"];

function go_next() {
  fs.createReadStream('d new.csv')
    .pipe(csv())
    .on('data', (data) => results.push(data))
    .on('end', () => {
      for(let i = 0; i < results.length; i++){

      var title = "";

      var include_bool = true;
      // if ( _includes(       ["PFT", "PFS", "0-T", "0-S", "0-B", "0-A", "0-A"]      ,              ) ) {
      if (results[i].sku.match(/(200-|300-|250-|350-|450-|500-|550-|600-|650-|700-|750-|800-|850-|900-|1000-|950-|1100-|1300-|VALV)/g) &&
        !(results[i].sku.match(/(GT|TER|MOA|STND)/g) )

     ){
        console.log(results[i].sku);
        include_bool = false;
      }

        if(   include_bool    ){

            filtered.push([
              results[i].sku,
              results[i].qty,
              results[i].title,
            ]);

        }
      }
      var csvFromArrayOfArrays = convertArrayToCSV(filtered, {
        header,
        separator: '$'
      });

      fs.writeFile('./clean_csv.csv', csvFromArrayOfArrays, function (err) {
        if (err) return console.log(err);
      });

  });
}
