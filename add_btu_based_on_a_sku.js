const csv = require('csv-parser')
var fs = require('fs');
var util = require('util');
var btu_main = require('./btu.js');
var btu = btu_main.btu;

const { convertArrayToCSV } = require('convert-array-to-csv');
const converter = require('convert-array-to-csv');


const results = [];

var filtered = [];
var filtered02 = [];


go_next();

const header = [ "SKU","Quantity","Price","Please Select Size","EAN"];
// SKU,Quantity,Price,Please_Select_Size,EAN
// FB40-60,0,61.9,400 x 600mm High,Does Not Apply

function go_next() {
  fs.createReadStream('dewabit_variations_255044894404_255044894404_0002.csv')
    .pipe(csv())
    .on('data', (data) => results.push(data))
    .on('end', () => {
      for(let i = 0; i < results.length; i++){

        let sku = Object.values(results[i])[0];
        let br = "FB";
        let sec_br = "ANT"
        let width = "";
        let height = "";

        if (sku.includes(br)) {
          width = sku.split(br)[1].split("-")[0] + "0";
          height = sku.split("-").pop() + "0";
        } else if (sku.includes(sec_br)){
          width = sku.split(sec_br)[1].split("-")[0] + "0";
          height = sku.split("-").pop() + "0";
        }

        console.log(width + " " + height);

        let colour = true;

        let btu_value = "";

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

        let old_size = Object.values(results[i])[3];
        let new_size = "";
        if (width !== "") {
          new_size = old_size + " - BTU: " + btu_value;
        } else {
          new_size = old_size;
        }

          filtered.push([
            sku,
            results[i].Quantity,
            results[i].Price,
            new_size,
            results[i].EAN
          ]);
    }

    console.log("Amount of elements:");
    console.log(filtered.length);


      var csvFromArrayOfArrays = convertArrayToCSV(filtered, {
        header,
        separator: '$'
      });


      fs.writeFile('./Dewabit_BTU.csv', csvFromArrayOfArrays, function (err) {
        if (err) return console.log(err);
      });


  });
}
