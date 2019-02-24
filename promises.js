'use strict';
const fs = require("fs");
const chalk = require('chalk');
const path = require('path');
const marked = require('marked');
const _ = require('lodash');

const pathUrl = './README.md';
const option = '--validate';

let readFile = (pathUrl) => {
    return new Promise((res, rej) => {
        let urlAbsoluteResolved = path.resolve(pathUrl);
        let extensionFile = path.extname(urlAbsoluteResolved);
           if(extensionFile === '.md'){
            fs.readFile(urlAbsoluteResolved, 'utf-8', (error, data) => {
                if(error){
                    console.log('Este archivo no puede ser leido, intenta con otro. Gracias! :)')
                }
                return res(chalk.blue(data));
            });
            }else{
               rej(chalk.red('El archivo que ingresó no es de extención .md, favor ingresar un archivo válido. Gracias! :)'));
            }      
    });    
}
 let extractLinks = (resultRaedFile) =>{     
     return new Promise((res, rej) =>{
     })
}

 readFile(pathUrl).then((response) => {
    console.log(response);
 }, (error) =>{
     console.log(error)
})

 let statusLinks = new Promise((res, rej) =>{
     res('muestra estatus de links de la función extractLinks');
     rej('No muestra links');
 })

 let statsLinks = new Promise((res, rej) =>{
     res('muestra cantidad de links, buenos y malos')
     rej('no muestra nada');
 }) 

 let functionMdlinks = new Promise((res, rej) =>{
     res('función que muestra links mediante opciones, opción vacia, opcion --validate y opcion --stats ');
     rej('no se ejecuto funcion');
 });

/* function markdownLinkExtractor(markdown) {
    var links = [];

    var renderer = new marked.Renderer();

    // Taken from https://github.com/markedjs/marked/issues/1279
    var linkWithImageSizeSupport = /^!?\[((?:\[[^\[\]]*\]|\\[\[\]]?|`[^`]*`|[^\[\]\\])*?)\]\(\s*(<(?:\\[<>]?|[^\s<>\\])*>|(?:\\[()]?|\([^\s\x00-\x1f()\\]*\)|[^\s\x00-\x1f()\\])*?(?:\s+=(?:[\w%]+)?x(?:[\w%]+)?)?)(?:\s+("(?:\\"?|[^"\\])*"|'(?:\\'?|[^'\\])*'|\((?:\\\)?|[^)\\])*\)))?\s*\)/;

    marked.InlineLexer.rules.normal.link = linkWithImageSizeSupport;
    marked.InlineLexer.rules.gfm.link = linkWithImageSizeSupport;
    marked.InlineLexer.rules.breaks.link = linkWithImageSizeSupport;
    
 renderer.link = function (href, title, text) {
        // links.push(title);
        links.push(text);
        links.push(href);
    };
    renderer.image = function (href, title, text) {
        // Remove image size at the end, e.g. ' =20%x50'
        href = href.replace(/ =\d*%?x\d*%?$/, "");
        links.push(href);
        links.push(title);
        links.push(text);
 };
    marked(markdown, { renderer: renderer });
     return links;
};

let mdlinks = (pathUrl, option) => {
    return new Promise((res, rej) => {
        let urlAbsoluteResolved = path.resolve(pathUrl);
        let extensionFile = path.extname(urlAbsoluteResolved);
           if(extensionFile === '.md'){
            fs.readFile(urlAbsoluteResolved, 'utf-8', (error, data) => {
                if(error){
                    console.log('Este archivo no contiene links, pruebe con otro archivo. Gracias! :)')
                }
                let links = markdownLinkExtractor(data);
                return res(chalk.blue(links));
            });
            }else{
               rej(chalk.red('El archivo que ingresó no es de extención .md, favor ingresar un archivo válido. Gracias! :)'));
            }      
    });
    
}
module.exports = {
    mdlinks
} */

