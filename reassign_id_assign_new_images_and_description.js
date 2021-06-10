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


bathroom_wisdom_save();
go_myhomeware();

function bathroom_wisdom_save() {
  fs.createReadStream('BW_id_sku_name.csv')
    .pipe(csv())
    .on('data', (data) => results.push(data))
    .on('end', () => {


      bathroom_wisdom = results;


      results = [];

  });
}

// const header = ["ID","Name","Description","Parent","SKU"];
const header = ["ID","SKU","Name","Short_description","Description","Images","Parent", "New_Title", "Bath_Title"];

function go_myhomeware() {
  results = [];
  fs.createReadStream('MH_export_images_description - MH_export_images_description.csv')
    .pipe(csv())
    .on('data', (data) => results.push(data))
    .on('end', () => {

      try {

        for(let i = 0; i < results.length; i++){


        if((results[i].Name.includes("Radiator"))
              && !(results[i].SKU.includes("MYRAD")) && !(results[i].SKU.includes("BOSTER")) && !(results[i].SKU.includes("-T-"))
            && !(results[i].SKU.includes("-VALV"))    && !(results[i].SKU.includes("TER"))    ){

            var listed = false;

            if (look_for_id(results[i].SKU, results[i].Name, bathroom_wisdom)  !== "not listed") {
              var new_title = look_for_id(results[i].SKU, results[i].Name, bathroom_wisdom)[0];
              var old_BW_title = look_for_id(results[i].SKU, results[i].Name, bathroom_wisdom)[2];
              var id_from_sku = look_for_id(results[i].SKU, results[i].Name, bathroom_wisdom)[1];
              listed = true;
              // console.log(id_from_sku);
            }

            var desc = results[i].Description;
            desc = desc.replace("/\r?\n|\r/g","</br>");

            var short_desc = results[i].Short_description.toString().replace("/\r?\n|\r/g","</br>");
            if (results[i].Description.includes("BTU")) {
              // console.log(desc);
            }


            if(  listed  ){

              filtered.push([

                id_from_sku, //results[i].ID,
                results[i].SKU,
                results[i].Name,
                short_desc,
                desc,
                results[i].Images,
                results[i].Parent,
                new_title,
                old_BW_title

              ]);
              // console.log(results[i].Images);
            }
          }
        }
      } catch (e) {
        console.log(e);

      }

      var csvFromArrayOfArrays = convertArrayToCSV(filtered, {
        header,
        separator: '$'
      });

      fs.writeFile('./BW_new_Images_Desc.csv', csvFromArrayOfArrays, function (err) {
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
