const { request, response } = require('express');
const bcrypt = require('bcryptjs');

const Usuario = require('../models/Usuario');
const { generarJWT } = require('../helpers/jwt');


const crearUsuario = async( req = request, res = response ) => {

  const { name, email, password } = req.body;

  try {

    let usuario = await Usuario.findOne({ email });

    if( usuario ) {
      return res.status(400).json({
        ok: false,
        msg: 'Un usuario existe con ese correo',
      })
    }

    usuario = new Usuario( req.body );

    // encriptar contraseña
    const salt = bcrypt.genSaltSync();
    usuario.password = bcrypt.hashSync( password, salt );
    await usuario.save();

    // generar jwt
    const token = await generarJWT( usuario.id, usuario.name );
  
    res.status(201).json({
      ok: true,
      uid: usuario.id,
      name: usuario.name,
      token,
    });
  
  } catch (err) {
    console.log(err);
    res.status(500).json({
      ok: false,
      msg: 'Por favor hable con el administrador'
    });
  }
}

const loginUsuario = async( req, res = response ) => {

  const { email, password } = req.body;

  try {

    const  usuario = await Usuario.findOne({ email });

    if( !usuario ) {
      return res.status(400).json({
        ok: false,
        msg: 'el usuario no existe con ese correo',
        // en otros casos poner algo mas generico, sin pistas
      })
    }

    // confirmar passwords
    const validPassword = bcrypt.compareSync( password, usuario.password );

    if ( !validPassword ) {
      return res.status(400).json({
        ok: false,
        msg: 'Password incorrecto'
      })
    }

    // generar nuestro JWT
    const token = await generarJWT( usuario.id, usuario.name );

    res.json({
      ok: true,
      uid: usuario.id,
      name: usuario.name,
      token,
    })
    
  } catch (err) {
    console.log(err);
    res.status(500).json({
      ok: false,
      msg: 'Por favor hable con el administrador'
    });
  }
  
}

const revalidarToken = async( req, res = response ) => {

  const { uid, name } = req;

// Generar JWT
  try {
    const token = await generarJWT( uid, name );
    res.status(200).json({
      ok: true,
      uid,
      name,
      token,
    })
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      ok: false,
      msg: 'error al generar el token'
    })
  }

  
}


module.exports = {
  crearUsuario,
  loginUsuario,
  revalidarToken,
}