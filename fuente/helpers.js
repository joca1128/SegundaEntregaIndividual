const hbs = require("hbs");
const fs = require("fs");
listaCursos=[];
listaEstudiantes=[];

function guardar(){
    let datos=JSON.stringify(listaCursos);
    fs.writeFile("publico/listado.json",datos,(err)=>{
        if (err) throw (err);
        console.log("Archivo creado con exito!!!!");
    })
}


function listar(){
    try{
        listaCursos=require("../publico/listado.json");
    }
    catch{
        listaCursos=[];
    }
};

function guardarest(){
    let datos=JSON.stringify(listaEstudiantes);
    fs.writeFile("publico/listadoEstudiantes.json",datos,(err)=>{
        if (err) throw (err);
        console.log("Archivo creado con exito para guardar estudiante!!!!");
    })
}


function listarest(){
    try{
        listaEstudiantes=require("../publico/listadoEstudiantes.json");
    }
    catch{
        listaEstudiantes=[];
    }
};

hbs.registerHelper("listar",()=>{listar();listarest();})

hbs.registerHelper("guardarest",(nombre,cedula,correo,curso,telefono)=>{
    let off = listaCursos.find(cur=>cur.nombre===curso);
    if(off){
        let estud={
            nombre, 
            cedula,
            correo,
            curso,
            telefono
        };   
        let duplicado = listaEstudiantes.find(function (est) { return est.curso===curso && est.cedula===cedula});
        if(!duplicado){
            listaEstudiantes.push(estud);
            guardarest();
            return "<p>Estudiante inscrito con exito!!</p>";  
        }
        else{
            return "<p>Estudiante con esta cedula ya está inscrito en este curso!!!</p>";
        }
    }
    else{
        return "<p>Este curso no existe</p>";
    }
})

hbs.registerHelper("guardar",(nombre,id,descripcion,valor,modalidad,intensidad_horaria)=>{
    let curso={
        nombre,
        id,
        descripcion,
        valor,
        modalidad,
        intensidad_horaria,
        estado:"Disponible"
    };
    let duplicado = listaCursos.find(cur => cur.id===id);
    if(!duplicado){
        listaCursos.push(curso);
        guardar();
        return "<p>Curso inscrito con exito!!</p>";
    }
    else{
        return "<p>Ya existe un curso con ese id</p>";
     }
})



hbs.registerHelper("mostrarCursos",()=>{
    let texto = "<table align=center border=1px solid black> \
                <thead> \
                <th> Nombre </th> \
                <th> Descripcion </th> \
                <th> Valor </th> \
                <th> Estado </th> \
                <thead>\
                <tbody>";
    listaCursos.forEach(element => {
        texto= texto +
                "<tr>"+
                "<td>" +element.nombre+"</td>"+
                "<td>"+element.descripcion+"</td>"+
                "<td>"+element.valor+"</td>"+
                "<td>"+element.estado+"</td>"+
                "<td><button id="+String(element.id+100)+" onclick=funcion("+element.id+") >Ver Información Completa</button></td></tr>"
    });
    texto=texto+"</tbody></table>";
    listaCursos.forEach(element => {
        texto= texto +
                "<div id="+String(element.id)+ " style=display:none>\
                <table border=1px solid black > \
                <thead> \
                <th> Nombre </th> \
                <th> id </th> \
                <th> Descripcion </th> \
                <th> Valor </th> \
                <th> Modalidad </th> \
                <th> Intensidad Horaria en horas </th> \
                <th> Estado </th> \
                <thead>\
                <tbody >"+
                "<tr>"+
                "<td>" +element.nombre+"</td>"+
                "<td>" +element.id+"</td>"+
                "<td>"+element.descripcion+"</td>"+
                "<td>"+element.valor+"</td>"+
                "<td>" +element.modalidad+"</td>"+
                "<td>" +element.intensidad_horaria+"</td>"+
                "<td>"+element.estado+"</td>"+
                "<td></td></tr></tbody></table></div>"
    });
    return texto;
});

