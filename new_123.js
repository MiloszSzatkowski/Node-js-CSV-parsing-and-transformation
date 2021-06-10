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

const header = ["ID","Title","Post_Type","Radiator Width","Radiator Height","Parent", "Colour"];

function go_next() {
  fs.createReadStream('wc-product-export-2-6-2021-1622646064213.csv')
    .pipe(csv())
    .on('data', (data) => results.push(data))
    .on('end', () => {
      for(let i = 0; i < results.length; i++){
        if((results[i].Categories !== "")){
          if(true){

            var title = results[i].Name.toString();
            var colour;

            if(title.includes('Black')){
              colour  = "Matt Black";
            } else if (title.includes('Chrome')) {
              colour  = "Chrome";
            } else if (title.includes('Anthracite')) {
              colour  = "Anthracite Grey";
            } else if (title.includes('White')) {
              colour  = "White";
            } else if (title.includes('Eloksal')) {
              colour  = "Champagne";
            }

            var str = title;
            var height = str.split(' mm High')[0];
            var width = str.split('mm Wide')[0].split(' – ');
            width = width[width.length - 1];
            width = width.split(" - ");
            width = width[width.length - 1];

            console.log(width);

            // 400 mm High – 1100mm Wide Flat White Heated Towel Rail Radiator

            var ww = width;
            var hh = height;

              filtered.push([
                results[i].ID,
                results[i].Name,
                results[i].Categories,
                ww,
                hh,
                results[i].Parent,
                colour
              ]);
            }
      }
    }

    console.log(filtered.length);


      var csvFromArrayOfArrays = convertArrayToCSV(filtered, {
        header,
        separator: '$'
      });


      fs.writeFile('./BW_new_colour_sizes.csv', csvFromArrayOfArrays, function (err) {
        if (err) return console.log(err);
      });


  });
}
