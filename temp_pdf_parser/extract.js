const fs = require('fs');
const pdf = require('pdf-parse');

const dataBuffer = fs.readFileSync('../WAREHOUSE MANAGEMENT SYSTEM.pdf');

pdf(dataBuffer).then(function(data) {
    fs.writeFileSync('extracted_wms.txt', data.text);
    console.log('PDF extracted successfully to extracted_wms.txt');
}).catch(err => {
    console.error('Error parsing PDF:', err);
});
