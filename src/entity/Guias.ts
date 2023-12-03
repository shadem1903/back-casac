import { Collection } from "fireorm";

@Collection()
class Guias{
    id:string;
    titulo_guia:string;
    descripcion:string;
    fecha_creacion:string;
    fecha_modificacion:string;
    status:string;
}
export default Guias;