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

// save_MH_to_array();

function save_MH_to_array() {
  fs.createReadStream('ebay amazon prices update 22 06 2021 - Get it ready for Change - Myhomeware - lookup for website.csv')
    .pipe(csv())
    .on('data', (data) => saved_array.push(data))
    .on('end', () => {

      let price_factor = 7;


      for(let i = 0; i < saved_array.length; i++){

        // console.log(saved_array[i]);
        //PUSH ****************************************

          if (saved_array[i].StartPrice != ""){
            myhomeware_prices.push([
              { sku: saved_array[i].CustomLabel,
                ebay_price: saved_array[i].StartPrice,
                website_price_no_vat: (calculate_price_without_VAT((parseFloat(saved_array[i].StartPrice) - price_factor))),
                website_price_with_vat: (parseFloat(saved_array[i].StartPrice) - price_factor)
              }
            ]);
          }

          console.log("");
          console.log(saved_array[i].CustomLabel);
          console.log(saved_array[i].StartPrice);
          console.log((parseFloat(saved_array[i].StartPrice) - price_factor));
          console.log((calculate_price_without_VAT((parseFloat(saved_array[i].StartPrice) - price_factor))));

        //PUSH END ****************************************
    }

  });
  // go_next();
}

go_next();

const header = ["ID","Type","SKU","Name","Parent", '"Regular price"', "Old_Black_Price", "Old_Black_SKU", "Difference", "FULL_OBJ"];

function go_next() {
  fs.createReadStream('wc-product-export-22-6-2021-1624375892944.csv')
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
        if (results[i].Type == "variable" ) {
          //it's a listing tab - DONT INCLUDE
          if ( results[i].Name.includes("Anthracite") ||  results[i].Name.includes("Antracite")) {
            //collect all data

            include = false;

          }
        } else if ( sku != ""  ) {
          //it's a row with a product
          if (sku.includes("FC") || sku.includes("CC") || sku.includes("MYRA") || sku.includes("CB") || sku.includes("DIVA") ||
               sku.includes("FW")|| sku.includes("VALV") || sku.includes("TER") || sku.includes("EVER") || sku.includes("MEG") || sku.includes("CAPO") ||
               sku.includes("0-V") || sku.includes("AMEL") || sku.includes("BRC") || sku.includes("PLUG") || sku.includes("SYDNEY") || sku.includes("ALMILA")  ||
               title.includes("Brackets")   ) {
                  //DONT DO ANYTHING - SKIP - we filter unwanted SKUs
          } else {
                 // DO SOMETHING !!
                 //find new price if it's ant
                 if (sku.includes("ANT")) {
                   black_sku = sku.replace("ANT-SV", "BSV");
                   black_sku = black_sku.replace("ANT-AV", "BAV");
                   black_sku = black_sku.replace("ANT", "FB");

                   //DEV CHECK
                   counter++;
                   // console.log(black_sku);
                   // console.log(counter);

                   for (var j = 0; j < results.length; j++) {
                     if (results[j].SKU == black_sku) {
                       new_price = results[j].Regular_price;
                       include = true;
                       break;
                     }
                   }
                   if (!include) {
                     console.log("COULD NOT FIND " + black_sku);
                   }
                 }
          }
        }
        // END OF IF -> REVISE **********************************************************************************************************

        //PUSH ****************************************

        // console.log(Object.values(results[i])[0]);

        let id = Object.values(results[i])[0];

          if (include){
            filtered.push([
              id,
              results[i].Type,
              results[i].SKU,
              results[i].Name,
              results[i].Parent,
              // results[i].Regular_price,
              new_price,
              results[i].Regular_price + "___OLD_ANT_PRICE",
              black_sku,
              (Math.round((results[i].Regular_price - new_price) * 100) / 100),
              (Object.values(results[i]))
            ]);
          }

        //PUSH END ****************************************

    }

    console.log(filtered.length);

      var csvFromArrayOfArrays = convertArrayToCSV(filtered, {
        header,
        separator: '$'
      });


      fs.writeFile('./New_Price_Update_Competion.csv', csvFromArrayOfArrays, function (err) {
        if (err) return console.log(err);
      });


  });
}
