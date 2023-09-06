// Cambio aqui
import Paciente from "../models/Paciente.js"
import mongoose from "mongoose"

const listarPacientes = async (req,res)=>{
    const pacientes = await Paciente.find({estado:true}).where('veterinario').equals(req.veterinarioBDD).select("-salida -createdAt -updatedAt -__v").populate('veterinario','_id nombre apellido')
    res.status(200).json(pacientes)
}


const detallePaciente = async(req,res)=>{
    const {id} = req.params
    if( !mongoose.Types.ObjectId.isValid(id) ) return res.status(404).json({msg:`Lo sentimos, no existe el veterinario ${id}`});
    const paciente = await Paciente.findById(id).select("-createdAt -updatedAt -__v").populate('veterinario','_id nombre apellido')
    res.status(200).json(paciente)
}


/* const registrarPaciente = async(req,res)=>{
    if (Object.values(req.body).includes("")) return res.status(400).json({msg:"Lo sentimos, debes llenar todos los campos"})
    // request.body
    // {
    //     "nombre":"Nose123",
    //     "propietario":"Perez",
    //     "email":"nose@gmai.com",
    //     "celular":"0697854895",
    //     "convencional":"050257895",
    //     "ingreso":"02-05-2023",
    //     "sintomas":"lele panchita"
    //   }
    
    
    // Crear un nuevo registro 
    const nuevoPaciente = new Paciente(req.body)
    
    //{"_id":{"$oid":"64f7c10e6a78d8bdd202a9fb"},"nombre":"Metro","propietario":"qw","email":"dani@gmail.com","celular":"12345","convencional":"123456789012345","ingreso":{"$date":{"$numberLong":"1693785958183"}},"sintomas":"svsd","salida":{"$date":{"$numberLong":"1693787189000"}},"estado":false,"veterinario":{"$oid":"64f51f4b66aba3bdcc23284f"},"createdAt":{"$date":{"$numberLong":"1693786198361"}},"updatedAt":{"$date":{"$numberLong":"1693787191158"}},"__v":{"$numberInt":"0"}}
   console.log(nuevoPaciente)
   console.log(req.body.id)

    nuevoPaciente.veterinario=req.body._id
    //await nuevoPaciente.save()
    //res.status(200).json({msg:"Registro exitoso del paciente"})
}
 */
const registrarPaciente = async(req,res)=>{
    try{
        if (Object.values(req.body).includes("")) return res.status(400).json({msg:"Lo sentimos, debes llenar todos los campos"})
        const {nombre, propietario, email, celular, convencional, ingreso, salida, sintomas, veterinario} = req.body
        const nuevoPaciente = new Paciente({nombre, propietario, email, celular, convencional, ingreso, salida, sintomas, veterinario})
        nuevoPaciente.veterinario=req.veterinarioBDD._id
        //console.log(req.body)
        await nuevoPaciente.save()
        res.status(200).json({msg:"Registro exitoso del paciente"})
    }
    catch(error){
        console.log(error)
    }
}

const actualizarPaciente = async(req,res)=>{
    try {
        const {id} = req.params
        if (Object.values(req.body).includes("")) return res.status(400).json({msg:"Lo sentimos, debes llenar todos los campos"})
        if( !mongoose.Types.ObjectId.isValid(id) ) return res.status(404).json({msg:`Lo sentimos, no existe el veterinario ${id}`});
        await Paciente.findByIdAndUpdate(req.params.id,req.body)
        res.status(200).json({msg:"Actualización exitosa del paciente"})
    } 
    catch (error) {
        console.log(error)
    }
}



const eliminarPaciente = async (req,res)=>{
    try{
        const {id} = req.params
        if (Object.values(req.body).includes("")) return res.status(400).json({msg:"Lo sentimos, debes llenar todos los campos"})
        if( !mongoose.Types.ObjectId.isValid(id) ) return res.status(404).json({msg:`Lo sentimos, no existe el veterinario ${id}`})
        const {salida} = req.body
        await Paciente.findByIdAndUpdate(req.params.id,{salida:Date.parse(salida),estado:false})
        res.status(200).json({msg:"Fecha de salida del paciente registrado exitosamente"})
    }
    catch(error){
        console.log(error)
    }
}

export {
    listarPacientes,
    detallePaciente,
    registrarPaciente,
    actualizarPaciente,
    eliminarPaciente
}