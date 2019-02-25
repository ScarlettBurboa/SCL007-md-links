'use strict';
const fs = require("fs");
const chalk = require('chalk'); //eliminar require por import y export como se hizo en la red social
const path = require('path');
const marked = require('marked');
const _ = require('lodash');
const fetch = require('node-fetch');
const logSymbols = require('log-symbols');
//-------------------------------------------------------

const pathUrl = process.argv[2];
const option = process.argv[3];

let readFileAndExtract = (pathUrl) =>{
  return new Promise((res, rej) =>{
    let urlAbsoluteResolved = path.resolve(pathUrl);
    let extensionFile = path.extname(urlAbsoluteResolved);
       if(extensionFile === '.md'){
        var markdown = fs.readFileSync(urlAbsoluteResolved).toString();
        var links = markdownLinkExtractor(markdown);        
        links.forEach(function (link) {
            res(console.log(link));
        });
      }else{
        rej(error);
      }
  })  
};
let checkStatusLinks = (arrayLinks) =>{

}

let checkStatsLinks = (arrayLinks) =>{

}
let mdlinks = (pathUrl, option) => {
  return new Promise((res, rej) =>{
      if(option === undefined){
        res(readFileAndExtract(pathUrl));
        }else if(option === '--validate' || option === '--v'){
            res(console.log('soy la opción --validate'));
        }else if(option === '--stats' || option === '--s'){
            res(console.log('soy la opción --stats'));
        }else if(option === '--validate --stats' || option === '--v --s'){
            res(console.log('soy la opción --validate and --stats'));
        }else{
          rej(error);
        }
  });         
}
mdlinks(pathUrl, option).then((response) => {
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
              result = `Nombre: ${link.text} :  ${link.href} // Status: ${(link.status)} ${(logSymbols.success)}`;
            } else {
              result = `Nombre: ${link.text} : ${link.href} // Status: ${(link.status)} ${(logSymbols.error)}`;
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
function markdownLinkExtractor(markdown){
    var links = [];
    var renderer = new marked.Renderer();
    // Taken from https://github.com/markedjs/marked/issues/1279
    var linkWithImageSizeSupport = /^!?\[((?:\[[^\[\]]*\]|\\[\[\]]?|`[^`]*`|[^\[\]\\])*?)\]\(\s*(<(?:\\[<>]?|[^\s<>\\])*>|(?:\\[()]?|\([^\s\x00-\x1f()\\]*\)|[^\s\x00-\x1f()\\])*?(?:\s+=(?:[\w%]+)?x(?:[\w%]+)?)?)(?:\s+("(?:\\"?|[^"\\])*"|'(?:\\'?|[^'\\])*'|\((?:\\\)?|[^)\\])*\)))?\s*\)/;
    marked.InlineLexer.rules.normal.link = linkWithImageSizeSupport;
    marked.InlineLexer.rules.gfm.link = linkWithImageSizeSupport;
    marked.InlineLexer.rules.breaks.link = linkWithImageSizeSupport;
    
 renderer.link = function (href, title, text) {
        // links.push(title)
            links.push(`- ${text}:  (${href})`);
 
 };
    renderer.image = function (href, title, text) {
        // Remove image size at the end, e.g. ' =20%x50'
        href = href.replace(/ =\d*%?x\d*%?$/, "");
        links.push(`- ${text}:  (${href})`);
 };

    marked(markdown, { renderer: renderer });
     return links;
   
}; 
