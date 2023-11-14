const { response , request} = require('express');

const usuariosGet = (req = request, res = response) => {
    const {q, nombre='No Name', apikey, page='1', limit} = req.query;

    res.json({
        msg: 'get API - controlador',
        q,
        nombre, 
        apikey,
        page,
        limit

    });
}

const usuariosPut =(req, res= response) => {

    const id = req.params.id;

    res.json({ 
        msg: 'put API - controlador',
        id
    })
}
const usuariosPost = (req, res= response) => {

    const {nombre, edad, id, apellido} = req.body;
 
    res.json({ 
        msg: 'post API - controlador',
        nombre,
        edad, id, apellido
    })
}
const usuariosDelete =  (req, res= response) => {
    res.json({ 
        msg: 'delete API - controlador'
    })
}

const usuariosPatch =(req, res= response) => {
    res.json({ 
        msg: 'patch API - controlador'
    })
}



module.exports = {
    usuariosGet,
    usuariosPut,
    usuariosPost,
    usuariosDelete,
    usuariosPatch
}