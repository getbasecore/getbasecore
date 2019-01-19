# baseCore
Modular, easy to upgrade and high performance HTML framework


## Requisitos:


### Apache:

**OSX**: https://coolestguidesontheplanet.com/get-apache-mysql-php-and-phpmyadmin-working-on-macos-sierra/

** Recordar cambiar etc/apache2/httpd.conf para que la linea de DocumentRoot y Directory se correspondan a la carpeta Sites de tu usuario: **

DocumentRoot "/Users/USUARIO/Sites"

<Directory "/Users/USUARIO/Sites">

De esta manera http://localhost mostrará el contenido de /Users/USUARIO/Sites


### Node
https://nodejs.org/es/download/

### Gulp
https://gulpjs.com

## Configurando
- Ejecutar npm install

## Creación de nuevos proyectos

Para evitar tener varias carpetas node_modules por proyectos usaremos un simlink al repositorio local de baseCore.


- Renombramos el symlink node\_modules-sim a node_modules

- Editamos el archivo config.json ya en la carpeta del proyecto para configurar las rutas correctas en caso de que trabajemos con algún CMS y no sean las mismas.
- Editar la variable "app" indicando la carpeta concreta dentro de Sites donde está el proyecto para que Browsersync pueda hacer de proxy. Ej: /Users/USUARIO/Sites/web = http://localhost/web

## Ejecutando el proyecto

- Ejecutar gulp para lanzar el proyecto en localhost:3000 y listo.