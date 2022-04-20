const express = require('express');
const { dbConnection } = require('./database/config');
require('dotenv').config();
const cors = require('cors');


//? CREAR EL SERVIDOR DE EXPRESS
const app = express();

//? BASE DE DATOS
dbConnection();

//? CORS
app.use( cors() );

//? DIRECTORIO PUBLICO
app.use( express.static( 'public' ));

//? LECTURA Y PARSEO DEL BODY
// las peticiones que vienen en formato json, procesarlo y extraer su contenido
app.use( express.json() );

//? RUTAS
//auth: crear, login, renew
// crud : eventos
app.use('/api/auth', require('./routes/auth'));
app.use('/api/events', require('./routes/events'));

//? ESCUCHAR PETICIONES
app.listen( process.env.PORT, () => {
  console.log(`Servidor corriendo en puerto ${ process.env.PORT }`)
}) 