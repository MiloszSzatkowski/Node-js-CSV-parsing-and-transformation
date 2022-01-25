const csv = require('csv-parser')
var fs = require('fs');
var util = require('util');

const { convertArrayToCSV } = require('convert-array-to-csv');
const converter = require('convert-array-to-csv');

var results = [];

var mh_results = [];

var filtered = [];

var new_price_array = [];

var new_price = "";

var counter = 0;

var black_sku;

var sku;

var new_prices_table = {
  "Chrome" : {
    "Radiator" : 2,
    "With_Manual_Valves" : 13,
    "With_TRV_Valves" : 28,
    "PFS" : 30,
    "GT" : 60,
    "MOA" : 75,
    "KTX3" : 90
  },
  "Black" : {
    "Radiator" : 2,
    "With_Manual_Valves" : 22,
    "With_TRV_Valves" : 28,
    "PFS" : 30,
    "GT" : 60,
    "MOA" : 75,
    "KTX3" : 90
  },
  "Anthracite" : {
    "Radiator" : 2,
    "With_Manual_Valves" : 22,
    "With_TRV_Valves" : 28,
    "PFS" : 30,
    "GT" : 60,
    "MOA" : 75,
    "KTX3" : 90
  },
  "White" : {
    "Radiator" : 2,
    "With_Manual_Valves" : 20,
    "With_TRV_Valves" : 28,
    "PFS" : 30,
    "GT" : 60,
    "MOA" : 75,
    "KTX3" : 90
  }
}

function check_for_radiator_only_sku (prime_sku) {

  let prime_price = 0;

  for(let j = 0; j < results.length; j++){

    if (results[j].SKU == prime_sku) {
      prime_price = parseFloat(results[j].Start_price);
      break;
    }

  }

  return prime_price;

}

// Action	Item number	Title	Listing site	Currency	Start price	Buy It Now price	Available quantity	Relationship	Relationship details	Custom label (SKU)
// const header = ["Action(SiteID=UK|Country=GB|Currency=GBP|Version=1111|CC=UTF-8)" ,	"ItemID",	"Title",	"SiteID",	"Currency",	"StartPrice",	"OldPrice", "Difference", "CustomLabel",	"Relationship",	"RelationshipDetails"];
const header = ["ID",	"Type",	"SKU"	,"Name",	"Old price without VAT"	, "New price without VAT"	, "New price with VAT"	, "Ebay Price" , "Difference" , "Parent"	 ];

// Action	Item number	Title	Listing site	Currency	Start price	Buy It Now price	Custom label (SKU)	Available quantity	Relationship	Relationship details

function beautify_price(nr) {
  let temp = parseFloat((Math.round(nr * 5) / 5).toFixed(2));
  temp = temp - 0.01;
  return temp;
}

save_MH_PRICE();

function save_MH_PRICE() {
  fs.createReadStream('New Year 2022 Price Change Radiator - Upload of eBay NEW MH Radiator Prices (1).csv')
    .pipe(csv())
    .on('data', (data_mh) => mh_results.push(data_mh))
    .on('end', () => {
      console.log("MH length  " + mh_results.length);
      go_next();
    })
}

var lost_counter = 0;

function lookup_MH_price (fun_sku) {
  let all_skus = [];
  for (var ppp = 0; ppp < mh_results.length; ppp++) {
    if ( mh_results[ppp].SKU.toString().trim() == fun_sku.toString().trim() ) {
      all_skus.push(parseFloat(mh_results[ppp].Start_price));
    }
  }
  all_skus = all_skus.sort(function(a, b) {
    return a - b;
  });
  if (all_skus == "") {
    let ms = "Not Found  :  " +  fun_sku ;
    console.log(ms);
    lost_counter++;
    return "nf";
  }

  let len = all_skus.length;

  return all_skus[len-1];
}

var diff;

function go_next() {
  fs.createReadStream('New Prices MH website - old prices.csv')
    .pipe(csv())
    .on('data', (data) => results.push(data))
    .on('end', () => {
      for(let i = 0; i < results.length; i++){

        let log  = "";

        sku = results[i].SKU;
        let old_price = parseFloat(results[i].Regular_price);


        // START OF IF -> REVISE **********************************************************************************************************
        //check for the type of row
        if (true) { // if it's a start of a listing -> begin

        eBay_price = lookup_MH_price(sku);

        new_price = eBay_price - 5;

        if (new_price == "nf2") {
          log = sku + " Not Found";
          new_price = old_price;
        }

        log = "";

        // new_price_arr == "Not Found" ? console.log(sku + " || New Price: " +  new_price_arr + " || Old Price " + old_price) : "";


        diff = (new_price !== "") ? parseFloat(new_price - eBay_price) : "";

        const header = ["ID",	"Type",	"SKU"	,"Name",	"Regular price"	,"Parent"	 ];

        let new_price_no_VAT =  Math.round((new_price / 1.2) * 100) / 100;

          if (results[i].Name.includes("Radiator Only")){
            filtered.push([
              results[i].ID,
              results[i].Type,
              results[i].SKU,
              results[i].Name,
              results[i].Regular_price,
              new_price_no_VAT,
              new_price,
              eBay_price,
              diff,
              results[i].Parent
              ]);
          }
	// "Old price without VAT"	, "New price without VAT"	, "New price with VAT"	, "Ebay Price" , "Difference"


          // console.log(filtered[i]);

        //PUSH END ****************************************

      }

    }

    console.log("Not found: " + lost_counter);

    console.log("Array length:");
    console.log(filtered.length);

      var csvFromArrayOfArrays = convertArrayToCSV(filtered, {
        header,
        separator: ';'
      });


      fs.writeFile('./New_price_website_MH'  + parseInt(20) + '.csv', csvFromArrayOfArrays, function (err) {
        if (err) return console.log(err);
      });


  });
}


