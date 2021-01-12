const { response } = require('express');

const Medico = require('../models/medico');


const getMedicos = async ( req, resp = response ) => {

    const medicos = await Medico.find()
                                .populate('usuario', 'nombre')
                                .populate('hospital','nombre')

    // const medicos = await Medico.find()
    //                             .populate([
    //                                 {
    //                                     path: 'usuario',
    //                                     model: 'Usuario'
    //                                 },
    //                                 {
    //                                     path: 'hospital',
    //                                     model: 'Hospital'
    //                                 }
    //                             ])

    resp.json({
        ok: true,
        medicos
    })

}

const crearMedico = async ( req, resp = response ) => {

    const uid = req.uid;
    const medico = new Medico({
        usuario: uid,
        ...req.body
    });
    
    try {

        const medicoDB = await medico.save();

        resp.json({
            ok: true,
            medico: medicoDB
        })
        
    } catch (error) {

        console.log(error);
        resp.status(500).json({
            ok: false,
            msg: 'Hable con el administrador.'
        });
        
    }

}

const actualizarMedico = async ( req, resp = response ) => {

    const id = req.params.id;
    const uid = req.uid;

    try {

        const medicoDB = await Medico.findById( id );

        if ( !medicoDB ) {

            return resp.status(404).json({
                ok: false,
                msg: 'no existe el Medico'
            });
            
        }

        const cambiosMedico = {
            ...req.body,
            usuario: uid
        }

        const medicoActualizado = await Medico.findByIdAndUpdate( id, cambiosMedico, { new: true });

        resp.status(200).json({
            ok: true,
            Medico: medicoActualizado
        });

        resp.status(200).json({
            ok: true,
            msg: 'actualizarMedico'
        });
        
    } catch ( error ) {
        console.error( error );

        resp.status(500).json({
            ok: false,
            msg: 'Hable con el administrador'
        });
        
    }

}

const eliminarMedico = async ( req, resp = response ) => {

    const id = req.params.id;

    try {

        const medicoDB = await Medico.findById( id );

        if ( !medicoDB ) {

            return resp.status(404).json({
                ok: false,
                msg: 'no existe el Medico'
            });
            
        }

        await Medico.findByIdAndDelete( id );

        resp.status(200).json({
            ok: true,
            msg: 'Medico eliminado.'
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
    getMedicos,
    crearMedico,
    actualizarMedico,
    eliminarMedico
}