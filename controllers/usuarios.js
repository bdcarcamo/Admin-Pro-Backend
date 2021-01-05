const { response } = require('express');
const bcrypt = require('bcryptjs');

const Usuario = require( '../models/usuario');
const { generarJWT } = require('../helpers/jwt');

/**
 * 
 * OBTENER USUARIOS
 * 
 */
const getUsuarios = async( req, resp ) => {

    const usuarios = await Usuario.find( {}, 'nombre email role google' );

    resp.json({
        ok: true,
        usuarios
    })
}

/*
 * CREAR USUARIOS 
 */
const crearUsuarios = async( req, resp = response ) => {

    const { email, password } = req.body;

    try {

        const existeEmail = await Usuario.findOne({ email });

        if ( existeEmail ) {
            return resp.status(400).json({
                ok: false,
                msg: 'El correo ya está registrado.'
            });
        }

        const usuario = new Usuario( req.body );
        // Encriptar contraseña
        const salt = bcrypt.genSaltSync();
        usuario.password = bcrypt.hashSync( password, salt );

        console.log( usuario );
        

        // Guardar usuario
        await usuario.save();

        // Generar el token
        const token = await generarJWT( usuario._id );
        
        resp.json({
            ok: true,
            usuario,
            token
        });
        
    } catch (error) {
        console.log(error);
        resp.status(500).json({
            ok: false,
            msg: 'Error inesperado, revisar logs'
        })
    }
    
}

const actualizarUsuario = async( req, resp = response ) => {

    // TODO: Validar token y comprobar si es el usuario correcto.

    const uid = req.params.id;

    try {

        const usuarioDB = await Usuario.findById( uid );

        if ( !usuarioDB ) {

            return resp.status(404).json({
                ok: false,
                msg: 'No existe el usuario'
            })
            
        }

        // Actualizaciones
        const { pasword, google, email, ...campos } = req.body;
        if ( usuarioDB.email !== email ) {

            const existeEmail = await Usuario.findOne( { email } );
            if ( existeEmail ) {
                return resp.status(400).json({
                    ok: false,
                    msg: 'Ya existe un usuario con ese Email.'
                })
            }
        }

        campos.email = email;

        const usuarioActualizado = await Usuario.findByIdAndUpdate( uid, campos, { new: true} );

        resp.status(200).json({
            ok: true,
            usuarioActualizado
        });
        
    } catch (error) {
        console.log(error);
        resp.status(500).json({
            ok: false,
            msg: 'Error al actualizar usuario... revisar logs'
        })
    }
}

const borrarUsuario = async ( req, resp = response ) => {

    const uid = req.params.id;

    try {

        const usuarioDB = await Usuario.findById( uid );

        if ( !usuarioDB ) {

            return resp.status(404).json({
                ok: false,
                msg: 'No existe el usuario'
            })
            
        }

        await Usuario.findByIdAndDelete( uid );

        resp.status(200).json({
            ok: true,
            msg: 'Usario Eliminado!'
        })
        
    } catch (error) {
        console.log(error);
        resp.status(400).json({
            ok: false,
            msg: 'Error, no se elimino el usuario.'
        })
        
    }

}

module.exports = {
    getUsuarios,
    crearUsuarios,
    actualizarUsuario,
    borrarUsuario
}