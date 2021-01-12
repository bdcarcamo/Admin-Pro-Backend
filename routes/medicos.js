/**
 * 
 * Medicos
 * Ruta: '/api/medicos'
 * 
 */
const { Router } = require('express');
const { check } = require('express-validator');
const { validarCampos } = require('../middleware/validar-campos');
const { validarJWT } = require('../middleware/validar-jwt');

const { getMedicos, crearMedico, actualizarMedico, eliminarMedico } = require('../controllers/medicos');


const router = Router();

router.get('/',
    [],
    getMedicos
);

router.post('/',
    [
        validarJWT,
        check('nombre','El Nombre del Medico es obligatorio.').not().isEmpty(),
        check('hospital','El hospital-id debe ser válido.').isMongoId(),
        validarCampos
    ],
    crearMedico
);

router.put('/:id',
    [
        validarJWT,
        check('nombre','El Nombre del Medico es obligatorio.').not().isEmpty(),
        check('hospital','El hospital-id debe ser válido.').isMongoId(),
        validarCampos
    ],
    actualizarMedico
);

router.delete('/:id',
    [
        validarJWT
    ],
    eliminarMedico
);


module.exports = router;