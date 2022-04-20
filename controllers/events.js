const { request, response } = require('express');
const Evento = require('../models/Evento');


//? GET EVENTOS
const getEventos = async( req = request, res = response ) => {

  const eventos = await Evento.find()
                              .populate('user', 'name');
  res.json({
    ok: true,
    msg: 'get eventos',
    eventos,
  });
}

//? CREAR EVENTO
const crearEvento = async(req = request, res = response ) => {

  const evento = new Evento( req.body );

  try {

    evento.user = req.uid;

    const eventoGuardado = await evento.save();

    res.json({
      ok: true,
      evento,
    })
    
  } catch (err) {
    console.log(err)
    res.status(500).json({
      ok: false,
      msg: 'Hable con el administrador',
    })
  }
}

//? ACTUALIZAR EVENTO
const actualizarEvento = async( req = request, res = response ) => {

  const eventoId = req.params.id;
  const { uid } = req;

  try {
    const evento = await Evento.findById( eventoId );

    // validaciones

    if( !evento ) {
      return res.status(404).json({
        ok: false,
        msg: 'evento no existe por ese id',
      });
    }

    if( evento.user.toString() !== uid ) {
      return res.status(401).json({
        ok: false,
        msg: 'no tiene privilegio de editar este evento',
      });
    }

    // actualizar
    const nuevoEvento = {
      ...req.body,
      user: uid,
    }

    const eventoActualizado = await Evento.findByIdAndUpdate( eventoId, nuevoEvento, { new: true });

    res.json({
      ok: true,
      evento: eventoActualizado,
    });

  } catch (err) {
    console.log(err);
    res.status(500).json({
      ok: false,
      msg: 'Hable con el administrador',
    });
  }

}
//? ELIMINAR EVENTO
const eliminarEvento = async ( req = request, res = response ) => {

  const eventoId = req.params.id;
  const { uid } = req;

  try {
    const evento = await Evento.findById( eventoId );

    // validaciones

    if( !evento ) {
      return res.status(404).json({
        ok: false,
        msg: 'evento no existe por ese id',
      });
    }

    if( evento.user.toString() !== uid ) {
      return res.status(401).json({
        ok: false,
        msg: 'no tiene privilegio para eliminar  este evento',
      });
    }


    await Evento.findByIdAndDelete( eventoId);

    res.json({
      ok: true,
    });

  } catch (err) {
    console.log(err);
    res.status(500).json({
      ok: false,
      msg: 'Hable con el administrador',
    });
  }
}

module.exports = {
  getEventos,
  crearEvento,
  actualizarEvento,
  eliminarEvento,
}