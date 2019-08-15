const fs = require('fs');
const getResults = require('./sample.js');
(async () => {
    let results = await getResults()
    let jsonString = JSON.stringify(results);
    fs.writeFileSync('./statOutput.json', jsonString, 'utf-8');
})()