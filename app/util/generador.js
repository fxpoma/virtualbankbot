const handlebars = require('handlebars')
const fs = require('fs');
const { join } = require('path');

handlebars.registerHelper("inc", function(value, options){
    return parseInt(value) + 1;
});

/**
 * @param {string} plantilla - Nombre del archivo plantilla
 * @param {Object} variables - Variables que recibe esta plantilla
 * @returns {string} - Plantilla generada
*/

function generador(plantilla, {variables=null}={}) {
    let source = fs.readFileSync(join(process.cwd(),'app','views','template',`${plantilla}.hbs`),'utf-8')
    let template = handlebars.compile(source)
    let salida = template(variables)
    return salida
}

module.exports = {
    generador
}
