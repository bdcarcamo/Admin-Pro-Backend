const { response } = require('express');
const bcrypt = require('bcryptjs');

const { generarJWT } = require('../helpers/jwt');

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

module.exports = {
    login
}