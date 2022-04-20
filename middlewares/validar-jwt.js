const { request, response } = require('express');
const jwt = require('jsonwebtoken');

const validarJWT = ( req = request, res = response, next ) => {
  // token personalizados empiezan con x-<nombre>

  // leer el token "x-token" en los headers

  const token = req.header('x-token');

  // validar si token se envio
  if( !token ) {
    return res.status(401).json({
      ok: false,
      msg: 'No hay token en la peticion'
    });
  }

  // verificar token
  try {
    const { uid, name } = jwt.verify( 
      token, 
      process.env.SECRET_JWT_SEED
    );

    req.uid = uid;
    req.name = name;
    
  } catch (error) {
    return res.status(401).json({
      ok: false,
      msg: 'Token no valido',
    })
  }

  next();
}

module.exports = {
  validarJWT,
}