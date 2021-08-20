const csv = require('csv-parser')
var fs = require('fs');
var util = require('util');

const { convertArrayToCSV } = require('convert-array-to-csv');
const converter = require('convert-array-to-csv');

const results = [];
var filtered = [];

// const header = ["ID","Name","Description","Parent","SKU"];

const header = [ 'ID',	'Type',	'SKU',	'Name',	'Published',	'Is featured?',	'Visibility in catalogue',	'Short description',
'Description',	'Date sale price starts',	'Date sale price ends',	'Tax status',	'Tax class',	'In stock?',	'Stock',
'Low stock amount',	'Backorders allowed?',	'Sold individually?',	'Weight (kg)',	'Length (cm)',	'Width (cm)',	'Height (cm)',
'Allow customer reviews?',	'Purchase note',	'Sale price',	'Regular price',	'Categories',	'Tags',	'Shipping class',	'Images',
'Download limit',	'Download expiry days',	'Parent',	'Grouped products',	'Upsells',	'Cross-sells',	'External URL',	'Button text',
'Position',	'Attribute 1 name',	'Attribute 1 value(s)',	'Attribute 1 visible',
'Attribute 1 global',	'Attribute 2 name',	'Attribute 2 value(s)',	'Attribute 2 visible',	'Attribute 2 global'];

var new_sku = "";
var new_title = "";
var new_price = "";
var attribute_1_value = "";
var position = "";
var image = "";

// Attribute 1 value(s)
// Add TRV Straight Anthracite Valves +£22.50
// Add TRV Angled Anthracite Valves +£22.50
//
// Position
// 4
// 5
//
// In stock?
// 0

var description = '<p style="text-align: left"><strong>Straight or Angled?</strong></br>If your pipework is coming up <strong>from the ground</strong>, then <strong>straight radiator valves</strong> are used. Whereas if it is coming <strong>from the wall</strong> at an angle, <strong>angled valves</strong> are used.</p><p style="text-align: left"><strong>TRV or Regular?</strong></br>Thermostatic Radiator Valves (TRVs) have an in-built temperature sensor, that keeps the room temperature at a constant level. Regular valves are effectively the same as taps – you turn the valve to control the temperature of the room.</p>';

go_myhomeware();

