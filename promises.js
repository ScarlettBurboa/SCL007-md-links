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
        return emptyArray;
        console.log('El archivo ingresado no es de extención .md, favor ingresar otro archivo. Saludos! :)')
      }
};

let result = () =>{
let result = readFileAndExtract(pathUrl);
    result.forEach(function (link) {
      console.log(`${chalk.bold(link.text)} : (${chalk.blue(link.href)})`);
    });
}

let checkStatusLinks = () =>{ 
let arrayValidate = [];
let validate = readFileAndExtract(pathUrl);
let validateFor = validate.map(function(element){ 
  fetch(element.href).then(res =>{
    if(res.status === 200){
      console.log(chalk.green(`- ${element.href} // ${res.status} ${res.statusText}`));
    }else if(res.status === 404){
      console.log(chalk.red(`- ${element.href} // ${res.status} ${res.statusText}`));
    } 
  }).catch(err =>{
      console.log(chalk.magenta(`- ${element.href} // Certificado no Definido`));
  });
});
}
let checkStatsLinks = () =>{
  let unique = 0;
  let broken = 0;
  let total = '';
}
let mdlinks = (pathUrl, option, optionNext) => {
  return new Promise((res, rej) =>{
      if(option === undefined){
          res(result());         
      }else if(option === '--validate' || option === '--v'){
          res(checkStatusLinks());
      }else if(option === '--stats' || option === '--s'){
          res(console.log('soy la opción --stats'));
      }else if(option === '--validate' && optionNext === '--stats'){
          res(console.log('soy la opción --validate and --stats'));
      }else if(option === '--v' && optionNext === '--s'){
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
// if(require == module){ console.log(comprar si es el primer modulo, solo el primer modulo dara true los demas no)}
/* let checkStatus = (linksArray) => {
    let arrayLinksLength = linksArray.length;
    const options = {};
    console.log(options);
    if (validate === undefined) {
      options.validate = false;
    } else if (validate.indexOf('--validate') !== -1) {
      options.validate = true;
    }
    if (stats === undefined) {
      options.stats = false;
    } else if (stats.indexOf('--stats') !== -1) {
      options.stats = true;
    }
    let unique = 0;
    let broken = 0;
    let total = linksArray.length;
  
    linksArray.forEach(link => {
      fetch(link.href).then(response => {
          arrayLinksLength--;
          let result = '';
          link.status = response.status;
          if (options.validate) {
            if (link.status === 200) {
              result = `Nombre: ${link.text} :  ${link.href} // Status: ${(link.status)} ${(.success)}`;
            } else {
              result = `Nombre: ${link.text} : ${link.href} // Status: ${(link.status)} ${(.error)}`;
            }
          } else {
            result = `Nombre: ${link.text} :  ${link.href}`;
          }
          if (options.stats) {
            if (link.status === 200) {
              unique++;
            } else {
              broken++;
            }
          }
          console.log(result);
          if (options.stats) {
            if (arrayLinksLength === 0) {
              console.log(`${('STATS: Unique ->')} ${(unique)} \n ${('Broken ->')} ${(broken)}`);
            }
          }
        }).catch(error => {
          console.log(error);
        });
    });
  };
//  checkStatus(links, pathUrl);
  */