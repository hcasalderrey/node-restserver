const { Router } = require('express');
const { check } = require('express-validator');

 
const { validarCampos } = require('../middlewares/validar-campos');
const { validarJWT } = require('../middlewares');
const { existeProducto, existeCategoria } = require('../helpers/db-validators');
const { obtenerProducto, obtenerProductos, crearProducto, actualizarProducto, borrarProducto } = require('../controllers/productos');

 
/* 
    Path:{{url}}/api/productos
*/


const router = Router();
//obtener todas los productos - publico
router.get('/',   obtenerProductos)

//obtener una categoria por id - publico
router.get('/:id', [
    check('id', 'No es un ID válido').isMongoId(),
    check('id').custom(existeProducto),
    validarCampos
], obtenerProducto)

//crear categoria - privado - cualquier persona con un token valido
router.post('/',[validarJWT,
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    check('categoria', 'No es un ID de categoria válido').isMongoId(),
    check('categoria').custom(existeCategoria),
    validarCampos
], crearProducto)
//actualizar categoria - privado - cualquier persona con un token valido
router.put('/:id', [
    validarJWT,
   check('id').custom(existeProducto),
   // check('categoria', 'No es un ID de categoria válido').isMongoId(),
    validarCampos
], actualizarProducto)
 
//borrar categoria - privado - Admin
router.delete('/:id',  [
    validarJWT, 
    check('id', 'No es un ID válido').isMongoId(),
    check('id').custom(existeProducto),
    validarCampos
],borrarProducto )

 


module.exports = router;