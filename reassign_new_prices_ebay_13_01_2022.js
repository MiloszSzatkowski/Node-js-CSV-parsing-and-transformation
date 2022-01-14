const csv = require('csv-parser')
var fs = require('fs');
var util = require('util');

const { convertArrayToCSV } = require('convert-array-to-csv');
const converter = require('convert-array-to-csv');

var results = [];

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
const header = ["Action" , 	"Item number"	, "Title", 	"Listing site", 	"Currency",  "Start price",	"Old price", "Difference", "log", "Custom label (SKU)",
"Buy It Now price"	, "Available quantity", 	"Relationship", 	"Relationship details" 	 ];
// Action	Item number	Title	Listing site	Currency	Start price	Buy It Now price	Custom label (SKU)	Available quantity	Relationship	Relationship details

function beautify_price(nr) {
  let temp = parseFloat((Math.round(nr * 5) / 5).toFixed(2));
  temp = temp - 0.01;
  return temp;
}

go_next();


function go_next() {
  fs.createReadStream('New Year 2022 Price Change Radiator - eBay BW Radiator Prices.csv')
    .pipe(csv())
    .on('data', (data) => results.push(data))
    .on('end', () => {
      for(let i = 0; i < results.length; i++){

        sku = results[i].SKU;
        let old_price = parseFloat(results[i].Start_price);

        // START OF IF -> REVISE **********************************************************************************************************
        //check for the type of row
        if (results[i].Action !== "Revise" &&  sku !== "") { // if it's a start of a listing -> begin

          let prime_price_default = 2;

          let dash_count_in_sku = sku.replace(/[^-]/g, "").length;
          let prime = dash_count_in_sku == 1 && sku !== "ANT-SV" && sku !== "ANT-AV" && sku !== "TRV-ANT-AV"  && sku !== "TRV-ANT-SV";
          if(sku == "SYDNEY-CHRM-50-90" || sku == "SYDNEY-BLCK-50-90" || sku == "SYDNEY-ANT-50-90" || sku == "SYDNEY-CHRM-50-120" || sku == "SYDNEY-BLCK-50-120" || sku == "SYDNEY-ANT-50-120"){
            prime = true;
          }

          let has_regular_valves = sku.includes("-AV") || sku.includes("-SV") || sku.includes("-BAV") || sku.includes("-BSV") || sku.includes("-WSV") || sku.includes("-WAV");
          let has_TRV_valves     = sku.includes("TRV") ;

          let has_PFS  = sku.includes("PFS") ;
          let has_GT   = sku.includes("GT")  ;
          let has_MOA  = sku.includes("MOA") ;
          let has_KTX3 = sku.includes("KTX") ;
          let is_Diva  = sku.includes("DIVA")

          let is_chrome =       sku.includes("FC") || sku.includes("CC") || sku.includes("AMELIA") || sku.includes("CHRM") || sku.includes("MYRA") || sku.includes("DIVA30-") || sku.includes("DIVA45-") || sku.includes("DIVA75-");
          let is_black =        sku.includes("FB") || sku.includes("CB") || sku.includes("BLC")    || sku.includes("EVER") || sku.includes("-B-");
          let is_anthracite =   sku.includes("ANT");
          let is_white =        sku.includes("FW");



          let primed_sku = "";
          let prime_price = 0;
          let log = "";

          let admin_check = true;
          if ( false ) {      admin_check = true;   }
          // if (admin_check ) {   console.log("\n" + sku);    }

        if (admin_check && prime) {          log = log + "Prime ";       }
        if (admin_check && is_Diva ) {       log = log + "Diva  ";       }

        if (!prime && dash_count_in_sku !== "") {

          if        (has_regular_valves && is_chrome)     {
            prime_price_default = 5;
            if (admin_check ) {   log =  log  + "has_regular_valves && is_chrome";    }
          } else if (has_regular_valves && is_black)      {
            prime_price_default = 6;
            if (admin_check ) {   log =  log  + "has_regular_valves && is_black";    }

          } else if (has_regular_valves && is_anthracite) {
            prime_price_default = 6;
            if (admin_check ) {   log =  log  + "has_regular_valves && is_anthracite";    }

          } else if (has_regular_valves && is_white)      {
            prime_price_default = 7;
            if (admin_check ) {   log =  log  + "has_regular_valves && is_white";    }

          } else if (has_TRV_valves) {
            prime_price_default = 2;
            if (admin_check ) {   log =  log  + "has_TRV_valves";    }

          } else if (has_PFS) {
            prime_price_default = 2;
            if (admin_check ) {   log =  log  + "has_PFS";    }

          } else if (has_GT || has_MOA || has_KTX3) {
            prime_price_default = 4;
            if (admin_check ) {  log =  log  + "has_GT || has_MOA || has_KTX3"; }

          }

        }

        //if it's not a radiator
        if ( sku === "ANT-SV" || sku === "ANT-AV" || sku === "BAV" || sku === "BSV" || sku === "TRVBSV"          || sku === "TRVBAV"
        ||   sku === "AV"     || sku === "SV"     || sku === "WSV" || sku === "WAV" || sku === "TRV-ANT-SV"      || sku === "TRV-ANT-AV"      ) {
        log = log + " VALVE only ";     prime_price_default = 0;     }

        new_price = old_price + prime_price_default;

        // if (prime) {      //if it's a prime sku
        //   new_price = old_price + prime_price_default;
        // }


        // log = log + " " + sku + " Old Price: " + old_price + " New Price : " + new_price + " Diff : " + (new_price-old_price);

        console.log(log);

        if (sku.includes("EVER")) {
          // console.log(log);
        }

        // new_price = beautify_price(new_price);
        // console.log(new_price);
        // console.log(sku + "   "   + new_price);

        let diff = (new_price !== "") ? parseFloat(new_price - results[i].Start_price) : "";

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
              log,
              results[i].SKU,
              results[i].Buy_It_Now_price,
              results[i].Available_quantity,
              results[i].Relationship,
              results[i].Relationship_details,
              ]);
          }

          //,Action,Item_number,Title,Listing_site,Currency,Start_price,Buy_It_Now_price,Available_quantity,Relationship,Relationship_details,SKU

          // console.log(filtered[i]);

        //PUSH END ****************************************

      } else { //push REVISE listing row

          if (true){
            filtered.push([
              results[i].Action,
              results[i].Item_number,
              results[i].Title,
              results[i].Listing_site,
              results[i].Currency,
              "",
              results[i].Start_price,
              "",
              "",
              results[i].SKU,
              results[i].Buy_It_Now_price,
              results[i].Available_quantity,
              results[i].Relationship,
              results[i].Relationship_details
              ]);
          }

      }
    }

    console.log("Array length:");
    console.log(filtered.length);

      var csvFromArrayOfArrays = convertArrayToCSV(filtered, {
        header,
        separator: ';'
      });


      fs.writeFile('./New_Price_Ebay__Bathroom_Wisdom_2022_output'  + parseInt(20) + '.csv', csvFromArrayOfArrays, function (err) {
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
