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

const actualizarHospital = async ( req, resp = response ) => {

    const id = req.params.id;
    const uid = req.uid;

    try {

        const hospitalDB = await Hospital.findById( id );

        if ( !hospitalDB ) {

            return resp.status(404).json({
                ok: false,
                msg: 'no existe el Hospital'
            });
            
        }

        const cambiosHospital = {
            ...req.body,
            usuario: uid
        }

        const hospitalActualizado = await Hospital.findByIdAndUpdate( id, cambiosHospital, { new: true });

        resp.status(200).json({
            ok: true,
            Hospital: hospitalActualizado
        });
        
    } catch (error) {

        console.error( error );
     
        resp.status(500).json({
            ok: false,
            msg: 'hable con el administrador'
        });
    }

}

const eliminarHospital = async ( req, resp = response ) => {

    const id = req.params.id;

    try {

        const hospitalDB = await Hospital.findById( id );

        if ( !hospitalDB ) {

            return resp.status(404).json({
                ok: false,
                msg: 'no existe el Hospital'
            });
            
        }

        await Hospital.findByIdAndDelete( id );

        resp.status(200).json({
            ok: true,
            msg: 'Hospital eliminado.'
        });
        
    } catch (error) {

        console.error( error );
     
        resp.status(500).json({
            ok: false,
            msg: 'hable con el administrador'
        });
    }

}

module.exports = {
    getHospitales,
    crearHospital,
    actualizarHospital,
    eliminarHospital
}