// else if (has_regular_valves && is_chrome)     {
//   new_price = old_price + new_prices_table.Chrome    .With_Manual_Valves;
//   if(admin_check){console.log("Chrome    .With_Manual_Valves");}
// } else if (has_regular_valves && is_black)      {
//   new_price = old_price + new_prices_table.Black     .With_Manual_Valves;
//   if(admin_check){console.log("Black     .With_Manual_Valves");}
// } else if (has_regular_valves && is_anthracite) {
//   new_price = old_price + new_prices_table.Anthracite.With_Manual_Valves;
//   if(admin_check){console.log("Anthracite.With_Manual_Valves");}
// } else if (has_regular_valves && is_white)      {
//   new_price = old_price + new_prices_table.White     .With_Manual_Valves;
//   if(admin_check){console.log("White     .With_Manual_Valves");}
// } else if (has_TRV_valves && is_chrome)     {
//   new_price = old_price + new_prices_table.Chrome    .With_TRV_Valves;
//   if(admin_check){console.log("Chrome    .With_TRV_Valves");}
// } else if (has_TRV_valves && is_black)      {
//   new_price = old_price + new_prices_table.Black     .With_TRV_Valves;
//   if(admin_check){console.log("Black     .With_TRV_Valves");}
// } else if (has_TRV_valves && is_anthracite) {
//   new_price = old_price + new_prices_table.Anthracite.With_TRV_Valves;
//   if(admin_check){console.log("Anthracite.With_TRV_Valves");}
// } else if (has_TRV_valves && is_white)      {
//   new_price = old_price + new_prices_table.White     .With_TRV_Valves;
//   if(admin_check){console.log("White     .With_TRV_Valves");}
// } else if (has_PFS && is_chrome)     {
//   new_price = old_price + new_prices_table.Chrome    .PFS;
//   if(admin_check){console.log("Chrome    .PFS");}
// } else if (has_PFS && is_black)      {
//   new_price = old_price + new_prices_table.Black     .PFS;
//   if(admin_check){console.log("Black     .PFS");}
// } else if (has_PFS && is_anthracite) {
//   new_price = old_price + new_prices_table.Anthracite.PFS;
//   if(admin_check){console.log("Anthracite.PFS");}
// } else if (has_PFS && is_white)      {
//   new_price = old_price + new_prices_table.White     .PFS;
//   if(admin_check){console.log("White     .PFS");}
// } else if (has_GT && is_chrome)     {
//   new_price = old_price + new_prices_table.Chrome    .GT;
//   if(admin_check){console.log("Chrome    .GT");}
// } else if (has_GT && is_black)      {
//   new_price = old_price + new_prices_table.Black     .GT;
//   if(admin_check){console.log("Black     .GT");}
// } else if (has_GT && is_anthracite) {
//   new_price = old_price + new_prices_table.Anthracite.GT;
//   if(admin_check){console.log("Anthracite.GT");}
// } else if (has_GT && is_white)      {
//   new_price = old_price + new_prices_table.White     .GT;
//   if(admin_check){console.log("White     .GT");}
// } else if (has_MOA && is_chrome)     {
//   new_price = old_price + new_prices_table.Chrome    .MOA;
//   if(admin_check){console.log("Chrome    .MOA");}
// } else if (has_MOA && is_black)      {
//   new_price = old_price + new_prices_table.Black     .MOA;
//   if(admin_check){console.log("Black     .MOA");}
// } else if (has_MOA && is_anthracite) {
//   new_price = old_price + new_prices_table.Anthracite.MOA;
//   if(admin_check){console.log("Anthracite.MOA");}
// } else if (has_MOA && is_white)      {
//   new_price = old_price + new_prices_table.White     .MOA;
//   if(admin_check){console.log("White     .MOA");}
// } else if (has_KTX3 && is_chrome)     {
//   new_price = old_price + new_prices_table.Chrome    .KTX3;
//   if(admin_check){console.log("Chrome    .KTX3");}
// } else if (has_KTX3 && is_black)      {
//   new_price = old_price + new_prices_table.Black     .KTX3;
//   if(admin_check){console.log("Black     .KTX3");}
// } else if (has_KTX3 && is_anthracite) {
//   new_price = old_price + new_prices_table.Anthracite.KTX3;
//   if(admin_check){console.log("Anthracite.KTX3");}
// } else if (has_KTX3 && is_white)      {
//   new_price = old_price + new_prices_table.White     .KTX3;
//   if(admin_check){console.log("White     .KTX3");}
// }


          //
          // let splitted = sku.split("-");
          // if        (sku.includes("SYDNEY")) {
          //   primed_sku =  splitted[0] + "-" + splitted[1] + "-" + splitted[2] + "-" + splitted[3];
          // } else if (sku.includes("CHAR"))  {
          //   primed_sku =  splitted[0] + "-" + splitted[1] + "-" + splitted[2] + "-" + splitted[3];
          // } else if (sku.includes("DIVA-B")) {
          //   primed_sku =  splitted[0] + "-" + splitted[1] + "-" + splitted[2] + "-" + splitted[3];
          // } else if (sku.includes("DIVA-CB")) {
          //   primed_sku =  splitted[0] + "-" + splitted[1] + "-" + splitted[2] ;
          // } else if (sku.includes("CAPO")) {
          //   primed_sku =  splitted[0] + "-" + splitted[1] + "-" + splitted[2];
          // } else {
          //   primed_sku =  splitted[0] + "-" + splitted[1];
          // }
