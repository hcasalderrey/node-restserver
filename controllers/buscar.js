const {response} = require('express');
const { Usuario, Categoria, Producto } = require('../models');
const {ObjectId} = require('mongoose').Types;

const coleccionesPermitidas = [
    'usuarios',
    'categorias',
    'productos',
    'roles'
];

const buscarUsuarios = async(termino = '', res = response) => {
    const esMongoID = ObjectId.isValid(termino); // TRUE

    if(esMongoID){
        const usuario = await Usuario.findById(termino);
        return res.json({
            results: (usuario) ? [usuario] : []
        });
    }

    const regex = new RegExp(termino, 'i'); // i: insensible a mayúsculas y minúsculas

    const usuarios = await Usuario.find({
        $or: [{nombre: regex}, {correo: regex}],
        $and: [{estado: true}]
    });   

    res.json({
        results: usuarios
    });

}


const buscarCategorias = async(termino = '', res = response) => {
    const esMongoID = ObjectId.isValid(termino); // TRUE

    if(esMongoID){
        const categoria = await Categoria.findById(termino).populate('usuario', 'nombre');
        return res.json({
            results: (categoria) ? [categoria] : []
        });
    }

    const regex = new RegExp(termino, 'i'); // i: insensible a mayúsculas y minúsculas

    const categorias = await Categoria.find({nombre: regex, estado: true}).populate('usuario', 'nombre');
        
          

    res.json({
        results: categorias
    });

}

const buscarProducto = async(termino = '', res = response) => {
    const esMongoID = ObjectId.isValid(termino); // TRUE

    if(esMongoID){
        const producto = await Producto.findById(termino)
            .populate('categoria', 'nombre')
            .populate('usuario', 'nombre')
        return res.json({
            results: (producto) ? [producto] : []
        });
    }

    const regex = new RegExp(termino, 'i'); // i: insensible a mayúsculas y minúsculas

    const productos = await Producto.find({nombre: regex, estado: true})
        .populate('categoria', 'nombre')
        .populate('usuario', 'nombre')
        
          

    res.json({
        results: productos
    });

}




const buscar = (req, res = response) => {

    const {coleccion, termino} = req.params;

    if(!coleccionesPermitidas.includes(coleccion)){
        return res.status(400).json({
            msg: `Las colecciones permitidas son: ${coleccionesPermitidas}`
        })
    }

    switch (coleccion) {
        case 'usuarios':
            buscarUsuarios(termino, res);
            break;
    
        case 'categorias':
            buscarCategorias(termino, res);
            break;
    
        case 'productos':
            buscarProducto(termino, res);
            break;
    
        default:
            res.status(500).json({
                msg: 'Se le olvidó hacer esta búsqueda'
            })
            break;
    }

    //res.json({
    //    coleccion,
    //    termino
    //});
}

module.exports = {
    buscar
}
