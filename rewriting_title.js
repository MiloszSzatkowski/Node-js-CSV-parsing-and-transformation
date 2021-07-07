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

const header = ["ID", "Old title", "Title","Parent", "Old Element"];

function go_next() {
  fs.createReadStream('wc-product-export-7-7-2021-1625651635698.csv')
    .pipe(csv())
    .on('data', (data) => results.push(data))
    .on('end', () => {
      for(let i = 0; i < results.length; i++){
        if(results[i].Name.includes ("Heated Towel Rail") && !results[i].Name.includes ("Thermostatic")){
          if(results[i].Type == "variable"){

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

            // console.log(new_title);
            // if (small !== "") {
            //   console.log(new_title);
            // }

            // 400 mm High – 1100mm Wide Flat White Heated Towel Rail Radiator

            let id = Object.values(results[i])[0];

              filtered.push([
                id,
                results[i].Name, // old title
                new_title,
                results[i].Parent,
                Object.values(results[i])
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


      fs.writeFile('./Rewrite_titles.csv', csvFromArrayOfArrays, function (err) {
        if (err) return console.log(err);
      });


  });
}
