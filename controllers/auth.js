const { response } = require('express');
const bcrypt = require('bcryptjs');

const { generarJWT } = require('../helpers/jwt');
const { googleVerify } = require('../helpers/google-verify');

const Usuario = require('../models/usuario');

const login = async( req, resp  = response ) => {

    try {

        const { email, password } = req.body;

        // Verificar Email
        const usuarioDB = await Usuario.findOne({ email });
        if ( !usuarioDB ) {
            resp.status(404).json({
                ok: false,
                msg: 'Email no valido.'
            });
        }

        // Verificar Contraseña
        const validPassword = bcrypt.compareSync( password, usuarioDB.password );
        if ( !validPassword ) {
            return resp.status(404).json({
                ok: false,
                msg: 'Contraseña no valida.'
            });
        }

        // Generar un token - JWT
        const token = await generarJWT( usuarioDB.id );

        resp.json({
            ok: true,
            msg: 'login correcto',
            token
        });
        
    } catch (error) {
        console.log(error);
        response.status(500).json({
            ok: false,
            msg: 'Hable con el administrador.'
        });
        
    }

}

const googleSingIn = async ( req, resp = response ) => {

    const googleToken = req.body.token;

    try {

        const {name, email, picture } = await googleVerify( googleToken );

        const usuarioDB = await Usuario.findOne({ email });
        let usuario;

        if ( !usuarioDB ) {
            // si no existe
            usuario = new Usuario({
                nombre: name,
                email,
                password: '@@@',
                img: picture,
                google: true
            })
        } else {
            // si existe
            usuario = usuarioDB;
            usuario.google = true
        }

        // guardar en la DB
        await usuario.save();

        // Generar un token - JWT
        const token = await generarJWT( usuario.id );

        resp.json({
            ok: true,
            token
        });
        
    } catch (error) {
        console.error( error );
        resp.status(401).json({
            ok: false,
            msg: 'token no es correcto.',
        });
        
    }
}

module.exports = {
    login,
    googleSingIn
}