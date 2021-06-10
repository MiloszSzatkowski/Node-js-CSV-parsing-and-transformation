const csv = require('csv-parser')
var fs = require('fs');
var util = require('util');
var log_file = fs.createWriteStream(__dirname + '/new_output04.log', {flags : 'w'});
var log_stdout = process.stdout;

console.log = function(d) { //
  log_file.write(util.format(d) + '\n');
  log_stdout.write(util.format(d) + '\n');
};
const results = [];

var filtered = [];

var new_prices = [];

console.log('[');


fs.createReadStream('ebay_new_prices.csv')
  .pipe(csv())
  .on('data', (data) => new_prices.push(data))
  .on('end', () => {
    go_next();
  });

function go_next() {
  fs.createReadStream('filtered_file.csv')
    .pipe(csv())
    .on('data', (data) => results.push(data))
    .on('end', () => {
      console.log(results[0]);
      for(let i = 0; i < results.length; i++){
        if (i===0) {
          filtered.push([
            "ID",
            "REPLACED_DI",
            "SKU",
            "OLD PRICE",
            "NEW_PRICE_RAW",
            "ebaySKU",
            "DIFFERENCE",
            "CALC_NO_VAT",
            "PARENT"
          ]);
        }
        if((results[i].Regular_price !== "") && (results[i].ID !== "") && (results[i].SKU !== "")){
          let new_price = "";
          new_price = look_for_index(results[i], new_prices);
          if(results[i].ID != undefined){
            // filtered.push({"ID": results[i].ID, "ID_replace" :  results[i].ID.replace("\n", "") ,"SKU": results[i].SKU, "OLD_PRICE" : results[i].Regular_price,
            // "NEW_PRICE_RAW": new_price[0], "ebaySKU": new_price[1], "DIFFERENCE": ((new_price[0]*1.2)-results[i].Regular_price),
            // "CALC_NO_VAT": ( (new_price[0]-5)*0.83), "PARENT": results[i].Parent});
            filtered.push([
              results[i].ID,
              results[i].ID.replace("\n", ""),
              results[i].SKU,
              results[i].Regular_price,
              new_price[0],
              new_price[1],
              ((new_price[0]*1.2)-results[i].Regular_price),
              ((new_price[0]-5)*0.83),
              results[i].Parent
            ]);
          }
        }
      }
      for (var i = 0; i < filtered.length; i++) {

        console.log(filtered[i]);
        console.log(',');

      }
      // console.log(util.inspect(myObject, false, null, true /* enable colors */))
  });
}

console.log(']');


function look_for_index (item, array){
  let temp_arr = [];
  let test = "";
  for (var k = 0; k < array.length; k++) {
    if (array[k].CustomLabel == item.SKU) {
      temp_arr.push(array[k].StartPrice);
      test = test + array[k].CustomLabel + " # ";
    }
  }
  let temp_price  = "";
  if(temp_arr.length > 2) {
    if (temp_arr[1] > temp_arr[0] ) {
       temp_price = temp_arr[1] ;
    } else {
       temp_price = temp_arr[0];
    }
  } else {
    temp_price = temp_arr[0] ;
  }
  return [temp_price, test];
}
