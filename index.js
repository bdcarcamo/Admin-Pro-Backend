const express = require('express');
const cors = require('cors');

require('dotenv').config();
const { ConectionDB } = require('./database/config');

// Crear el servidor de express
const app = express();

// Configurar CORS
app.use(cors());

// Base de datos
ConectionDB();


// Rutas
app.get('/', ( req, resp ) => {

    resp.json({
        ok: true,
        msg: 'hola mundo'
    })
});


app.listen( process.env.PORT, () => {
    console.log('Server Listo en el puerto: ' + process.env.PORT );
})