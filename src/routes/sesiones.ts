import { Router } from "express";
import SesionesController from "../controller/SesionesController";

const router = Router();

router.post('/create_sesiones', SesionesController.crearSesion);
router.put('/edit_sesions/:id',SesionesController.modificarSesion);
router.get('/search_sesions/:id',SesionesController.buscarSesionPorId);
router.delete('/delete_sesion:id',SesionesController.eliminarSesion);

export default router;