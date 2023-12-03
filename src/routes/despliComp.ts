import { Router } from "express";
import DespliCompController from "../controller/DespliCompController";

const router = Router();

router.put('/desplegar', DespliCompController.desplegarGuias);

export default router;