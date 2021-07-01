const csv = require('csv-parser')
var fs = require('fs');
var util = require('util');

const { convertArrayToCSV } = require('convert-array-to-csv');
const converter = require('convert-array-to-csv');

const saved_array = [];
const results = [];

var filtered = [];
var myhomeware_prices = [];

var new_price = "";

var counter = 0;

var black_sku;

function calculate_price_without_VAT (price_with_VAT) {
  return ( Math.round((price_with_VAT / 1.2) * 100) / 100 );
}

save_MH();

function save_MH() {
  fs.createReadStream('website price update 01 07 2021 - after update.csv')
    .pipe(csv())
    .on('data', (data) => myhomeware_prices.push(data))
    .on('end', () => {
      go_next();
      console.log(myhomeware_prices);
  });
}

const header = ["ID","Type","Name","Parent", "SKU", '"Regular price"', "Price before"];

function go_next() {
  fs.createReadStream('bw export.csv')
    .pipe(csv())
    .on('data', (data) => results.push(data))
    .on('end', () => {
      for(let i = 0; i < results.length; i++){

        let sku = results[i].SKU;
        let title = results[i].Name;

        let include = false;
        new_price = "";

        // START OF IF -> REVISE **********************************************************************************************************
        //check for the type of row
        if ( results[i].Type == "variation" ) {
          if ( sku.includes("TER") || sku.includes("0-V") || sku.includes("SYDNEY") ||  sku.includes("BRC") || sku.includes("MYRA") || sku.includes("AIR")
              || sku.includes("0-WH") || sku.includes("0-BL")  || sku.includes("0-CH") || (sku == undefined) ||   sku.includes("-T-") || sku.includes("STND")) {
            //skip
          } else {
            //include
            // console.log(myhomeware_prices);
            for (let j = 0; j < myhomeware_prices.length; j++) {
              if (myhomeware_prices[j].SKU == sku) {
                new_price = parseFloat(myhomeware_prices[j].Regular_price);
                include = true;
                break;
              }
            }

          }
        }
        // END OF IF -> REVISE **********************************************************************************************************

        let id = Object.values(results[i])[0];

          if (include){

            filtered.push([
              id,
              results[i].Type,
              results[i].Name,
              results[i].Parent,
              results[i].SKU,
              new_price,
              results[i].Regular_price
            ]);

          }

        //PUSH END ****************************************

    }

    console.log("__");
    console.log("Array length:");
    console.log(filtered.length);

      var csvFromArrayOfArrays = convertArrayToCSV(filtered, {
        header,
        separator: '$'
      });


      fs.writeFile('./Transfer_from_MH_to_BW.csv', csvFromArrayOfArrays, function (err) {
        if (err) return console.log(err);
      });


  });
}
