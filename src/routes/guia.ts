import { Router } from "express";
import GuiaController from "../controller/GuiaController";

const router = Router();

router.post('/create_guia', GuiaController.crearGuia);
router.put('/modificar/:id', GuiaController.modificarGuia);
router.get('/consultar/:id', GuiaController.consultarGuia);
router.delete('/eliminar/:id', GuiaController.eliminarGuia);
router.get('/listar',GuiaController.listarGuias);
router.get('/listarActivas',GuiaController.listarGuiasActivas);

export default router;