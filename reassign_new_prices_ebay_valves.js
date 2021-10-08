var price_rise_array = [{
	SKU: "CORNERV-BLACK",
	New_price: "32.99",
	Old_price_with_radiator: "0"
}, {
	SKU: "CORNERV-WHITE",
	New_price: "32.99",
	Old_price_with_radiator: "0"
}, {
	SKU: "TRVAV",
	New_price: "32.99",
	Old_price_with_radiator: "28"
}, {
	SKU: "TRVSV",
	New_price: "32.99",
	Old_price_with_radiator: "28"
}, {
	SKU: "TRVBAV",
	New_price: "32.99",
	Old_price_with_radiator: "28"
}, {
	SKU: "TRVBSV",
	New_price: "32.99",
	Old_price_with_radiator: "28"
}, {
	SKU: "TRVWAV",
	New_price: "32.99",
	Old_price_with_radiator: "28"
}, {
	SKU: "TRVWSV",
	New_price: "32.99",
	Old_price_with_radiator: "28"
}, {
	SKU: "ANT-AV",
	New_price: "22.49",
	Old_price_with_radiator: "18"
}, {
	SKU: "ANT-SV",
	New_price: "22.49",
	Old_price_with_radiator: "18"
}, {
	SKU: "SV",
	New_price: "15.49",
	Old_price_with_radiator: "10"
}, {
	SKU: "AV",
	New_price: "15.49",
	Old_price_with_radiator: "10"
}, {
	SKU: "WAV",
	New_price: "22.49",
	Old_price_with_radiator: "12"
}, {
	SKU: "WSV",
	New_price: "22.49",
	Old_price_with_radiator: "12"
}];

const csv = require('csv-parser')
var fs = require('fs');
var util = require('util');

const { convertArrayToCSV } = require('convert-array-to-csv');
const converter = require('convert-array-to-csv');

const results = [];

const results02 = [];

var filtered = [];

var new_price_array = [];

var new_price = "";

var counter = 0;

var black_sku;


// const header = ["Action(SiteID=UK|Country=GB|Currency=GBP|Version=1111|CC=UTF-8)" ,	"ItemID",	"Title",	"SiteID",	"Currency",	"StartPrice",	"OldPrice", "Difference", "CustomLabel",	"Relationship",	"RelationshipDetails"];
const header = ["Action" , 	"Item number"	, "Title", 	"Listing site", 	"Currency", "Start price",	"Old price", "Difference"	,"Buy It Now price"	, "Available quantity", 	"Relationship", 	"Relationship details", 	"Custom label (SKU)"];
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

go_next();

function go_next() {
  fs.createReadStream('071020021mh.csv')
    .pipe(csv())
    .on('data', (data) => results.push(data))
    .on('end', () => {
      for(let i = 0; i < results.length; i++){

        let sku = results[i].Custom_label_SKU;
        // console.log(sku);

        let include = false;
        let listing_tab = false;
        new_price = "";

        let old_price = parseFloat(results[i].Start_price);
        let price_rise = 2;
        var has_forbidden_sku = sku.includes("SYDNEY") || sku.includes("EVERLY") ;

        // START OF IF -> REVISE **********************************************************************************************************
        //check for the type of row
        if ( sku !== "") {

          // Action,Item_number,Title,Listing_site,Currency,Start_price,Buy_It_Now price,Custom_label_SKU,Available_quantity,Relationship,Relationship_details

          let table_price;

          if (local_grab_sku_and_price(sku)) {
            table_price = local_grab_sku_and_price(sku);
            new_price = parseFloat(table_price.new_price);
            // console.log(new_price - old_price);
          } else {
            new_price = old_price + price_rise;
          }

        }

        // END OF IF -> REVISE **********************************************************************************************************

        let diff = "";
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
              results[i].Custom_label_SKU
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


      fs.writeFile('./New_price_ebay_07102021.csv', csvFromArrayOfArrays, function (err) {
        if (err) return console.log(err);
      });


  });
}
