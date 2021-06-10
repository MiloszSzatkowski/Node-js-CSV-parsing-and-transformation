const csv = require('csv-parser')
var fs = require('fs');
var util = require('util');
var btu_main = require('./btu.js');
var btu = btu_main.btu;

const { convertArrayToCSV } = require('convert-array-to-csv');
const converter = require('convert-array-to-csv');

var log_file = fs.createWriteStream(__dirname + '/new_output05.csv', {flags : 'w'});
var log_stdout = process.stdout;

console.log = function(d) { //
  log_file.write(util.format(d) + '\n');
  log_stdout.write(util.format(d) + '\n');
};

const results = [];

var filtered = [];

var new_prices = [];

function look_btu(width , height, colour) {
  var final_btu = '';
  for (var i = 0; i < btu.length; i++) {

    if (btu[i].WIDTH == width && btu[i].HEIGHT == height ) {
      if (colour) {  final_btu = btu[i].COLOUR;  }
      else {         final_btu = btu[i].CHROME;  }
      break;
    }

  }

  if (final_btu !== "") {
    return "BTU/h: " + final_btu ;
  } else {
    return "";
  }

}

go_next();

const header = ["ID","Name",'Type','"Attribute 2 name"', '"Attribute 2 value(s)"' ,   '"Attribute 2 visible"'  , '"Attribute 2 global"'  ,   "Parent", "SKU", "Radiator_width", "Radiator_height", "Colour"];

// Attribute 2 name	Attribute 2 value(s)	Attribute 2 visible	Attribute 2 global
// BTU	              BTU/h: 1376          	1	                  1


function _includes(array_string, str_compare) {
  for (let o = 0; o < array_string.length; o++) {
    if (array_string[o].includes(str_compare)) {
      return true;
    }
  }
  return false;
}

function go_next() {
  fs.createReadStream('MH export 02 06 2021 BW import - MH export 02 06 2021 BW import.csv')
    .pipe(csv())
    .on('data', (data) => results.push(data))
    .on('end', () => {
      for(let i = 0; i < results.length; i++){

        if(true){
          var temp_btu= "";
          var colour = true;

          if (results[i].Name.includes("Chrome")) {
            colour = false;
          }

          var has_normal_btu = false;


          if (  results[i].Type == "variable" && !(results[i].Categories.includes("Designer")) && !(results[i].Categories.includes("Accessories"))
            && !(_includes(["0-BLCK", "0-WHT", "0-CHRM", "10mm-15mm", "-STNDRD", "-T-", "BOSTER", "DIVA", "CAPO"], results[i].SKU))  ) {
            temp_btu = look_btu(parseFloat(results[i].Width_cm), parseFloat(results[i].Height_cm), colour);
            console.log(temp_btu);
            // console.log(results[i].Width_cm);
            has_normal_btu = true;
          }

          var ww = (results[i].Width_cm + "mm").replace(" ", "");
          var hh = (results[i].Height_cm + "mm").replace(" ", "");


          var title = results[i].Name.toString();
          var clll;

          if(title.includes('Black')){
            clll  = "Matt Black";
          } else if (title.includes('Chrome')) {
            clll  = "Chrome";
          } else if (title.includes('Anthracite')) {
            clll  = "Anthracite Grey";
          } else if (title.includes('White')) {
            clll  = "White";
          } else if (title.includes('Eloksal')) {
            clll  = "Champagne";
          }


          if(has_normal_btu){
            console.log('here');

            filtered.push([
              results[i].ID,
              results[i].Name,
              results[i].Type,

              // Attribute 2 name	Attribute 2 value(s)	Attribute 2 visible	Attribute 2 global
              // BTU	              BTU/h: 1376          	1	                  1

              "BTU",
              temp_btu,
              1,
              1,

              results[i].Parent,
              results[i].SKU,
              ww,
              hh,
              clll
            ]);
          } else {
            // console.log('has BTU');
            filtered.push([
              results[i].ID,
              results[i].Name,
              results[i].Type,

              '',
              '',
              '',
              '',

              results[i].Parent,
              results[i].SKU,
              ww,
              hh,
              clll
            ]);
          }

        }
      }

      console.log('');
      console.log("Initial " + results.length);
      console.log("Filtered " + filtered.length);
      console.log('');

      var csvFromArrayOfArrays = convertArrayToCSV(filtered, {
        header,
        separator: '$'
      });

      // console.log(csvFromArrayOfArrays);

      fs.writeFile('./BW_BTU.csv', csvFromArrayOfArrays, function (err) {
        if (err) return console.log(err);
      });
  });
}
