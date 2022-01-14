const csv = require('csv-parser')
var fs = require('fs');
var util = require('util');

const { convertArrayToCSV } = require('convert-array-to-csv');
const converter = require('convert-array-to-csv');

var results = [];
var filtered = [];

go_next();

const header = ["Type",	"SKU",	"Name",	"Description"	,"Stock"	, "Regular price",	"Regular price of Rad Only", "Images",	"Parent",	"Attribute 1 name",
"Attribute 1 value(s)",	"Attribute 1 visible",	"Attribute 1 global"];

function go_next() {
  fs.createReadStream('wc-product-export-21-12-2021-1640096313532 FIXING IMPORT ANTHRACITE VALVE - wc-product-export-21-12-2021-1640096313532 (1).csv')
    .pipe(csv())
    .on('data', (data) => results.push(data))
    .on('end', () => {
      for(let i = 0; i < results.length; i++){

        if ( (results[i].attribute_1_value == "Radiator Only") && (results[i].SKU.includes("ANT")) ) { //Attribute 1 value(s) and SKU

          let type = "variation";

          let sku = results[i].SKU;

          //construct sku nr 1 and 2
          let sku_straight = sku + "-TRV-ANT-SV";
          let sku_angled   = sku + "-TRV-ANT-AV";

          //Name
          let name = results[i].Name;
          let name_naked = name.replace(" - Radiator Only", "");

          //name 1 and 2
          let name_straight = name_naked + " - " + "Add TRV Straight Anthracite Valves +£22.50";
          let name_angled   = name_naked + " - " + "Add TRV Angled Anthracite Valves +£22.50"  ;

          //description
          let description = '<p style="text-align: left"><strong>Straight or Angled?</strong></br>If your pipework is coming up <strong>from the ground</strong>, then <strong>straight radiator valves</strong> are used. Whereas if it is coming <strong>from the wall</strong> at an angle, <strong>angled valves</strong> are used.</p><p style="text-align: left"><strong>TRV or Regular?</strong></br>Thermostatic Radiator Valves (TRVs) have an in-built temperature sensor, that keeps the room temperature at a constant level. Regular valves are effectively the same as taps – you turn the valve to control the temperature of the room.</p>';

          let stock = 0;

          let regular_price = results[i].Regular_price;
          let price_straight_angled = parseFloat(regular_price) + 22.50;

          let image_straight = "https://www.myhomeware.co.uk/wp-content/uploads/2021/12/Anthracite-Thermostatic-Straight-15mm.jpg";
          let image_angled   = "https://www.myhomeware.co.uk/wp-content/uploads/2021/12/Anthracite-Thermostatic-Angled-15mm.jpg"  ;

          //parent is the same as radiator only
          let parent = results[i].Parent;

          //Attribute 1 name
          let attribute_1_name =  results[i].attribute_1_name;

          //Attribute 1 value(s)
          let attribute_1_value_straight = "Add TRV Straight Anthracite Valves +£22.50";
          let attribute_1_value_angled   = "Add TRV Angled Anthracite Valves +£22.50"  ;

          //Attribute 1 visible
          let visible = "";

          //Attribute 1 global
          let global_val = 1;


          // ["Type",	"SKU",	"Name",	"Description"	,"Stock"	, "Regular price",	"Regular price of Rad Only", "Images",	"Parent",	"Attribute 1 name",
          // "Attribute 1 value(s)",	"Attribute 1 visible",	"Attribute 1 global"];

          //straight

          filtered.push([
            type , //"Type",
            sku_straight , //"SKU",
            name_straight , //"Name",
            description , //"Description"	,
            stock , //"Stock"	,
            price_straight_angled , //"Regular price",
            results[i].Regular_price , //"Regular price of Rad Only",
            image_straight , //"Images",
            parent , //"Parent",
            attribute_1_name , //"Attribute 1 name",
            attribute_1_value_straight , //"Attribute 1 value(s)",
            visible , //"Attribute 1 visible",
            global_val //"Attribute 1 global"
          ],[
            type , //"Type",
            sku_angled , //"SKU",
            name_angled , //"Name",
            description , //"Description"	,
            stock , //"Stock"	,
            price_straight_angled , //"Regular price",
            results[i].Regular_price , //"Regular price of Rad Only",
            image_angled , //"Images",
            parent , //"Parent",
            attribute_1_name , //"Attribute 1 name",
            attribute_1_value_angled, //"Attribute 1 value(s)",
            visible , //"Attribute 1 visible",
            global_val //"Attribute 1 global"

          ]
        );

      } //end of if radiator only

        //PUSH END ****************************************

    } //result loop end

    console.log(filtered.length);

      var csvFromArrayOfArrays = convertArrayToCSV(filtered, {
        header,
        separator: '$'
      });


      fs.writeFile('./New_Attributes_Ant.csv', csvFromArrayOfArrays, function (err) {
        if (err) return console.log(err);
      });

  });
}
