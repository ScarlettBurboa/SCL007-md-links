#!/usr/bin/env node
let mdlinks = require('./promises').mdlinks;

const pathUrl = process.argv[2];
const option = process.argv[3];
const optionNext = process.argv[4];

if(require.main === module){
  mdlinks(pathUrl, option, optionNext).then((response) => {
    console.log(response); 
  }, (error) =>{
     console.log(error);
  });
}
module.exports.mdlinks = mdlinks; 