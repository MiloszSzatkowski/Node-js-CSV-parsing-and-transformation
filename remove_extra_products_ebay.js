const csv = require('csv-parser')
var fs = require('fs');
var util = require('util');

const { convertArrayToCSV } = require('convert-array-to-csv');
const converter = require('convert-array-to-csv');
const header = ["sku", "price"]

const results = [];

var filtered = [];
var filtered02 = [];
var filtered03 = [];


go_first() ;

function go_first() {
  fs.createReadStream('eBay-edit-price-quantity-template-2022-04-13-1335703862 EBAY PRICES ON 13 04 2022 - eBay-edit-price-quantity-template-2022-04-13-1335703862.csv')
    .pipe(csv())
    .on('data', (data) => filtered02.push(data))
    .on('end', () => { go_next(); } )
}

function look_for_duplicates (_sku, _price) {
  let accum = [];
  accum.push(_price);
  for (let j = 0; j < filtered02.length; j++) {
    if (_sku == filtered02[j].SKU) {
      accum.push(filtered02[j].Start_price);
    }
  }
  accum = accum.sort(function(a,b) { return a - b;});
  let all_the_same = accum.every( (val, i, arr) => val === arr[0] ) ;
  if (accum.length > 0 && !all_the_same) {
    let max_price = Math.max(...accum);
    // console.log(max_price);
    return max_price;
  } else {
    return _price;
  }
}

function go_last() {
  fs.createReadStream('eBay-edit-price-quantity-template-2022-04-13-1335703862 EBAY PRICES ON 13 04 2022 - FIND (2).csv')
    .pipe(csv())
    .on('data', (data) => filtered03.push(data))
    .on('end', () => { save_CSV(); } )
}


function go_next() {
  fs.createReadStream('eBay-edit-price-quantity-template-2022-04-13-1335703862 EBAY PRICES ON 13 04 2022 - eBay-edit-price-quantity-template-2022-04-13-1335703862.csv')
    .pipe(csv())
    .on('data', (data) => results.push(data))
    .on('end', () => {

      for(let i = 0; i < results.length; i++){

        let sku = results[i].SKU;
        let price = parseFloat(results[i].Start_price);

        let sku_is_correct = true;

        if (  sku.includes("PFS") || sku.includes("GT") || sku.includes("MOA") || sku.includes("KTX3")
           || sku.includes("TRV") || sku.includes("SV") || sku.includes("AV")      ) {
          sku_is_correct = false;
        }

        if (sku_is_correct) {

          let max_price_on_ebay = look_for_duplicates(sku, price);

          // console.log(max_price_on_ebay);

          filtered.push([
            sku,
            max_price_on_ebay
          ]);
        }

        //PUSH END ****************************************
    }

    filtered = filtered.filter(( t={}, a=> !(t[a]=a in t) ));

    go_last()


  });
}

function save_CSV () {


  var final_arr = [];

  for (let lll = 0; lll < filtered03.length; lll++) {
      for (let ooo = 0; ooo < filtered.length; ooo++) {
        if (filtered03[lll].LIST_NEW_STOCK == "") {
          final_arr.push([
            "",
            ""
          ]);
          break;
        } else if (filtered03[lll].LIST_NEW_STOCK == filtered[ooo][0]) {
          // console.log([filtered03[lll].LIST_NEW_STOCK, filtered[ooo][0]]);
          final_arr.push([
            filtered03[lll].LIST_NEW_STOCK,
            filtered[ooo][1]
          ]);
        }
      }
  }

  console.log(final_arr);


  var csvFromArrayOfArrays = convertArrayToCSV(final_arr, {
    header
  });


  fs.writeFile('./Ebay_sort_products.csv', csvFromArrayOfArrays, function (err) {
    if (err) return console.log(err);
  });

}
