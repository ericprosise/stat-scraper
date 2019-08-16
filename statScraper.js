const fs = require('fs');
const getResults = require('./scraper.js');
(async () => {
    let results = await getResults()
    let jsonString = JSON.stringify(results);
    fs.writeFileSync('./statOutput.json', jsonString, 'utf-8');
})()