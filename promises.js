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

const markdownLinkExtractor = (markdown, lineNumber) =>{
  var links = [];
  var renderer = new marked.Renderer();
  // Taken from https://github.com/markedjs/marked/issues/1279
  var linkWithImageSizeSupport = /^!?\[((?:\[[^\[\]]*\]|\\[\[\]]?|`[^`]*`|[^\[\]\\])*?)\]\(\s*(<(?:\\[<>]?|[^\s<>\\])*>|(?:\\[()]?|\([^\s\x00-\x1f()\\]*\)|[^\s\x00-\x1f()\\])*?(?:\s+=(?:[\w%]+)?x(?:[\w%]+)?)?)(?:\s+("(?:\\"?|[^"\\])*"|'(?:\\'?|[^'\\])*'|\((?:\\\)?|[^)\\])*\)))?\s*\)/;
  marked.InlineLexer.rules.normal.link = linkWithImageSizeSupport;
  marked.InlineLexer.rules.gfm.link = linkWithImageSizeSupport;
  marked.InlineLexer.rules.breaks.link = linkWithImageSizeSupport;
  renderer.link = function (href, title, text, line) {
      links.push({
        text : text, 
        href : href,
        line : lineNumber
      });
  };
  renderer.image = function (href, title, text, line) {
      // Remove image size at the end, e.g. ' =20%x50'
      href = href.replace(/ =\d*%?x\d*%?$/, "");
      links.push({
        text : text, 
        href : href,
        line : lineNumber
      }); 
  };
  marked(markdown, {renderer: renderer});
    return links;   
}; 

let readDirectoryOrFileAndExtract = (pathUrl) =>{
    let urlAbsoluteResolved = path.resolve(pathUrl);
     if (fs.lstatSync(urlAbsoluteResolved).isDirectory() === true){
      /* console.log("soy una carpeta"); */
      fs.readdirSync(urlAbsoluteResolved).forEach(file => {
/*         console.log(file);  */
        if (fs.lstatSync(urlAbsoluteResolved + "/" + file).isDirectory() === true || path.extname(urlAbsoluteResolved + "/" + file) === ".md"){
          readDirectoryOrFileAndExtract(urlAbsoluteResolved + "/" + file); 
        }else {
          const emptyArray = [];
          console.log(chalk.magenta('Ups encontramos un error \n - El archivo ingresado no es de extención .md, favor ingresar otro archivo \n - El directorio que ingresaste no contiene archivos con extensión .md \n - Saludos!!! :)'));
          return emptyArray;
        }
      }); 
    } else if (fs.lstatSync(urlAbsoluteResolved).isFile() === true && path.extname(urlAbsoluteResolved) === ".md"){
        var markdownRead = fs.readFileSync(urlAbsoluteResolved).toString().split('\n');
        var links = markdownRead.reduce((init, element, index) => init.concat(markdownLinkExtractor(element, index + 1)),[]); 
        return links; 
        
    }
};

let resultWithOption = () =>{
let result = readDirectoryOrFileAndExtract(pathUrl);
result.map(function (link) {
         console.log(`- Línea: ${chalk.blue(link.line)} - ${chalk.bold(link.text)} : ${chalk.green(link.href)}`);
    });  
}

let checkStatusLinks = () =>{ 
let validate = readDirectoryOrFileAndExtract(pathUrl);
validate.map(function(element){ 
  fetch(element.href).then(res =>{
    if(res.status === 200){      
      console.log((`- Línea: ${chalk.blue(element.line)} - ${element.href} `), chalk.green.bold(`// ✓ ${res.status} ${res.statusText}`));
    }else if(res.status === 404){
      console.log((`- Línea: ${chalk.blue(element.line)} - ${element.href} `), chalk.red.bold(`// X ${res.status} ${res.statusText}`));
    } 
  }).catch(err =>{
      console.log((`- Línea: ${chalk.blue(element.line)} - ${element.href} `), chalk.blue.bold(`// ✓ link OK, pero no se encuentra certificado`));
  });
});
}

let checkStatsLinks = async () =>{
  let validateStats = readDirectoryOrFileAndExtract(pathUrl);
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
  console.log(`- Unique : ${chalk.green(unique)}`);
  console.log(`- Broken: ${chalk.red(broken)}`);
  console.log(`- Total : ${chalk.yellow(unique + broken)}`);
}

let mdlinks = (pathUrl, option, optionNext) => {
  return new Promise((res, rej) =>{
      if(option === undefined){
          res(resultWithOption());         
      }else if(option === '--validate' || option === '--v'){
          res(checkStatusLinks());
      }else if(option === '--stats' || option === '--s'){
          res(checkStatsLinks());
      }else{
          rej('\n La opción que ingresaste no es válida. \n - Prueba con --v / --validate \n - Prueba con --s / -- stats \n');
        }
  });         
}
mdlinks(pathUrl, option, optionNext).then((response) => {
  console.log(response); 
}, (error) =>{
   console.log(error);
});