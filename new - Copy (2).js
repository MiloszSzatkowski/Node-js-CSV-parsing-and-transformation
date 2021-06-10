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

var valves = '<p style="text-align: left"><strong>Straight or Angled?</strong></br>If your pipework is coming up <strong>from the ground</strong>, then <strong>straight radiator valves</strong> are used. Whereas if it is coming <strong>from the wall</strong> at an angle, <strong>angled valves</strong> are used.</p><p style="text-align: left"><strong>TRV or Regular?</strong></br>Thermostatic Radiator Valves (TRVs) have an in-built temperature sensor, that keeps the room temperature at a constant level. Regular valves are effectively the same as taps – you turn the valve to control the temperature of the room.</p>';
var pfs = 'Standard Electric Element:</br></br>They have a fixed temperature electrical cartridge element with a built-in thermostat. They also incorporate a thermal fuse as a safety feature.</br></br>IP55 IP Rating</br>Comes With Chrome and White Cover Caps</br>No Controller , But Can be Turned On and Off From The Wall Switch (works in fixed intervals, turns off periodically after reaching the maximum temperature)</br>1.5mt Flex Cable Attached';
var gt = 'GT Thermostatic Element:</br></br>The electrical element senses the internal water temperature. This gives you surface temperature control.</br></br>Made of high-quality components,</br>Possibility of fine temperature regulation,</br>Easy positioning of temperature regulation button within the field of vision,</br>Indicator lamp can be seen from all the angles,</br>Safety junction between the radiator and the device,</br>Completely protected from eventual over-heating by a thermic safety fuse</br>1.5mt Flex Cable Attached';
var moa = 'MOA Thermostatic Element:</br></br>The electrical element senses the internal water temperature. This gives you surface temperature control.</br></br>Offers 5 temperature settings ranging from 30°C to 60°C.</br>Equipped with an electronic temperature sensor that guarantees precise temperature control. </br>The MOA Displays the currently set temperature level and the status of the heating cycle using an LED indicator.</br>The heating element has a very low power consumption in a standby mode.</br>IP Rating - IP54</br>2 Hours Drying Timer Function Built-in</br>1.5mt Flex Cable Attached';
var ktx = 'KTX3 Electric Element + a Timer:</br></br>The electrical element senses the internal water temperature. This gives you surface temperature control.</br></br>The KTX 3 offers adjustable temperature levels ranging from 30°C to 60°C in steps of 1°C. </br>An electronic temperature sensor guarantees precise temperature control. </br>The device displays the current set temperature level and indicates the status of the heating cycle or standby state. </br>It also has an easy interface for controller programming (you can set it up to turn on during different time intervals) </br></br>IPx5 IP Rating</br>LCD display with actual time (clock) and temperature</br>7/24 Weekly Programmable </br>1.5mt Flex Cable Attached';

const results = [];

var filtered = [];
var filtered02 = [];


var new_prices = [];

function look_btu(width , height, colour) {
  var final_btu = '';
  for (var i = 0; i < btu.length; i++) {
    var w = btu[i].WIDTH;
    var h = btu[i].HEIGHT;
    if (w == width && h == height ) {
      if (colour) {  final_btu = btu[i].COLOUR;  }
      else {         final_btu = btu[i].CHROME;  }
      break;
    }
  }
  return "BTU/h: " + final_btu ;
}

go_next();

const header = ["ID","SKU","Name","Description","Parent"];

function go_next() {
  fs.createReadStream('export_098.csv')
    .pipe(csv())
    .on('data', (data) => results.push(data))
    .on('end', () => {
      for(let i = 0; i < results.length; i++){
        if((results[i]._name.includes("Radiator")) && !(results[i].SKU.includes("DIVA"))
            && !(results[i].SKU.includes("CAPO"))  && !(results[i].SKU.includes("AMELIA"))  && !(results[i].SKU.includes("EVERLY"))  && !(results[i].SKU.includes("SYDNEY"))
              && !(results[i].SKU.includes("MYRAD")) && !(results[i].SKU.includes("BOSTER")) && !(results[i].SKU.includes("-T-"))   && !(results[i].SKU.includes("-VALV"))
            && !(results[i].SKU.includes("-VALV"))    && !(results[i].SKU.includes("TER"))   && !(results[i]._name.includes("Aluminium"))    ){
          // const header = ["ID","Title,Date",'"Post Type"','"Attribute 2 name"','"Attribute 2 value(s)'","Description","Parent","SKU","_width","_height","'Product categories'","Type"];

          var temp_btu= "";
          var colour = false;
          if (results[i]._name.includes("Chrome")) {
            colour = true;
          }

          var desc = "";
          if (results[i]._name.includes("Electric")) {
            if (results[i]._name.includes("Standard")) {
              desc = pfs;
            } else if (results[i]._name.includes("GT")) {
              desc = gt;
            } else if (results[i]._name.includes("MOA")) {
              desc = moa;
            } else if (results[i]._name.includes("KTX3")) {
              desc = ktx;
            }
          } else if (results[i]._name.includes("Valves")){
            desc = valves;
          }

          // if(results[i].Post_Type !== "product"){ temp_btu = look_btu(results[i]._width, results[i]._height, colour)}

          // const header = ["ID","SKU,"Name","Description","Parent"];

          // console.log( results[i] );

          if( !(results[i]._name.includes ("Radiator Only")) ){
            filtered.push([
              results[i].﻿id,
              results[i].SKU,
              results[i]._name,
              desc,
              results[i].Parent
            ]);
          } else {
            filtered02.push([

            ]);
          }
        }

      }
      var csvFromArrayOfArrays = convertArrayToCSV(filtered, {
        header,
        separator: '$'
      });

      var csvFromArrayOfArrays02 = convertArrayToCSV(filtered02, {
        header,
        separator: '$'
      });

      // console.log(csvFromArrayOfArrays);

      fs.writeFile('./main_file_mh.csv', csvFromArrayOfArrays, function (err) {
        if (err) return console.log(err);
      });

      fs.writeFile('./main_file02_mh.csv', csvFromArrayOfArrays02, function (err) {
        if (err) return console.log(err);
      });
      // for (var i = 0; i < filtered.length; i++) {
      //
      //   console.log(filtered[i].toString());
      //
      // }
      // console.log(util.inspect(myObject, false, null, true /* enable colors */))
  });
}
