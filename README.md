# Markdown Links!

![md-links](img/mdlinks.gif?raw=true "mdLinks")

## ¿Para qué sirve este módulo?

Este módulo fue creado para programadores que necesiten extraer links, desde un archivo .md o [Markdown](https://es.wikipedia.org/wiki/Markdown). Este tipo de lenguaje de marcado es muy popular en plataformas que manejan texto plano, como por ejemplo los README.md en Github. 

En base a esto, este pequeño módulo, extrae de forma ordenada todos los links, que se encuentren en el archivo tipo **Markdown**, también permite al programador, saber el estado de estos links (_200, 404, entre otros_), además de contar cuantos links, estan rotos o disponibles.

#### Requisitos:

- Tener NodeJS instalado. 

## Instalación 

- En el caso de que desees clonar este repositorio, simplemente deberás escribir en tu consola :

`$ npm install`

- En el caso de querer instalarlo en tu proyecto es muy sencillo. En tu consola (_obviamente posicionado en tu proyecto :smile;_ ) deberás escribir la siguiente línea de comando : 

`npm install --save https://github.com/ScarlettBurboa/SCL007-md-links.git`

Esto hará que se instalen las dependencias, para que el módulo funcione correctamente. Este módulo tiene una función principal llamada mdlinks, que tiene dos parametros **PathUrl** : _Es el parámetro que recibe la dirección del archivo_  y **Option** : _Que es el parámetro que recibe la opción `--validate o --stats`._

```js
mdLinks(pathUrl, option);
```

### ¿Para qué sirven estas opciones? 

- `--validate o --v` : Sirve para entregar la validacion o status de los links (status: 200, 404, etc). Por ejemplo: 

```sh
Línea: 51 -  npm-scripts : https://www.google.com/holacomoestas // ✓ 200 OK

Línea: 52 -  semver : https://semver.org/  // ✓ 200 OK

Línea: 69  - Jest : https://jestjs.io/ // X 404 Not Found 
```

- `--stats o --s` : Sirve para entregar la cantidad de links que se encuentran en buen estado y cuantos están rotos, además del total de links encontrados en el archivo.md 

```sh
- Unique : 2
- Broken: 1
- Total : 3
```
## ¿Cómo funciona? 

Primero deberás crear un archivo JS (_por ejemplo: index.js_) o también puede trabajar sobre el archivo el cual estás trabajando actualmente. Dentro de archivo JS deberás copiar y pegar el siguiente código. 

```js
const mdlinks = require('mdlinks').mdlinks;

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
```

Si por ejemplo tienes un archivo **.md** en tu carpeta principal del proyecto, deberás ingresar este comando en tu consola:

`node index.js ./README.md`

- Donde **index.js** es el archivo donde tenemos integrado el codigo entregado anteriormente y **./README.md** es la dirección donde se encuentra el archivo. Al ejecutar este comando la terminal entregará en el resultado una lista con la **línea** donde encontró este link, el **nombre** del link, y por ultimo la **URL** de este link. 

```sh
- Línea: 51 -  npm-scripts : https://www.google.com/holacomoestas
- Línea: 52 -  semver : https://semver.org/
- Línea: 69 -  Jest : https://jestjs.io/ 
```

Para ver los "status" de estos links, deberemos ejecutar la opcion `--validate o --v` ambas son válidas y entregarán el mismo resultado, entonces ejecutaremos en la consola el siguiente comando:  

`node index.js ./README.md --v`

Y el resultado será lo mismo que el anterior, pero se suman el status de los links, por ejemplo: 

```sh
Línea: 51 -  npm-scripts : https://www.google.com/holacomoestas // ✓ 200 OK
Línea: 52 -  semver : https://semver.org/  // ✓ 200 OK
Línea: 69  - Jest : https://jestjs.io/ // X 404 Not Found 
```

Para ver la cantidad de links, rotos y buenos, solo deberemos ejecutar la opcion ``--stats o --s` en el siguiente comando. 

`node index.js ./README.md --s`

Y el resultado que entregará la consola será el siguiente: 

```sh
- Unique : 2
- Broken: 1
- Total : 3
```

