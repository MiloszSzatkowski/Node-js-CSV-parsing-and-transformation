const csv = require('csv-parser')
var fs = require('fs');
var util = require('util');

const { convertArrayToCSV } = require('convert-array-to-csv');
const converter = require('convert-array-to-csv');

const saved_array = [];
const results = [];

var filtered = [];

var mh_results = [];

var myhomeware_prices = [];

var new_price = "";

var counter = 0;

var black_sku;

function calculate_price_without_VAT (price_with_VAT) {
  return ( Math.round((price_with_VAT / 1.2) * 100) / 100 );
}

save_MH_PRICE();

function save_MH_PRICE() {
  fs.createReadStream('New Prices MH website - only radiator prices.csv')
    .pipe(csv())
    .on('data', (data_mh) => mh_results.push(data_mh))
    .on('end', () => {
      console.log("MH length  " + mh_results.length);
      go_next();
    })
}

function lookup_MH_price (_title, _parent_sku, _sku) {
  let all_skus = [];
  for (var ppp = 0; ppp < mh_results.length; ppp++) {
    let based = mh_results[ppp].Name.replace(" - Radiator Only", "");
    if ( _title.includes(based) ) {
      return parseFloat(mh_results[ppp].New_price_without_VAT)
    }
  }
  let temp_ = "_____";
  if (_sku.includes("PFS") ) {
     temp_ = _sku.split("-PFS");
    temp_ = temp_[0];
  } else if (_sku.includes("PFT")  ){
    temp_ = _sku.split("-PFT");
    temp_ = temp_[0];
  }
  for (var ppp = 0; ppp < mh_results.length; ppp++) {
    if ( mh_results[ppp].SKU == temp_) {
      return parseFloat(mh_results[ppp].New_price_without_VAT)
    }
  }
}

const header = ["ID","Type","Name","Parent", "SKU", "Only_Radiator_SKU", , "Only_Radiator_Price", "Element_Price", "Element_w_VAT",'"Regular price"', "Price_with_VAT"];

function go_next() {
  fs.createReadStream('New Prices MH website - old prices.csv')
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

        let electric_price = 25;

        // START OF IF -> REVISE **********************************************************************************************************
        //check for the type of row
        if ( true ) { //results[i].Type == "variation"
          if (true) {

            new_price = lookup_MH_price(title, results[i].Parent, sku);

            // if (new_price === undefined) {
            //   console.log("undefined" + " " + sku + " " + title);
            // } else {
            //   // console.log(sku);
            // }

            if (title.includes("Radiator Only")) {
              plus_price_from_name = 0;
            } else if (sku.includes("PFT")) {
              plus_price_from_name = title.split("£"); plus_price_from_name = plus_price_from_name [ plus_price_from_name.length - 1] ;
              plus_price_from_name =  parseFloat(plus_price_from_name) + electric_price;
              new_price = new_price + plus_price_from_name;
            } else if (sku.includes("PFS")) {
              plus_price_from_name = electric_price;
              new_price = new_price + plus_price_from_name;
            } else if(title.toLowerCase().includes("valves")) {
              plus_price_from_name = title.split("£"); plus_price_from_name = parseFloat(plus_price_from_name [ plus_price_from_name.length - 1] );
              new_price = new_price + plus_price_from_name;
            }

            new_price = (Math.round(new_price * 100) / 100);

            if (new_price == undefined) {
              console.log(sku);
            }

            //round

          }
        }
        // END OF IF -> REVISE **********************************************************************************************************

        //PUSH ****************************************

        // let id = Object.values(results[i])[0];
        let id = results[i].ID;
        let with_VAT = new_price * 1.2; with_VAT = (Math.round(with_VAT * 100) / 100);
        let element_with_VAT = plus_price_from_name * 1.2;

          if (true){

            filtered.push([
              id,
              results[i].Type,
              results[i].Name,
              results[i].Parent,
              results[i].SKU,
              "",
              "",
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


      fs.writeFile('./New_Prices_MH_assign_2022.csv', csvFromArrayOfArrays, function (err) {
        if (err) return console.log(err);
      });


  });
}
