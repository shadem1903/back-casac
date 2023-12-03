import { Collection } from "fireorm";

@Collection()
class Usuarios{
    id:string;
    nombres:string;
    apellidos:string;
    correo:string;
    contrasena:string;
    identificacion:string;
    universidad:string;
    profesion:string;
    grupo_investigacion:string;
    rol:string;
    ultimo_acceso:string;
    status:string;
}
export default Usuarios;