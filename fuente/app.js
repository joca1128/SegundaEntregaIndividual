const express = require("express");
const app =express();
const path = require("path");
const hbs = require("hbs");
require("./helpers");

const directorioPublico = path.join(__dirname,"../publico");
const directoriopartials = path.join(__dirname,"../parciales");

app.use(express.static(directorioPublico));
hbs.registerPartials(directoriopartials);

app.set("view engine","hbs");

app.get("/",(req,res)=>{
    res.render("index");
});

app.get("/crear",(req,res)=>{
    try {
            res.render("crear",{
                nombre:req.query.nombre,
                id:Number(req.query.id),
                descripcion:req.query.descripcion,
                valor:Number(req.query.valor),
                modalidad:req.query.modalidad,
                intensidad_horaria:Number(req.query.intensidad_horaria)
            });
    }
    catch{        
        res.render("crear");
    }
});

app.get("/ver",(req,res)=>{
    res.render("ver");
});

app.get("/inscribirse",(req,res)=>{
    try{
        console.log(req.query);
        res.render("inscribirse",{
            nombre:req.query.nombre,
            cedula:Number(req.query.cedula),
            correo:req.query.correo,
            curso:String(req.query.curso),
            telefono:Number(req.query.telefono)
        });
    }
    catch{
        res.render("inscribirse");
    }
});

app.get("/inscripciones",(req,res)=>{
    try{
        res.render("inscripciones",{
            cancelar:Number(req.query.cancelar)
        })
    }
    catch{
        res.render("inscripciones");
    }
});

app.get("/eliminar",(req,res)=>{
    try{
        res.render("eliminar",{
            cedula:Number(req.query.cedula),
            curso:req.query.curso
        })
    }
    catch{
        res.render("eliminar");
    }
});

app.listen(3000,()=>{
    console.log("Escuchando por el puerto 3000");
});