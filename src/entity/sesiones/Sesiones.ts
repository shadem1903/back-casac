import { Collection } from "fireorm";

@Collection()
class Sesiones{
    id:string;
    pertenece_a:string;
    sesion:string[];
}
export default Sesiones;