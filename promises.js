'use strict';
const fs = require("fs");
const chalk = require('chalk'); //eliminar require por import y export como se hizo en la red social
const path = require('path');
const marked = require('marked');
const fetch = require('node-fetch');
//-------------------------------------------------------
const pathUrl = process.argv[2];
const option = process.argv[3];
const optionNext = process.argv[4];

const markdownLinkExtractor = (markdown) =>{
  var links = [];
  var renderer = new marked.Renderer();
  // Taken from https://github.com/markedjs/marked/issues/1279
  var linkWithImageSizeSupport = /^!?\[((?:\[[^\[\]]*\]|\\[\[\]]?|`[^`]*`|[^\[\]\\])*?)\]\(\s*(<(?:\\[<>]?|[^\s<>\\])*>|(?:\\[()]?|\([^\s\x00-\x1f()\\]*\)|[^\s\x00-\x1f()\\])*?(?:\s+=(?:[\w%]+)?x(?:[\w%]+)?)?)(?:\s+("(?:\\"?|[^"\\])*"|'(?:\\'?|[^'\\])*'|\((?:\\\)?|[^)\\])*\)))?\s*\)/;
  marked.InlineLexer.rules.normal.link = linkWithImageSizeSupport;
  marked.InlineLexer.rules.gfm.link = linkWithImageSizeSupport;
  marked.InlineLexer.rules.breaks.link = linkWithImageSizeSupport;
  renderer.link = function (href, title, text) {
      // links.push(title)
      links.push({text, href});
  };
  renderer.image = function (href, title, text) {
      // Remove image size at the end, e.g. ' =20%x50'
      href = href.replace(/ =\d*%?x\d*%?$/, "");
      links.push({text, href}); 
  };
  marked(markdown, {renderer: renderer});
    return links;   
}; 

let readFileAndExtract = (pathUrl) =>{
    let urlAbsoluteResolved = path.resolve(pathUrl);
    let extensionFile = path.extname(urlAbsoluteResolved);
       if(extensionFile === '.md'){
        var markdown = fs.readFileSync(urlAbsoluteResolved).toString();
        var links = markdownLinkExtractor(markdown); 
        return links  //agrega un else       
      }else{
        const emptyArray = [];
        console.log('El archivo ingresado no es de extención .md, favor ingresar otro archivo. Saludos! :)');
        return emptyArray;     
      }
};

let resultWithOption = () =>{
let result = readFileAndExtract(pathUrl);
    result.forEach(function (link) {
      console.log(`${chalk.bold(link.text)} : (${chalk.blue(link.href)})`);
    });
}

let checkStatusLinks = () =>{ 
let validate = readFileAndExtract(pathUrl);
validate.map(function(element){ 
  fetch(element.href).then(res =>{
    if(res.status === 200){      
      console.log((`- ${element.href} `), chalk.green.bold(`// ✓ ${res.status} ${res.statusText}`));
    }else if(res.status === 404){
      console.log((`- ${element.href} `), chalk.red.bold(`// X ${res.status} ${res.statusText}`));
    } 
  }).catch(err =>{
      console.log((`- ${element.href} `), chalk.blue.bold(`// ✓ link OK, pero no se encuentra certificado`));
  });
});
}

let checkStatsLinks = async () =>{
  let validateStats = readFileAndExtract(pathUrl);
  let arrayStats = [];
  let unique = 0;
  let broken = 0;
  await Promise.all(validateStats.map(async function(element){ 
    await fetch(element.href).then(res =>{
      arrayStats.push(element);
      if(res.status === 200){unique++;} else if(res.status === 404){broken++; } 
    }).catch(err =>{
        unique++;
    });
  }));
  console.log(`- Unique : ${unique}`);
  console.log(`- Broken: ${broken}`);
  console.log(`- Total : ${unique + broken}`);
}

let mdlinks = (pathUrl, option, optionNext) => {
  return new Promise((res, rej) =>{
      if(option === undefined){
          res(resultWithOption());         
      }else if(option === '--validate' || option === '--v'){
          res(checkStatusLinks());
      }else if(option === '--stats' || option === '--s'){
          res(checkStatsLinks());
      }else if(option === '--stats' && optionNext === '--validate'){
          res(console.log('soy la opción --validate and --stats'));
      }else if(option === '--s' && optionNext === '--v'){
          res(console.log('soy la opción --validate and --stats'));
      }else{
          rej(error);
        }
  });         
}

mdlinks(pathUrl, option, optionNext).then((response) => {
  console.log(response); 
}, (error) =>{
   console.log(error);
});
