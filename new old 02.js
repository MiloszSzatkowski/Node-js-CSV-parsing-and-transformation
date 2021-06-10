const csv = require('csv-parser')
var fs = require('fs');
var util = require('util');
var log_file = fs.createWriteStream(__dirname + '/fresh.csv', {flags : 'w'});
var log_stdout = process.stdout;

console.log = function(d) { //
  log_file.write(util.format(d) + '\n');
  log_stdout.write(util.format(d) + '\n');
};
const results = [];

var filtered = [];

var new_prices = [];



fs.createReadStream('colours.csv')
  .pipe(csv())
  .on('data', (data) => results.push(data))
  .on('end', () => {
    for(let i = 0; i < results.length; i++){
      if (i===0) {
        filtered.push([
          "ID",
          "Title",
          "Post Type",
          '"Radiator Width"',
          '"Radiator Height"',
          "Parent",
          "Colour",
          "Permalink"
        ]);
      }
      if((results[i].Post_Type == "product")){
        if((results[i].ID != undefined) && results[i]._width.includes("0")){

          var title = results[i].Title.toString();
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

            filtered.push([
              results[i].ID,
              results[i].Title,
              results[i].Post_Type,
              (results[i]._width + "mm"),
              (results[i]._height + "mm"),
              results[i].Parent,
              colour,
              results[i].Permalink
            ]);


        }
      }
    }
    for (var i = 0; i < filtered.length; i++) {

      console.log(filtered[i].toString());

    }
  });