hbs.registerHelper("mostrarEstudiantesCursos",()=>{
    let listaC = listaCursos.filter(c=> c.estado==="Disponible")
    let texto = "<form action=/inscripciones?cancelado method=get>\
                <table align=center border=1px solid black> \
                <thead> \
                <th> Nombre </th> \
                <th> Descripcion </th> \
                <th> Valor </th> \
                <th> Estado </th> \
                <thead>\
                <tbody>";
    listaC.forEach(element => {
        texto= texto +
                "<tr>"+
                "<td>" +element.nombre+"</td>"+
                "<td>"+element.descripcion+"</td>"+
                "<td>"+element.valor+"</td>"+
                "<td>"+element.estado+"</td>"+
                "<td><button type=button id="+String(element.id+Number(100))+" onclick=funcion("+element.id+") >Ver Estudiantes Inscritos En Este Curso</button></td>"+
                "<td><button type=submit id="+String(element.id+Number(200))+" name=cancelar value="+String(element.id+Number(200))+">Cancelar Curso</button></td></tr>"
    });
    texto=texto+"</tbody></table></form>";
    listaC.forEach(element=>{
        let persona=listaEstudiantes.filter(per=>per.curso===element.nombre);
        texto=texto+
        "<div id="+String(element.id)+ " style=display:none>\
        <table border=1px solid black > \
                <thead> \
                <th> Nombre </th> \
                <th> Cédula </th> \
                <th> Correo </th> \
                <th> Curso </th> \
                <th> Teléfono </th> \
                <thead>\
                <tbody >";
                persona.forEach(estudiante=>{
                texto=texto+"<tr>"+
                "<td>" +estudiante.nombre+"</td>"+
                "<td>"+estudiante.cedula+"</td>"+
                "<td>"+estudiante.correo+"</td>"+
                "<td>"+estudiante.curso+"</td>"+
                "<td>"+estudiante.telefono+"</td>"+
                "</tr>"
                });
        texto=texto+"</tbody></table></div>";
    });
    return texto;
});

hbs.registerHelper("cancelarCurso",(id)=>{
    id=id-200;
    let cursera=listaCursos.find(curso=>curso.id===id);
    cursera.estado="Cancelado";
    guardar();
});

hbs.registerHelper("eliminar",(cedula,id)=>{
    let lista=listaEstudiantes.filter(function(est){ return (est.curso!==id  || est.cedula!==cedula);});
    if(lista.length<listaEstudiantes.length){
        listaEstudiantes=lista;
        guardarest();
        return "<h4>SE ELIMINO EL ESTUDIANTE CON CÉDULA "+String(cedula)+" DEL CURSO "+String(id)+"</h4>";
    }
    else{
        return "<h4>NO HAY NINGÚN ESTUDIANTE CON ESA CEDULA EN ESE CURSO</h4>";
    }
        
});

hbs.registerHelper("mostrarEstudiantesCur",()=>{
    let listaC = listaCursos.filter(c=> c.estado==="Disponible")
    let texto = "<table align=center border=1px solid black> \
                <thead> \
                <th> Nombre </th> \
                <th> Descripcion </th> \
                <th> Valor </th> \
                <th> Estado </th> \
                <thead>\
                <tbody>";
    listaC.forEach(element => {
        texto= texto +
                "<tr>"+
                "<td>" +element.nombre+"</td>"+
                "<td>"+element.descripcion+"</td>"+
                "<td>"+element.valor+"</td>"+
                "<td>"+element.estado+"</td>"+
                "<td><button type=button id="+String(element.id+Number(100))+" onclick=funcion("+element.id+") >Ver Estudiantes Inscritos En Este Curso</button></td></tr>"
    });
    texto=texto+"</tbody></table>";
    listaC.forEach(element=>{
        let persona=listaEstudiantes.filter(per=>per.curso===element.nombre);
        texto=texto+
        "<div id="+String(element.id)+ " style=display:none>\
        <table border=1px solid black > \
                <thead> \
                <th> Nombre </th> \
                <th> Cédula </th> \
                <th> Correo </th> \
                <th> Curso </th> \
                <th> Teléfono </th> \
                <thead>\
                <tbody >";
                persona.forEach(estudiante=>{
                texto=texto+"<tr>"+
                "<td>" +estudiante.nombre+"</td>"+
                "<td>"+estudiante.cedula+"</td>"+
                "<td>"+estudiante.correo+"</td>"+
                "<td>"+estudiante.curso+"</td>"+
                "<td>"+estudiante.telefono+"</td>"+
                "</tr>"
                });
        texto=texto+"</tbody></table></div>";
    });
    return texto;
});


hbs.registerHelper("Desplegar",()=>{
    let texto="<datalist id=\"cursos\">";
    listaCursos.forEach(element => {
        texto=texto+"<option value="+String(element.nombre)+">";
    });
    texto = texto + "</datalist>";
    return texto;
})
