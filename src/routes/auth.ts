import { Router } from "express";
import AuthController from "./../controller/AuthController";

const router = Router();

router.post('/login', AuthController.login);
router.post('/recovey_pass', AuthController.recuperarContrasena)

export default router;