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


go_next();

const header = ["ID","Type","Name","Parent", "SKU", "Only_Radiator_SKU", , "Only_Radiator_Price", "Element_Price", "Element_w_VAT",'"Regular price"', "Price_with_VAT"];

function go_next() {
  fs.createReadStream('website price before update 01 07 2021 - wc-product-export-1-7-2021-1625134558477 (1).csv')
    .pipe(csv())
    .on('data', (data) => results.push(data))
    .on('end', () => {
      for(let i = 0; i < results.length; i++){

        let sku = results[i].SKU;
        let title = results[i].Name;

        let include = false;
        new_price = "";

        let price_of_radiator_only = "";
        let sku_of_radiator_only = "";
        let plus_price_from_name;


        // START OF IF -> REVISE **********************************************************************************************************
        //check for the type of row
        if ( results[i].Type == "variation" ) {
          if ( sku.includes("TER") || sku.includes("0-V") || sku.includes("SYDNEY") ||  sku.includes("BRC") || sku.includes("MYRA") || sku.includes("AIR")
              || sku.includes("0-WH") || sku.includes("0-BL")  || sku.includes("0-CH") || (sku == undefined) ||   sku.includes("-T-") || title.includes("Radiator Only")) {
            //skip
          } else {
            //include
            if (sku.includes("DIVA-CB")) {
              let temp_sku = sku.replace("DIVA-","");
              sku_of_radiator_only = temp_sku.split("-")[0] + "-" + temp_sku.split("-")[1];
              sku_of_radiator_only = "DIVA-" + sku_of_radiator_only;
            } else if (sku.includes("DIVA-B-")) {
              let temp_sku = sku.replace("DIVA-B-","");
              sku_of_radiator_only = temp_sku.split("-")[0] + "-" + temp_sku.split("-")[1];
              sku_of_radiator_only = "DIVA-B-" + sku_of_radiator_only;
            } else {
              sku_of_radiator_only = sku.split("-")[0] + "-" + sku.split("-")[1];
            }

            plus_price_from_name = title.split("+£");
            plus_price_from_name = plus_price_from_name [ plus_price_from_name.length - 1] ;

            let electric_price = 25;

            if (sku.includes("PFT")) {
              plus_price_from_name =  parseFloat(plus_price_from_name) + electric_price;
            } else if (sku.includes("PFS")) {
              plus_price_from_name = electric_price;
            }

            //round
            plus_price_from_name = (Math.round(plus_price_from_name * 100) / 100);

            // console.log("___");
            // console.log(sku);
            // console.log(title);
            // console.log(plus_price_from_name);

            // console.log(sku_of_radiator_only);
            for (let j = 0; j < results.length; j++) {
              if (sku_of_radiator_only == results[j].SKU) {
                price_of_radiator_only = results[j].Regular_price;
                new_price = parseFloat(price_of_radiator_only) + parseFloat(plus_price_from_name);
                include = true;
                break;
              }
            }

            // console.log("++");
            // console.log(price_of_radiator_only);
            // console.log(plus_price_from_name);
            // console.log(new_price);

            // console.log(sku);
            // console.log(sku_of_radiator_only);
            // console.log("------");

          }
        }
        // END OF IF -> REVISE **********************************************************************************************************

        //PUSH ****************************************

        // let id = Object.values(results[i])[0];
        let id = results[i].ID;
        let with_VAT = new_price * 1.2;
        let element_with_VAT = plus_price_from_name * 1.2;


          if (include){

            filtered.push([
              id,
              results[i].Type,
              results[i].Name,
              results[i].Parent,
              results[i].SKU,
              sku_of_radiator_only,
              price_of_radiator_only,
              plus_price_from_name,
              element_with_VAT,
              new_price,
              with_VAT
            ]);

          }

        //PUSH END ****************************************

    }

    console.log(filtered.length);

      var csvFromArrayOfArrays = convertArrayToCSV(filtered, {
        header,
        separator: '$'
      });


      fs.writeFile('./New_Prices_MH_assign_attr.csv', csvFromArrayOfArrays, function (err) {
        if (err) return console.log(err);
      });


  });
}
