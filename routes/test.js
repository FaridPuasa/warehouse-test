const fastcsv = require("fast-csv");
const fs = require("fs");
const ws = fs.createWriteStream("data.csv");

const jsonData = [ 
  { id: 1,
    name: 'Node.js',
    description: 'JS web applications',
    created_at: '2021-09-02' },
  { id: 2,
    name: 'Vue.js',
    description: 'for building UI',
    created_at: '2021-09-05' },
  { id: 3,
    name: 'Angular.js',
    description: 'for building mobile & desktop web app',
    created_at: '2021-09-08' } ];

fastcsv
  .write(jsonData, { headers: true })
  .on("finish", function() {
    console.log("Write to CSV successfully!");
  })
  .pipe(ws);