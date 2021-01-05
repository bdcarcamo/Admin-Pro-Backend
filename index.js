const express = require('express');
const cors = require('cors');

require('dotenv').config();
const { ConectionDB } = require('./database/config');

// Crear el servidor de express
const app = express();

// Configurar CORS
app.use( cors() );

// Lectura y parseo del body
app.use( express.json() );

// Base de datos
ConectionDB();


// Rutas
app.use( '/api/usuarios', require('./routes/usuarios') );
app.use( '/api/login', require('./routes/auth') );


app.listen( process.env.PORT, () => {
    console.log('Server Listo en el puerto: ' + process.env.PORT );
})