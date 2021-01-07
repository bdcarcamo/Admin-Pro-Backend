const fs = require('fs');
const path = require('path');

const { response } = require('express');
const { v4: uuidv4 } = require('uuid');

const { actualizarImagen } = require('../helpers/actualizar-imagen');


const subirArchivo = ( req, resp = response ) => {

    const tipo = req.params.tipo;
    const id = req.params.id;

    const tiposValidos = [ 'medicos', 'usuarios', 'hospitales'];

    if ( !tiposValidos.includes( tipo )) {
        return resp.status(400).json({
            ok: false,
            msg: 'El tipo debe ser medico, usuario u hospital'
        });
    }

    // Validar que exista un archivo
    if (!req.files || Object.keys(req.files).length === 0) {
        return resp.status(400).json({
            ok: false,
            msg: 'No existe ningun archivo.'
        });
    }

    // Procesar la imagen
    const file = req.files.imagen;

    const nombreCortado = file.name.split('.');
    const extensionArchivo = nombreCortado[ nombreCortado.length - 1 ];

    // validar extensión
    extensionesValidas = ['png','jpg','jpeg','gif'];
    if ( !extensionesValidas.includes( extensionArchivo )) {
        return resp.status(400).json({
            ok: false,
            msg: 'No hay una extensión permitida.'
        });
    }

    // nombre del archivo
    const nombreArchivo = `${ uuidv4() }.${ extensionArchivo }`;

    // Path para guardar la imagen
    const path = `./uploads/${ tipo }/${ nombreArchivo }`;

    // Mover la imagen
    file.mv( path, ( err ) => {
        if ( err ){
            console.log(err);
            return resp.status(500).json({
                ok: false,
                msg: 'Error al mover la imagen'
            });
        }

        // actualizar la base de datos
        actualizarImagen( tipo, id, nombreArchivo );
    
        resp.json({
            ok:true,
            msg: 'Archivo súbido',
            nombreArchivo
        });

    });

}

const retornarImagen = ( req, resp = response ) => {

    const tipo = req.params.tipo;
    const img = req.params.img;

    const pathImg = path.join( __dirname, `../uploads/${ tipo }/${ img }` );

    // Imagen por defecto
    if ( fs.existsSync( pathImg ) ) {
        resp.sendfile( pathImg );
    } else {
        const pathImg = path.join( __dirname, `../uploads/no-img.png` );
        resp.sendfile( pathImg );
    }

}

module.exports = {
    subirArchivo,
    retornarImagen
}