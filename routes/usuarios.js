/**
 * Ruta: /api/usuarios
 */
const { Router } = require('express');
const { check } = require('express-validator');
const { validarCampos } = require('../middleware/validar-campos');
 const { validarJWT } = require('../middleware/validar-jwt');

const { getUsuarios, crearUsuarios, actualizarUsuario, borrarUsuario } = require( '../controllers/usuarios' );

const router = Router();

router.get('/', validarJWT, getUsuarios );

router.post('/',
    [
        check('nombre', 'El Nombre es obligatorio.').not().isEmpty(),
        check('password', 'El Password es obligatorio.').not().isEmpty(),
        check('email', 'El Email es obligatorio.').isEmail(),
        validarCampos,
    ],
    crearUsuarios
);

router.put('/:id',
[
    validarJWT,
    check('nombre', 'El Nombre es obligatorio.').not().isEmpty(),
    check('email', 'El Email es obligatorio.').isEmail(),
    check('role', 'El Role es obligatorio.').not().isEmpty(),
    validarCampos,
]
,actualizarUsuario );

router.delete('/:id',
[
    validarJWT,
    check('id', 'El id es obligatorio.').not().isEmpty(),
    validarCampos,
]
,borrarUsuario );


module.exports = router;