const { Router } = require('express');
const { check } = require('express-validator');

const { getEventos, crearEvento, actualizarEvento, eliminarEvento } = require('../controllers/events');
const { isDate } = require('../helpers/isDate');
const { validarCampos } = require('../middlewares/validar-campos');
const { validarJWT } = require('../middlewares/validar-jwt');

const router = Router();


/* 
  Events routes
  {host}/api/events
*/

// todas tienen que pasar por la validacion del JWT
//obtener eventos

// router.use( validarJWT );
router.get(
  '/', 
  [
    validarJWT,
  ],
  getEventos,
);

router.post(
  '/', 
  [
    validarJWT,
    check('title', 'el titulo es obligatorio').not().isEmpty(),
    check('start', 'fecha de inicio es obligatoria').custom( isDate ),
    check('end', 'fecha de finalizacion es obligatoria').custom( isDate ),
    validarCampos,
  ],
  crearEvento,
);

// router.use( validarJWT );

router.put(
  '/:id', 
  [
    validarJWT,
    check('title', 'el titulo es obligatorio').not().isEmpty(),
    check('start', 'fecha de inicio es obligatoria').custom( isDate ),
    check('end', 'fecha de finalizacion es obligatoria').custom( isDate ),
    validarCampos,
  ],
  actualizarEvento,
);

router.delete(
  '/:id', 
  [
    validarJWT,
  ],
  eliminarEvento,
);


module.exports = router;