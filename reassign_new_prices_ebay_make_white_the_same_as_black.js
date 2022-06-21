const csv = require('csv-parser')
var fs = require('fs');
var util = require('util');

const { convertArrayToCSV } = require('convert-array-to-csv');
const converter = require('convert-array-to-csv');

const results = [];

const black_prices_eBay = [];

var filtered = [];

var new_price_array_eBay = [];

var new_price = "";

var old_sku = "";

var counter = 0;

var black_sku;


save_array_from_csv();

function save_array_from_csv () {
  fs.createReadStream('compilation sku black eBay prices - dewabit_variations_254150350225 FB30 CH.csv')
    .pipe(csv())
    .on('data', (data) => black_prices_eBay.push(data))
    .on('end', () => {
      for(let i = 0; i < black_prices_eBay.length; i++){

          new_price_array_eBay.push(
            {
              sku: black_prices_eBay[i].SKU,
              price: parseFloat(black_prices_eBay[i].Price)
            }
          );

      }
      // console.log(new_price_array_eBay);

    go_next();
  });
}

// const header = ["Action(SiteID=UK|Country=GB|Currency=GBP|Version=1111|CC=UTF-8)" ,	"ItemID",	"Title",	"SiteID",	"Currency",	"StartPrice",	"OldPrice", "Difference", "CustomLabel",	"Relationship",	"RelationshipDetails"];
// const header = ["Action" , 	"Item number"	, "Title", 	"Listing site", 	"Currency", "Start price",	"Old price", "Difference"	,"Buy It Now price"	, "Available quantity", 	"Relationship", 	"Relationship details", 	"Custom label (SKU)"];
const header = ["SKU", "OLD SKU", "PRICE", "DIFFERENCE"];

// Action	Item number	Title	Listing site	Currency	Start price	Buy It Now price	Custom label (SKU)	Available quantity	Relationship	Relationship details
function modulateSKU (black_sku) {
  let modulated_sku_string = black_sku.  replace("FB","FW");

  if        ( black_sku.includes ("KTX") ) {
    modulated_sku_string = modulated_sku_string.replace("BKTX", "WKTX");
  } else if ( black_sku.includes ("GT") ) {
    modulated_sku_string = modulated_sku_string.replace("BGT", "WGT");
  } else if ( black_sku.includes ("MOA") ) {
    modulated_sku_string = modulated_sku_string.replace("BMOA", "WMOA");
  } else if ( black_sku.includes ("BSV") ) {
    modulated_sku_string = modulated_sku_string.replace("BSV", "WSV");
  } else if ( black_sku.includes ("BAV") ) {
    modulated_sku_string = modulated_sku_string.replace("BAV", "WAV");
  }

  // console.log(modulated_sku_string);

  return modulated_sku_string;
}


function go_next() {
  fs.createReadStream('COMPILATION OLD sku white eBay price - dewabit_variations_255501155685 FW30 CH (1).csv')
    .pipe(csv())
    .on('data', (data) => results.push(data))
    .on('end', () => {
      for(let i = 0; i < results.length; i++){

        let sku = results[i].SKU;

        new_price = "";
        old_sku = "";

        for (let jj = 0; jj < new_price_array_eBay.length; jj++) {
          if (modulateSKU(new_price_array_eBay[jj].sku) == sku) {
            old_sku = new_price_array_eBay[jj].sku;
            new_price = new_price_array_eBay[jj].price;
            break;
          }
        }

        let diff = (new_price !== "") ? parseFloat(new_price - results[i].Price) : "";

          if (true){
            filtered.push([
              sku,
              old_sku,
              new_price,
              diff
              ]);
          }

          console.log(filtered[i]);

        //PUSH END ****************************************

    }

    console.log("Array length:");
    console.log(filtered.length);

      var csvFromArrayOfArrays = convertArrayToCSV(filtered, {
        header
      });


      fs.writeFile('./Price_Update_CSV_20062022_02.csv', csvFromArrayOfArrays, function (err) {
        if (err) return console.log(err);
      });


  });
}
