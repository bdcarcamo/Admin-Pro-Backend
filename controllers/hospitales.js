const { response } = require('express');

const Hospital = require('../models/hospital');


const getHospitales = async( req, resp = response ) => {

    const hospitales = await Hospital.find()
                                        .populate('usuario','nombre email');

    resp.json({
        ok: true,
        hospitales
    })

}

const crearHospital = async( req, resp = response ) => {

    const uid = req.uid;
    const hospital = new Hospital({
        usuario: uid,
        ...req.body
    });

    try {

        const hospitalDB = await hospital.save();
        
        resp.status(200).json({
            ok: true,
            hospital: hospitalDB
        })

    } catch (error) {
        console.log(error);
        
        resp.status(500).json({
            ok: false,
            msg: 'hable con el administrador'
        })
    }

}

const actualizarHospital = ( req, resp = response ) => {

    resp.status(200).json({
        ok: true,
        msg: 'actualizarHospital'
    })

}

const eliminarHospital = ( req, resp = response ) => {

    resp.status(200).json({
        ok: true,
        msg: 'eliminarHospital'
    })

}

module.exports = {
    getHospitales,
    crearHospital,
    actualizarHospital,
    eliminarHospital
}