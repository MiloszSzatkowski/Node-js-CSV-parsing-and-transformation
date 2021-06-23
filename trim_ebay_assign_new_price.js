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

go_next();


const header = ["Action(SiteID=UK|Country=GB|Currency=GBP|Version=1111|CC=UTF-8)","ItemID","Title","SiteID","Currency","StartPrice","OldAntPrice","BlackSKU","BuyItNowPrice","Quantity","Relationship","RelationshipDetails","CustomLabel"];

function go_next() {
  fs.createReadStream('ebay prices update 22 06 2021 - Before update BW.csv')
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
        if (results[i].Action == "Revise" ) {
          //it's a listing tab
          if ( results[i].Title.includes("Anthracite") ||  results[i].Title.includes("Antracite")) {
            //collect all data

            include = true;
            listing_tab = true;

            console.log(results[i].Title);

          }
        } else if ( sku != ""  ) {
          //it's a row with a product
          if (sku.includes("FC") || sku.includes("CC") || sku.includes("MYRA") || sku.includes("CB") || sku.includes("DIVA") ||
               sku.includes("FW")|| sku.includes("VALV") || sku.includes("TER") || sku.includes("EVER") || sku.includes("MEG") || sku.includes("CAPO") ||
               sku.includes("0-V") || sku.includes("AMEL") || sku.includes("BRC") || sku.includes("PLUG") || sku.includes("SYDNEY") || sku.includes("ALMILA")  ||
               results[i].Title.includes("BW")  || results[i].Title.includes("MH")  || results[i].Title.includes("Brackets") || results[i].Title.includes("BW31") ||
               results[i].Title.includes("BW63")   ) {
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
                     if (results[j].CustomLabel == black_sku) {
                       new_price = results[j].StartPrice;
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

          if (listing_tab){
            filtered.push([
              results[i].Action,
              results[i].ItemID,
              results[i].Title,
              results[i].SiteID,
              results[i].Currency,
              results[i].StartPrice,
              "",
              "",
              results[i].BuyItNowPrice,
              results[i].Quantity,
              results[i].Relationship,
              results[i].RelationshipDetails,
              results[i].CustomLabel
              ]);
          } else if(include) {
            filtered.push([
              results[i].Action,
              results[i].ItemID,
              results[i].Title,
              results[i].SiteID,
              results[i].Currency,
              new_price,
              (results[i].StartPrice + "___OLD_ANT_PRICE"),
              black_sku,
              results[i].BuyItNowPrice,
              results[i].Quantity,
              results[i].Relationship,
              results[i].RelationshipDetails,
              results[i].CustomLabel
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
