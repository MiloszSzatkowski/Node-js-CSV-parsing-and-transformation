const csv = require('csv-parser')
var fs = require('fs');
var util = require('util');

const { convertArrayToCSV } = require('convert-array-to-csv');
const converter = require('convert-array-to-csv');

const results = [];

const results_myhomeware = [];

var filtered = [];

var new_price_array = [];

var new_price = "";

var counter = 0;

var black_sku;


// const header = ["Action(SiteID=UK|Country=GB|Currency=GBP|Version=1111|CC=UTF-8)" ,	"ItemID",	"Title",	"SiteID",	"Currency",	"StartPrice",	"OldPrice", "Difference", "CustomLabel",	"Relationship",	"RelationshipDetails"];
const header = ["Action" , 	"Item number"	, "Title", 	"Listing site", 	"Currency", "Start price",	"Old price", "Difference"	,"Buy It Now price"	, "Available quantity", 	"Relationship", 	"Relationship details", 	"Custom label (SKU)", "Not on MH Ebay", "MH sku"];
// Action	Item number	Title	Listing site	Currency	Start price	Buy It Now price	Custom label (SKU)	Available quantity	Relationship	Relationship details
function local_grab_sku_and_price(looking_for_sku) {
  for (var j = 0; j < price_rise_array.length; j++) {
    if (price_rise_array[j].SKU == looking_for_sku) {
      let _prices =  {new_price: price_rise_array[j].New_price, old_price_with_radiator: price_rise_array[j].Old_price_with_radiator};
      return _prices;
    } else if ((price_rise_array[j].SKU + "10mm-15mm") == looking_for_sku) {
      let _prices =  {new_price: parseFloat(price_rise_array[j].New_price) + 2, old_price_with_radiator: price_rise_array[j].Old_price_with_radiator};
      return _prices;
    }
  }
  return false;
}

go_mh();

function go_mh() {
  fs.createReadStream('New Prices 08 10 2021 - all prices Ebay.csv')
    .pipe(csv())
    .on('data', (data) => results_myhomeware.push(data))
    .on('end', () => {

      // console.log(results_myhomeware);

      go_next();
  });
}

function go_next() {
  fs.createReadStream('New Prices 08 10 2021 - bathroom wisdom.csv')
    .pipe(csv())
    .on('data', (data) => results.push(data))
    .on('end', () => {
      for(let i = 0; i < results.length; i++){

        let sku = results[i].Custom_label_SKU;
        // console.log(sku);

        let include = false;
        let listing_tab = false;
        let found = false;
        let MH_SKU = "";
        new_price = "";

        let old_price = parseFloat(results[i].Start_price);

        for (var pp = 0; pp < results_myhomeware.length; pp++) {
          if (results_myhomeware[pp].SKU == results[i].Custom_label_SKU) {
            MH_SKU = results_myhomeware[pp].SKU;
            new_price = results_myhomeware[pp].PRICE;
            found = true;
          }
        }

        // END OF IF -> REVISE **********************************************************************************************************

        let diff = "";
        if (new_price == "" && results[i].Start_price !== "") {
          new_price = results[i].Start_price;
        }
        if (!results[i].Start_price == "" && !new_price == "") {
          diff = new_price - results[i].Start_price;
        }

          if (true){
            filtered.push([
              results[i].Action,
              results[i].Item_number,
              results[i].Title,
              results[i].Listing_site,
              results[i].Currency,
              new_price,
              results[i].Start_price,
              diff,
              results[i].Buy_It_Now_price,
              results[i].Available_quantity,
              results[i].Relationship,
              results[i].Relationship_details,
              results[i].Custom_label_SKU,
              found,
              MH_SKU
              ]);
          }

          // if (results[i].Start_price == "") {
          //   console.log(filtered[i]);
          // }

        //PUSH END ****************************************

    }

    console.log("Array length:");
    console.log(filtered.length);

      var csvFromArrayOfArrays = convertArrayToCSV(filtered, {
        header,
        separator: '$'
      });


      fs.writeFile('./New_price_BW_ebay_08102021.csv', csvFromArrayOfArrays, function (err) {
        if (err) return console.log(err);
      });


  });
}
