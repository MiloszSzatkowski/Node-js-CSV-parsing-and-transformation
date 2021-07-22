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

var found = false;

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

const header = ["ID" ,	"Type" ,	"SKU"	, "Name" ,	"Radiator Only", "Regular price" ,	"Old Price" , "Difference" ,"Parent"];

function go_next() {
  fs.createReadStream('wc-product-export-22-7-2021-1626964647736 - wc-product-export-22-7-2021-1626964647736.csv')
    .pipe(csv())
    .on('data', (data) => results.push(data))
    .on('end', () => {
      for(let i = 0; i < results.length; i++){

        let sku = results[i].sku;

        let include = false;
        let listing_tab = false;
        let prime_sku_price = "";
        new_price = "";

        // START OF IF -> REVISE **********************************************************************************************************
        //check for the type of row

        if ( sku !== "" &&  (sku.includes("FC") || sku.includes("CC") ) && results[i].Type == "variation" &&
        !(sku.includes("CAPO")) && !(sku.includes("DIVA")) ) {

          //make prime sku
          let temp_sku = sku.split("-");
          let prime_sku = sku;
          let is_curved = false;
          include = true;

          // console.log(true);


          if (temp_sku.length > 2) {
            prime_sku =  `${temp_sku[0]}-${temp_sku[1]}` ;
          }

          if (sku.includes("CC")) {
            is_curved = true;
            prime_sku = prime_sku.replace("CC" , "FC");
          }

          for (let j = 0; j < new_price_array.length; j++) {
            if (prime_sku == new_price_array[j].sku) {
              found = true;
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

          // APPLY VAT !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
          // APPLY VAT !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!

          new_price = Math.floor((new_price - 5) / 1.2) + 0.49;

          // APPLY VAT !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
          // APPLY VAT !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!


          prime_sku_price = new_price;

          let valve_price = 8.30;
          let trv_valve_price = 22.50;
          let pfs_price = 25;
          let gt_price = pfs_price + 21.50;
          let moa_price = pfs_price + 35.50;
          let ktx3_price = pfs_price + 47.35;

          if (sku !== prime_sku ) {
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


        }

        // console.log(new_price);

        // END OF IF -> REVISE **********************************************************************************************************

        //PUSH ****************************************

        // const header = ["Action(SiteID=UK|Country=GB|Currency=GBP|Version=1111|CC=UTF-8)" ,	"ItemID",	"Title",	"SiteID",	"Currency",	"StartPrice",	"OldPrice", "Difference", "CustomLabel",	"Relationship",	"RelationshipDetails"];
        // const header = ["ID" ,	"Type" ,	"SKU"	, "Name" ,	"Regular price" ,	"Old Price" , "Difference" ,"Parent"];

        let diff = (new_price !== "") ? parseFloat(new_price - results[i].Regular_price) : "";

          if (include && found && diff > 0){
            filtered.push([
              results[i].ID,
              results[i].Type,
              results[i].sku,
              results[i].Name,
              prime_sku_price,
              new_price,
              results[i].Regular_price,
              diff,
              results[i].Parent
              ]);
          }


        //PUSH END ****************************************

    }

    console.log(filtered);
    console.log("Array length:");
    console.log(filtered.length);

      var csvFromArrayOfArrays = convertArrayToCSV(filtered, {
        header,
        separator: '$'
      });


      fs.writeFile('./New_Price_From_Ebay_To_Website.csv', csvFromArrayOfArrays, function (err) {
        if (err) return console.log(err);
      });


  });
}
