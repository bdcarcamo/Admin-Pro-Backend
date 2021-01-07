/**
 * 
 * todo/:busqueda
 * Ruta: '/api/upload'
 * 
 */
const { Router } = require('express');
const fileUpload = require('express-fileupload');

const { validarJWT } = require('../middleware/validar-jwt');

const { subirArchivo, retornarImagen } = require('../controllers/uploads');

const router = Router();

router.use(fileUpload());

router.put( '/:tipo/:id', validarJWT, subirArchivo );

router.get( '/:tipo/:img', validarJWT, retornarImagen );

module.exports = router;