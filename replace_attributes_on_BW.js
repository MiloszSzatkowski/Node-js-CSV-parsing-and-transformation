const csv = require('csv-parser')
var fs = require('fs');
var util = require('util');
var btu_main = require('./btu.js');
var btu = btu_main.btu;

const { convertArrayToCSV } = require('convert-array-to-csv');
const converter = require('convert-array-to-csv');

var results = [];

var filtered = [];

var bathroom_wisdom = [];
var bathroom_wisdom_filtered = [];


bathroom_wisdom_save();

function bathroom_wisdom_save() {
  fs.createReadStream('bw export 07 07.csv')
    .pipe(csv())
    .on('data', (data) => bathroom_wisdom.push(data))
    .on('end', () => {

      for(let i = 0; i < bathroom_wisdom.length; i++){

        let id = bathroom_wisdom[i].ID;

        let bw_name = bathroom_wisdom[i].Name;

        let forbidden = "t - ";

        if (bw_name.includes("Anthracite") && !bw_name.includes(forbidden)) {

          let sku = bw_name.split("mm x ");
          let temp_w = sku[0].split(" "); temp_w = temp_w[temp_w.length-1];
          let temp_h = sku[1].split("mm ")[0];
          sku = "ANT" + temp_w.slice(0, -1) + "-" + temp_h.slice(0, -1);

          // console.log(id);

          //Anthracite Grey Heated Towel Rail Radiator 300mm x 1000mm Straight
          //Anthracite Grey Heated Towel Rail Radiator 300,1000mm Straight
          //Anthracite Grey Heated Towel Rail Radiator 300
          //300
          //30
          //1000mm Straight
          //1000
          //100

          if (bw_name.includes("Electric")) {
              bathroom_wisdom_filtered.push(
              [    id,    bw_name,     sku + "-PFS"   ],
              [    id,    bw_name,     sku + "-PFT-BGT"   ],
              [    id,    bw_name,     sku + "-PFT-BMOA"   ],
              [    id,    bw_name,     sku + "-PFT-BKTX3"   ]
            );
          } else {
              bathroom_wisdom_filtered.push(
              [    id,    bw_name,     sku   ],
              [    id,    bw_name,     sku + "-ANT-SV"   ],
              [    id,    bw_name,     sku + "-ANT-AV"   ]
            );
          }

          // console.log(bathroom_wisdom_filtered[i]);

        }

      }

      // console.log(bathroom_wisdom_filtered);

      go_myhomeware();

  });
}



// const header = ["ID","Name","Description","Parent","SKU"];
const header = ["Old_parent_id","ID",	"Type",	"SKU"	,"Name",	"Published"	,"Visibility_in_catalogue",	"Description",	"Tax_status",	"Tax_class"	,"In_stock",	"Stock",	"Regular_price"	,
"Images",	"Parent",	"Position",	"Attribute_1_name",	"Attribute_1_value",	"Attribute_1_visible",	"Attribute_1_global"];


function go_myhomeware() {
  results = [];
  fs.createReadStream('mh export sepcial.csv')
    .pipe(csv())
    .on('data', (data) => results.push(data))
    .on('end', () => {

      try {

        for(let i = 0; i < results.length; i++){

        if(results[i].Name.includes("Radiator")){

          let id = "";
          var ant = false;

            for (var j = 0; j < bathroom_wisdom_filtered.length; j++) {
              if ( bathroom_wisdom_filtered[j][2] == results[i].SKU) {
                id = bathroom_wisdom_filtered[j][0];
                // console.log(id);
                ant = true;
                break;
              }
            }
              if (ant) {
                filtered.push([
                  results[i].Parent,
                  results[i].ID, //results[i].ID,
                  results[i].Type,
                  results[i].SKU,
                  results[i].Name,
                  results[i].Published,
                  results[i].Visibility_in_catalogue,
                  results[i].Description,
                  results[i].Tax_status,
                  results[i].Tax_class,
                  results[i].In_stock,
                  results[i].Stock,
                  results[i].Regular_price,
                  results[i].Images,
                  "id:" + id, //results[i].Parent,
                  results[i].Position,
                  results[i].Attribute_1_name,
                  results[i].Attribute_1_value,
                  results[i].Attribute_1_visible,
                  results[i].Attribute_1_global
                ]);
              }
              // console.log(results[i].Images);
              // "ID",	"Type",	"SKU"	,"Name",	"Published"	,"Visibility_in_catalogue",	"Description",	"Tax_status",	"Tax_class"	,"In_stock",	"Stock",	"Regular_price"	,
              // "Images",	"Parent",	"Position",	"Attribute_1_name",	"Attribute_1_value",	"Attribute_1_visible",	"Attribute_1_global"
          }
        }
      } catch (e) {
        console.log(e);

      }

      var csvFromArrayOfArrays = convertArrayToCSV(filtered, {
        header,
        separator: '$'
      });

      fs.writeFile('./BW_assign_new_attributes_ant.csv', csvFromArrayOfArrays, function (err) {
        if (err) return console.log(err);
      });

  });
}



function look_for_id (sku, title, bathroom_wisdom_array) {

  if (sku !== "") {
    for (var i = 0; i < bathroom_wisdom_array.length; i++) {
      // console.log(bathroom_wisdom_array[i].ID);
      if (sku == bathroom_wisdom_array[i].SKU ) {
        if (sku !== "") {
          return ["no change", bathroom_wisdom_array[i].ID, bathroom_wisdom_array[i].Name];
        }
      }
    }
  }


  var str = title;
  var width = str.split('mm Wide')[0];
  var height = str.split('mm High')[0].split(" ");
  height = height[height.length-1];

  var remainder_T = str.split('mm High ');
  var remainder = remainder_T[remainder_T.length-1];

  var stopper = "";
  if (str.includes("–")) {
    stopper = "–";
  } else {
    stopper = "-";
  }

  var new_title = height + " mm High - " + width + "mm Wide " + remainder;


  for (var j = 0; j < bathroom_wisdom_array.length; j++) {
    if (new_title == bathroom_wisdom_array[j].Name) {
      console.log(new_title);
      return [new_title, bathroom_wisdom_array[j].ID, bathroom_wisdom_array[j].Name];
    }
  }

  return "not listed";

}
