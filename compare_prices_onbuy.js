const csv = require('csv-parser')
var fs = require('fs');
var util = require('util');

const { convertArrayToCSV } = require('convert-array-to-csv');
const converter = require('convert-array-to-csv');

const results = [];

var filtered = [];
var filtered02 = [];

var new_price = "";

var counter = 0;

var black_sku;

go_first() ;

function go_first() {
  fs.createReadStream('Onbuy Amazon price update 25 01 2022 - Prices comparision.csv')
    .pipe(csv())
    .on('data', (data) => filtered02.push(data))
    .on('end', () => { go_next(); } )
}


const header = ["old sku", "new sku", "price current", "price new", "difference", "is different"]

function go_next() {
  fs.createReadStream('price-and-stock-export-2022-03-09-15-05-50.csv')
    .pipe(csv())
    .on('data', (data) => results.push(data))
    .on('end', () => {

      for(let i = 0; i < results.length; i++){

        let old_sku = "";
        let new_sku = "";
        let price_current = "";
        let price_new = "";
        let diff = "";
        let is_different = false;

        for (var j = 0; j < filtered02.length; j++) {
          if (filtered02[j].SKU == results[i].sku ) {
            old_sku = results[i].sku;
            new_sku = filtered02[j].SKU;
            price_current = results[i].price,
            price_new = filtered02[j].Price;
            diff = parseFloat(price_new) - parseFloat(price_current) ;
            is_different = (price_current !== price_new) ? true : false;
          }
        }



        filtered.push([
          old_sku,
          new_sku,
          price_current,
          price_new,
          diff,
          is_different
        ]);


        //PUSH END ****************************************
    }

    console.log(filtered);

      var csvFromArrayOfArrays = convertArrayToCSV(filtered, {
        header
      });


      fs.writeFile('./Price_compare_onbuy_REST.csv', csvFromArrayOfArrays, function (err) {
        if (err) return console.log(err);
      });


  });
}
