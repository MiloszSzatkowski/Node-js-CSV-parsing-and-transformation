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

const header = ["Old Title", "Title"];

function go_next() {
  fs.createReadStream('wc-product-export-20-8-2021-1629460662781 - Sheet2.csv')
    .pipe(csv())
    .on('data', (data) => results.push(data))
    .on('end', () => {
      for(let i = 0; i < results.length; i++){
        if(true){
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
            var height = str.split(' - ')[1].split("mm High")[0];
            var width = str.split('mm Wide')[0];

            // console.log(width + "        x       " + height);

            let type = ( title.includes("Curved") ) ? "Curved" : "Straight";

            let small = ( ( parseFloat(width) < 600 ) && ( parseFloat(height) < 900 ) ) ? "Small " : "";

            let electric = ( title.includes("Electric") ) ? " Electric" : "";

            let brand = "";

            if        (title.includes("Accuro Korle")) {
              brand = " Accuro Korle Designer";
            } else if (title.includes("Sydney")) {
              brand = " Sydney Designer";
            } else if (title.includes("25mm Tube")){
              brand = " Diva 25mm Tube";
            } else if (title.includes("Capo")){
              brand = " Capo";
            }

            let new_title = `${small}${colour}${electric} Heated Towel Rail Radiator ${width}mm x ${height}mm ${type}${brand} `;

            if (title.split("-").length > 2) {
              let remainder = title.split(" - ").pop();
              new_title = new_title + "- " + remainder;
            }

            console.log(new_title);

            // console.log(new_title);
            // if (small !== "") {
            //   console.log(new_title);
            // }

            // 400 mm High – 1100mm Wide Flat White Heated Towel Rail Radiator

              filtered.push([
                title,
                new_title
              ]);
            }
      }
    }

    console.log("Amount of elements:");
    console.log(filtered.length);


      var csvFromArrayOfArrays = convertArrayToCSV(filtered, {
        header,
        separator: '$'
      });


      fs.writeFile('./New_names_MH_to_BW.csv', csvFromArrayOfArrays, function (err) {
        if (err) return console.log(err);
      });


  });
}
