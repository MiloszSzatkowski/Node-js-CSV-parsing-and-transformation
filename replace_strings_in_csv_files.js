const csv = require('csv-parser')
var fs = require('fs');
var util = require('util');

const { convertArrayToCSV } = require('convert-array-to-csv');
const converter = require('convert-array-to-csv');

const results = [];

var found = false;

var filtered = [];

go_next();

const header = ["SKU" ,	"Quantity" ,	"Price" ,	"Electric Element" ,	"Size" ,	"EAN" ];
// SKU	Quantity	Price	Electric Element	Size	EAN

function go_next() {
  fs.createReadStream('fc-60.csv')
    .pipe(csv())
    .on('data', (data) => results.push(data))
    .on('end', () => {
      for(let i = 0; i < results.length; i++){

        let old_sku = Object.values(results[i])[0];
        let new_sku = "";

        let new_price = "";


        if        (old_sku.includes("-SV")) {
          new_sku = old_sku.replace("-SV", "-PFS");
        } else if (old_sku.includes("-AV")) {
          new_sku = old_sku.replace("-AV", "-PFT-GT");
        } else if (old_sku.includes("-TRVSV")) {
          new_sku = old_sku.replace("-TRVSV", "-PFT-MOA");
        } else if (old_sku.includes("-TRVAV")) {
          new_sku = old_sku.replace("-TRVAV", "-PFT-KTX3");
        }

        //reverse the price
        if        (old_sku.includes("-SV")) {
          new_price =
        } else if (old_sku.includes("-AV")) {
          new_price =
        } else if (old_sku.includes("-TRVSV")) {
          new_price =
        } else if (old_sku.includes("-TRVAV")) {
          new_price =
        }

        filtered.push([
          new_sku,
          results[i].Quantity,
          results[i].Price,
          results[i].Valve,
          results[i].Size,
          results[i].EAN
          ]);

    }

    // console.log(Object.keys(results[0]));
    console.log(filtered);
    console.log("Array length:");
    console.log(filtered.length);

      var csvFromArrayOfArrays = convertArrayToCSV(filtered, {
        header,
        separator: '$'
      });


      fs.writeFile('./Electric_compilation_CSV_Ebay.csv', csvFromArrayOfArrays, function (err) {
        if (err) return console.log(err);
      });


  });
}
