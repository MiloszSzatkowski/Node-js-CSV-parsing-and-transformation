const csv = require('csv-parser')
var fs = require('fs');
var util = require('util');

const { convertArrayToCSV } = require('convert-array-to-csv');
const converter = require('convert-array-to-csv');


var results = [];

var filtered_with_prices = [];

var filtered_compare_prices = [];

go_next();

// const header = ["ID","Name","Description","Parent","SKU"];
const header = ["HELP_TITLE",	"SKU",	"MANUFACTORY_PRICE",	"QUANTITY"];

function go_next() {
  fs.createReadStream('MANUFACTORY PRICES - download Selro date 07 06 2021.csv')
    .pipe(csv())
    .on('data', (data) => results.push(data))
    .on('end', () => {
      for(let i = 0; i < results.length; i++){

        filtered_with_prices.push([
          results[i].sku,
          results[i].qty
        ]);

      }

      // console.log(filtered_with_prices[519][0]);
      // console.log(filtered_with_prices[519][1]);


      chain();

  });
}


function look_for_price(sku) {
  for (let i = 0; i < filtered_with_prices.length; i++) {
    if (filtered_with_prices[i][0] == sku) {
      let prr = filtered_with_prices[i][1].replace("£","");
      return prr;
    }
  }
}

function look_for_quantity(sku) {
  for (let i = 0; i < filtered_with_prices.length; i++) {
    if (filtered_with_prices[i][0] == sku) {
      let prr = filtered_with_prices[i][1];
      return prr;
    }
  }
}

function chain() {
  results = [];
  fs.createReadStream('MANUFACTORY PRICES - MANUFACTORY PRICES.csv')
    .pipe(csv())
    .on('data', (data) => results.push(data))
    .on('end', () => {
      // console.log(results);
      for(let i = 0; i < results.length; i++){

        // console.log(results[i].SKU);
        var qnt = look_for_quantity(results[i].SKU);

        filtered_compare_prices.push([
          results[i].HELP_TITLE,
          results[i].SKU,
          results[i].MANUFACTORY_PRICE,
          qnt
        ]);

        // console.log(filtered_compare_prices[i]);

      }
      var csvFromArrayOfArrays = convertArrayToCSV(filtered_compare_prices, {
        header,
        separator: '$'
      });

      fs.writeFile('./with_new_prices.csv', csvFromArrayOfArrays, function (err) {
        if (err) return console.log(err);
      });

  });
}
