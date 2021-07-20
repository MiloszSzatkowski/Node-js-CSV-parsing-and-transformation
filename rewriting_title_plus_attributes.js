const csv = require('csv-parser')
var fs = require('fs');
var util = require('util');

const { convertArrayToCSV } = require('convert-array-to-csv');
const converter = require('convert-array-to-csv');


const results = [];
var filtered = [];
var filtered02 = [];


go_next();

const header = ["ID", "Old title", "Title","Parent", "Old Element"];

function go_next() {
  fs.createReadStream('wc-product-export-20-7-2021-1626784429913 - wc-product-export-20-7-2021-1626784429913 (1).csv')
    .pipe(csv())
    .on('data', (data) => results.push(data))
    .on('end', () => {
      for(let i = 0; i < results.length; i++){
        if(true){
          // if(results[i].Type == "variable"){
          if(true){

            var title = results[i].Name.toString().replace("–", "-");
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

            //600mm Wide - 1600mm High Curved Chrome Electric Heated Towel Rail Radiator
            var str = title;
            var height = str.split('mm High')[0];
            height = height.split(" - "); height = height[height.length-1];
            var width = str.split('mm Wide')[0];

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

            let breaking_point = "r - ";
            let attribute_ending = "";
            if (title.includes(breaking_point)) {
              attribute_ending = title.split(breaking_point);
              attribute_ending = " - " + attribute_ending[attribute_ending.length-1];
            }

            let new_title = `${small}${colour}${electric} Heated Towel Rail Radiator ${width}mm x ${height}mm ${type}${brand}${attribute_ending}`;

            if (title.includes("Victoria")) {
              new_title = title;
            }
            console.log(new_title);
            // if (title.includes("gt")) {
            //
            //   console.log(title);
            // }

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
                ""    // Object.values(results[i])
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
