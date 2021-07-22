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

save_array_from_csv();

function save_array_from_csv () {
  fs.createReadStream('ebay OLD PRICES 22 07 2021 - Sheet1.csv')
    .pipe(csv())
    .on('data', (data) => results02.push(data))
    .on('end', () => {
      for(let i = 0; i < results02.length; i++){

          new_price_array.push(
            {
              sku: results02[i].sku,
              price: parseFloat(results02[i].new_price)
            }
          );

      }
      // console.log(new_price_array);

    go_next();
  });
}

const header = ["Action(SiteID=UK|Country=GB|Currency=GBP|Version=1111|CC=UTF-8)" ,	"ItemID",	"Title",	"SiteID",	"Currency",	"StartPrice",	"OldPrice", "Difference", "CustomLabel",	"Relationship",	"RelationshipDetails"];

function go_next() {
  fs.createReadStream('ebay OLD PRICES 22 07 2021 - FileExchange_Response_102232898.csv')
    .pipe(csv())
    .on('data', (data) => results.push(data))
    .on('end', () => {
      for(let i = 0; i < results.length; i++){

        let sku = results[i].CustomLabel;

        let include = false;
        let listing_tab = false;
        new_price = "";


        // START OF IF -> REVISE **********************************************************************************************************
        //check for the type of row
        if (results[i].Action !== "Revise" &&  results[i].sku !== "") {

          //make prime sku
          let temp_sku = sku.split("-");
          let prime_sku = sku;
          let is_curved = false;

          if (temp_sku.length > 2) {
            prime_sku =  `${temp_sku[0]}-${temp_sku[1]}` ;
          }

          if (sku.includes("CC")) {
            is_curved = true;
            prime_sku = prime_sku.replace("CC" , "FC");
          }


          for (let j = 0; j < new_price_array.length; j++) {
            if (prime_sku == new_price_array[j].sku) {
              new_price = new_price_array[j].price;
              if (is_curved) {
                new_price = new_price + 2;
              }
              break;
            }
          }

          // console.log(prime_sku);
          // console.log(new_price);
          // console.log("--");

          let valve_price = 10;
          let trv_valve_price = 28;
          let pfs_price = 30;
          let gt_price = 58;
          let moa_price = 73;
          let ktx3_price = 88;

          if (sku !== prime_sku) {
            if (sku.includes("-SV") || sku.includes("-AV")) {
              new_price = new_price + valve_price;
            } else if (sku.includes("-TRV")) {
              new_price = new_price + trv_valve_price;
            } else if (sku.includes("-PFS")) {
              new_price = new_price + pfs_price;
            } else if (sku.includes("-GT")) {
              new_price = new_price + gt_price;
            } else if (sku.includes("-MOA")) {
              new_price = new_price + moa_price;
            } else if (sku.includes("-KTX")) {
              new_price = new_price + ktx3_price;
            }
          } // is a variaton

          if ( !(sku.includes("-")) || sku.includes("FC65") || sku.includes("FC65") ||   sku.includes("FC20") || sku.includes("FC25") ||
               sku.includes("FC25") || sku.includes("FC130") || sku.includes("FC90-90")  || sku.includes("FC45-110")  ||    sku.includes("FC80-110")  ||
               sku.includes("FC100") ) {
                 new_price = results[i].StartPrice;
               } //omit old stock

        }

        // END OF IF -> REVISE **********************************************************************************************************

        //PUSH ****************************************

        // const header = ["Action(SiteID=UK|Country=GB|Currency=GBP|Version=1111|CC=UTF-8)" ,	"ItemID",	"Title",	"SiteID",	"Currency",	"StartPrice",	"OldPrice", "Difference", "CustomLabel",	"Relationship",	"RelationshipDetails"];

        let diff = (new_price !== "") ? parseFloat(new_price - results[i].StartPrice) : "";

          if (true){
            filtered.push([
              results[i].Action,
              results[i].ItemID,
              results[i].Title,
              results[i].SiteID,
              results[i].Currency,
              new_price,
              results[i].StartPrice,
              diff,
              results[i].CustomLabel,
              results[i].Relationship,
              results[i].RelationshipDetails
              ]);
          }

          console.log(filtered[i]);

        //PUSH END ****************************************

    }

    console.log("Array length:");
    console.log(filtered.length);

      var csvFromArrayOfArrays = convertArrayToCSV(filtered, {
        header,
        separator: '$'
      });


      fs.writeFile('./New_Price_Ebay.csv', csvFromArrayOfArrays, function (err) {
        if (err) return console.log(err);
      });


  });
}
