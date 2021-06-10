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

var new_prices = [];

go_next();

var counter;

// const header = ["ID","Name","Description","Parent","SKU"];
const header = ["ID","Name","Short_Description","Parent","SKU"];

function go_next() {
  fs.createReadStream('10052021.csv')
    .pipe(csv())
    .on('data', (data) => results.push(data))
    .on('end', () => {
      for(let i = 0; i < results.length; i++){

        if(   true    ){

          counter = false;

          var desc = "";
          if (results[i].Name.includes("Electric")) {
            if (results[i].Name.includes("Standard")) {
              desc = pfs;
              counter = true;
            } else if (results[i].Name.includes("GT")) {
              desc = gt;
              counter = true;
            } else if (results[i].Name.includes("MOA")) {
              desc = moa;
              counter = true;
            } else if (results[i].Name.includes("KTX3")) {
              desc = ktx;
              counter = true;
            }
          } else if (results[i].Name.includes("Valves")){
            desc = valves;
            counter = true;
          }
// short desc
          desc = '<ul><li>Tested For BS EN442 Standards</li>' +
'<li>10 Bar Pressure Tested For Leaks</li>' +
'<li>Triple Layer Finish</li>' +
'<li>Made In EU ( Not Far East )</li>' +
'<li>Fast & Free Dispatch</li>' +
'<li>High Heat-put</li>' +
'<li>Brackets Included</li>' +
'<li>Valves Are Quality </li>' +
'<li>Suitable for Bathroom , Kitchen , Toilet , Cloak Room , Utility room</li>' +
'<li>Extra Slim For Restricted Spaces and Plenty Room For Towels</li> </ul>';

          if((results[i].ID != undefined) && !(counter)){
            filtered.push([
              results[i].ID,
              results[i].Name,
              desc,
              results[i].Parent,
              results[i].SKU
            ]);
          }
        }
      }
      var csvFromArrayOfArrays = convertArrayToCSV(filtered, {
        header,
        separator: '$'
      });

      fs.writeFile('./10052021_csv_MH_short.csv', csvFromArrayOfArrays, function (err) {
        if (err) return console.log(err);
      });

  });
}
