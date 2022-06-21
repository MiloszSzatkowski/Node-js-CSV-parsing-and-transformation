const csv = require('csv-parser')
var fs = require('fs');
var util = require('util');

const { convertArrayToCSV } = require('convert-array-to-csv');
const converter = require('convert-array-to-csv');

// SKU,Quantity,Price,Option,Sizes,EAN


const header = ["sku", "price"]

const results = [];

var filtered = [];
var filtered02 = [];
var filtered03 = [];

go_next() ;

// function go_first() {
//   fs.createReadStream('')
//     .pipe(csv())
//     .on('data', (data) => filtered02.push(data))
//     .on('end', () => { go_next(); } )
// }

function go_next() {
  fs.createReadStream('all chrome electric radiators')
    .pipe(csv())
    .on('data', (data) => results.push(data))
    .on('end', () => {

      for(let i = 0; i < results.length; i++){

        // SKU,Quantity,Price,Option,Sizes,EAN
        // FC30-60-PFS,92,94.99,With Pre-Filled Standard Element,Elissa 300 / 600mm Electric Chrome,Does not apply
          let sku = results[i].SKU;
          let quantity = results[i].Quantity;
          let price = results[i].Price;
          let option = results[i].Option;
          let size = results[i].Sizes;

          if (sku.includes("PFS")) {
            // dont process standard electric element
          } else {
            // SKU,
            // sku
            // Product_Name,
            let prefix_size = sku
            var Product_Name = prefix_size +  'Wide Chrome Electric Thermostatic Towel Rail Radiator' + suffix_option;
            // Description,
            //
            // Default_Image,
            //
            // Brand,Category,
            //
            // Condition,
            //
            // EAN / UPC,
            //
            // Price,
            //
            // Stock,
            //
            // Handling_Time,
            //
            // Shipping_Template_Id,
            //
            // Shipping_Weight_(Kg),
            //
            // Warranty (Months),
            //
            // Free Returns,
            //
            // ASIN,
            //
            // MPN,
            //
            // RRP,
            //
            // Parent_Group,
            //
            // Variant_One_Name,
            //
            // Variant_One_Value,
            //
            // Variant_Two_Name,
            //
            // Variant_Two_Value,Clothing Size,
            //
            // Colour,
            //
            // Summary_Point_One,
            //
            // Summary_Point_Two,
            //
            // Summary_Point_Three,
            //
            // Summary_Point_Four,
            //
            // Summary_Point_Five,
            //
            // Additional_images_One,
            //
            // Additional_images_Two,
            //
            // Additional_images_Three,
            //
            // Additional_images_Four,
            //
            // Additional_images_Five,
            //
            // Additional_images_Six,
            //
            // Additional_images_Seven,
            //
            // Additional_images_Eight,
            //
            // Additional_images_Nine,
            //
            // Additional_images_Ten,
            //
            // Data_One_Name,
            //
            // Data_One_Value,
            //
            // Data_Two_Name,
            //
            // Data_Two_Value,
            //
            // Data_Three_Name,
            //
            // Data_Three_Value,
            //
            // Data_Four_name,
            //
            // Data_Four_Value,
            //
            // Data_Five_Name,
            //
            // Data_Five_Value,
            //
            // Data_Six_Name,
            //
            // Data_Six_Value,
            //
            // Data_Seven_Name,
            //
            // Data_Seven_Value,
            //
            // Data_Eight_Name,
            //
            // Data_Eight_Value,
            //
            // Data_Nine_Name,
            //
            // Data_Nine_Value,
            //
            // Data_Ten_Name,
            //
            // Data_Ten_Value,
            //
            // Data_One_Group,
            //
            // Data_Two_Group,
            //
            // Data_Three_Group,
            //
            // Data_Four_Group,
            //
            // Data_Five_Group,
          }




          filtered.push([

          ]);


        }

        //PUSH END ****************************************
    }

    filtered();

  });
}

function save_CSV (final_arr) {

  console.log(final_arr);


  var csvFromArrayOfArrays = convertArrayToCSV(final_arr, {
    header
  });


  fs.writeFile('./Onbuy_GT_MOA_KTX3_listing.csv', csvFromArrayOfArrays, function (err) {
    if (err) return console.log(err);
  });

}




















</br>Technical Information:
</br>Bar layout and BTU as shown on the pictures and the title.
</br>Wall Distance: 85-100 mm
</br>Wall to Pipe Centre: 70-85 mm
</br>Tube width: 22mm
</br>
</br>Usage: Electric only.
</br>
</br>Suitable for Bathroom , Kitchen , Toilet , Cloak Room , Utility room
</br>
</br>Warranty 5 years on Radiator and 2 Years on Heating Element
</br>
</br>
</br>What's In The Box:
</br>
</br>4 x Wall Brackets
</br>
</br>2 x Blanking Plug
</br>
</br>1 x Bleeding Valve
</br>
</br>1 x Selected Electric element
</br>
</br>1 x Instructions
</br>
</br>Please Note: – All our heat output figures (BTU’S) are listed at Delta T50
</br>
</br>
</br>Description of Our Electric Elements:
</br>
</br>GT Thermostatic Element:
</br>
</br>The electrical element senses the internal water temperature. This gives you surface temperature control.
</br>
</br>Made of high-quality components,
</br>Possibility of fine temperature regulation,
</br>Easy positioning of temperature regulation button within the field of vision,
</br>Indicator lamp can be seen from all the angles,
</br>Safety junction between the radiator and the device,
</br>Completely protected from eventual over-heating by a thermic safety fuse
</br>IP Rating – IP54
</br>1.5mt Flex Cable Attached
</br>
</br>MOA Thermostatic Element:
</br>
</br>The electrical element senses the internal water temperature. This gives you surface temperature control.
</br>
</br>Offers 5 temperature settings ranging from 30°C to 60°C.
</br>Equipped with an electronic temperature sensor that guarantees precise temperature control.
</br>The MOA Displays the currently set temperature level and the status of the heating cycle using an LED indicator.
</br>The heating element has a very low power consumption in a standby mode.
</br>IP Rating – IP54
</br>2 Hours Drying Timer Function Built-in
</br>1.5mt Flex Cable Attached
</br>
</br>KTX3 Electric Element + a Timer:
</br>
</br>The electrical element senses the internal water temperature. This gives you surface temperature control.
</br>
</br>The KTX 3 offers adjustable temperature levels ranging from 30°C to 60°C in steps of 1°C.
</br>An electronic temperature sensor guarantees precise temperature control.
</br>The device displays the current set temperature level and indicates the status of the heating cycle or standby state.
</br>It also has an easy interface for controller programming (you can set it up to turn on during different time intervals)
</br>
</br>IPx5 IP Rating
</br>LCD display with actual time (clock) and temperature
</br>7/24 Weekly Programmable
</br>1.5mt Flex Cable Attached
