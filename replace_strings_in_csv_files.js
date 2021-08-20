const csv = require('csv-parser')
var fs = require('fs');
var util = require('util');
var btu_main = require('./btu.js');
var btu = btu_main.btu;

const { convertArrayToCSV } = require('convert-array-to-csv');
const converter = require('convert-array-to-csv');

var results = [];

var found = false;

var filtered = [];

const header = ["SKU" ,	"Quantity" ,	"Price" ,	"Electric Element" ,	"Size" ,	"EAN" ];
// SKU	Quantity	Price	Electric Element	Size	EAN

var file_names = [
  'fc-60.csv',
  'fc-70.csv',
  'fc-70.csv',
  'fc-80.csv',
  'fc-90.csv',
  'fc-100.csv',
  'fc-120.csv',
  'fc-140.csv',
  'fc-160.csv',
  'fc-170.csv',
  'fc-180.csv'
]

for (var p = 0; p < file_names.length; p++) {
  go_next(file_names[p], p);
}


function go_next( file_name , index) {
  fs.createReadStream( file_name )
    .pipe(csv())
    .on('data', (data) => results.push(data))
    .on('end', () => {
      for(let i = 0; i < results.length; i++){

        let old_sku = Object.values(results[i])[0];
        let len = old_sku.split("-").length;

        // console.log(len);

        if(len > 2){

          let new_sku = "";
          let new_price = "";
          let new_variation_title = "";
          let new_size = "";

          //change sku
          if        (old_sku.includes("-SV")) {
            new_sku = old_sku.replace("-SV", "-PFS");
          } else if (old_sku.includes("-AV")) {
            new_sku = old_sku.replace("-AV", "-PFT-GT");
          } else if (old_sku.includes("-TRVSV")) {
            new_sku = old_sku.replace("-TRVSV", "-PFT-MOA");
          } else if (old_sku.includes("-TRVAV")) {
            new_sku = old_sku.replace("-TRVAV", "-PFT-KTX3");
          }

          let sv_av_price = 10;
          let trv_price = 28;

          let pfs_price = 30;
          let gt_price = 58;
          let moa_price = 73;
          let ktx3_price = 88;

          //reverse the price
          if        (old_sku.includes("-SV")) {
            new_price = results[i].Price - sv_av_price + pfs_price;
          } else if (old_sku.includes("-AV")) {
            new_price = results[i].Price - sv_av_price + gt_price;
          } else if (old_sku.includes("-TRVSV")) {
            new_price = results[i].Price - trv_price + moa_price;
          } else if (old_sku.includes("-TRVAV")) {
            new_price = results[i].Price - trv_price + ktx3_price;
          }

          //change variation title
          if        (old_sku.includes("-SV")) {
            new_variation_title = "Manual Electric Element";
          } else if (old_sku.includes("-AV")) {
            new_variation_title = "GT Thermostatic Element";
          } else if (old_sku.includes("-TRVSV")) {
            new_variation_title = "MOA Thermostatic Element";
          } else if (old_sku.includes("-TRVAV")) {
            new_variation_title = "KTX3 Timer + Thermostatic Element";
          }

          //new size title
          let colour = false;

          let btu_value = "";

          let br = "FC";
          let width = "";
          let height = "";

          width = old_sku.split(br)[1].split("-")[0] + "0";
          height = old_sku.split("-")[1] + "0";

          // console.log(width + "x" + height);

          for (let j = 0; j < btu.length; j++) {
            if(btu[j].WIDTH == width && btu[j].HEIGHT == height){
              if (colour) {
                btu_value = btu[j].COLOUR;
              } else {
                btu_value = btu[j].CHROME;
              }
              break;
            }
          }

          new_size = `${width} x ${height} BTU: ${btu_value}`;

          filtered.push([
            new_sku,
            results[i].Quantity,
            new_price,
            new_variation_title,
            new_size,
            results[i].EAN
            ]);

        } //if len of a sku.split is > 2 - end brackets

    }

    // console.log(Object.keys(results[0]));
    // console.log(filtered);
    // console.log("Array length:");
    // console.log(filtered.length);

      var csvFromArrayOfArrays = convertArrayToCSV(filtered, {
        header,
        separator: '$'
      });

      // console.log(index);

      // let file_name_final = "./Electric_compilation_CSV_Ebay_" + file_name;
      let file_name_final = "./Electric_compilation_CSV_Ebay_.csv";

      fs.writeFile(file_name_final, csvFromArrayOfArrays, function (err) {
        if (err) return console.log(err);
      });

      results = [];

  });
}