function go_myhomeware() {
  fs.createReadStream('ANT.csv')
    .pipe(csv())
    .on('data', (data) => results.push(data))
    .on('end', () => {

      try {

        for(let i = 0; i < results.length; i++){

        let sku = results[i].SKU;

        // console.log(sku.split("-").length);
        if( results[i].Type=="variation" && sku.split("-").length == 2 ){
          // console.log(results[i].SKU + "aaaaaaaaaaaaaaaaaaaaaaaaaa");

          for (let ll = 0; ll < 2; ll++) {

            if        (ll == 0) {
              // STRAIGHT
              new_sku = results[i].SKU + "-ANT-TRVSV";
              new_title = results[i].Name.replace("- Radiator Only", "- Add TRV Straight Anthracite Valves +£22.50");
              // 900mm Wide - 700mm High Anthracite Grey Heated Towel Rail Radiator - Add TRV Straight Anthracite Valves +£22.50
              // 900mm Wide - 700mm High Anthracite Grey Heated Towel Rail Radiator - Add TRV Angled Anthracite Valves +£22.50
              new_price = parseFloat(results[i].Regular_price) + 22.50;
              attribute_1_value = "Add TRV Straight Anthracite Valves +£22.50";
              position = 4;
              image = "https://www.myhomeware.co.uk/wp-content/uploads/2021/08/Anthracite-Thermostatic-Straight-15mm-600x600.jpg";
              // https://www.myhomeware.co.uk/wp-content/uploads/2021/08/Anthracite-Thermostatic-Straight-15mm-600x600.jpg
              // https://www.myhomeware.co.uk/wp-content/uploads/2021/08/Anthracite-Thermostatic-Angled-15mm-600x600.jpg
              // Attribute 1 value(s)
              // Add TRV Angled Anthracite Valves +£22.50
              // Add TRV Straight Anthracite Valves +£22.50

            } else if (ll == 1) {
              // ANGLED
              new_sku = results[i].SKU + "-ANT-TRVAV";
              new_title = results[i].Name.replace("- Radiator Only", "- Add TRV Angled Anthracite Valves +£22.50");
              // 900mm Wide - 700mm High Anthracite Grey Heated Towel Rail Radiator - Add TRV Straight Anthracite Valves +£22.50
              // 900mm Wide - 700mm High Anthracite Grey Heated Towel Rail Radiator - Add TRV Angled Anthracite Valves +£22.50
              new_price = parseFloat(results[i].Regular_price) + 22.50;
              attribute_1_value = "Add TRV Angled Anthracite Valves +£22.50";
              position = 5;
              image = "https://www.myhomeware.co.uk/wp-content/uploads/2021/08/Anthracite-Thermostatic-Angled-15mm-600x600.jpg";
              // https://www.myhomeware.co.uk/wp-content/uploads/2021/08/Anthracite-Thermostatic-Straight-15mm-600x600.jpg
              // https://www.myhomeware.co.uk/wp-content/uploads/2021/08/Anthracite-Thermostatic-Angled-15mm-600x600.jpg
              // Attribute 1 value(s)
              // Add TRV Angled Anthracite Valves +£22.50
              // Add TRV Straight Anthracite Valves +£22.50
            }

            if (true) {
              filtered.push([
                results[i].ID, //results[i].ID,
                results[i].Type,
                new_sku, //results[i].SKU,
                new_title, //results[i].Name,
                results[i].Published,
                results[i].Is_featured,
                results[i].Visibility_in_catalogue,
                results[i].Short_description,
                description, //results[i].Description,
                results[i].Date_sale_price_starts,
                results[i].Date_sale_price_ends,
                results[i].Tax_status,
                results[i].Tax_class,
                0,                // results[i].In_stock,
                0,                // results[i].Stock,
                results[i].Low_stock_amount,
                results[i].Backorders_allowed,
                results[i].Sold_individually,
                results[i].Weight_kg,
                results[i].Length_cm,
                results[i].Width_cm,
                results[i].Height_cm,
                results[i].Allow_customer_reviews,
                results[i].Purchase_note,
                results[i].Sale_price,
                new_price, //results[i].Regular_price,
                results[i].Categories,
                results[i].Tags,
                results[i].Shipping_class,
                image, //results[i].Images,
                results[i].Download_limit,
                results[i].Download_expiry_days,
                results[i].Parent,
                results[i].Grouped_products,
                results[i].Upsells,
                results[i].Cross_sells,
                results[i].External_URL,
                results[i].Button_text,
                position, //results[i].Position,
                results[i].Attribute_1_name,
                attribute_1_value, //results[i].Attribute_1_values,
                results[i].Attribute_1_visible,
                results[i].Attribute_1_global,
                results[i].Attribute_2_name,
                results[i].Attribute_2_values,
                results[i].Attribute_2_visible,
                results[i].Attribute_2_global

              ]);
            }
          }

              // const header = [ 'ID',	'Type',	'SKU',	'Name',	'Published',	'Is featured?',	'Visibility in catalogue',	'Short description',
              // 'Description',	'Date sale price starts',	'Date sale price ends',	'Tax status',	'Tax class',	'In stock?',	'Stock',
              // 'Low stock amount',	'Backorders allowed?',	'Sold individually?',	'Weight (kg)',	'Length (cm)',	'Width (cm)',	'Height (cm)',
              // 'Allow customer reviews?',	'Purchase note',	'Sale price',	'Regular price',	'Categories',	'Tags',	'Shipping class',	'Images',
              // 'Download limit',	'Download expiry days',	'Parent',	'Grouped products',	'Upsells',	'Cross-sells',	'External URL',	'Button text',
              // 'Position',	'Attribute 1 name',	'Attribute 1 value(s)',	'Attribute 1 visible',
              // 'Attribute 1 global',	'Attribute 2 name',	'Attribute 2 value(s)',	'Attribute 2 visible',	'Attribute 2 global'];
          }
        }
      } catch (e) {
        console.log(e);
        // LOG ERRORS FROM TRY
      }

      console.log(filtered[0]);
      console.log(filtered[1]);


      var csvFromArrayOfArrays = convertArrayToCSV(filtered, {
        header,
        separator: '$'
      });

      console.log('Length of an array:  '  + filtered.length);

      fs.writeFile('./New_Attributes_MH.csv', csvFromArrayOfArrays, function (err) {
        if (err) return console.log(err);
      });

  });
}
