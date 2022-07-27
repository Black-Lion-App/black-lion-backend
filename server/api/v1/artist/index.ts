import express from "express";
import { uploadMiddleware } from "../../../middlewares/file-upload";
import controller from "./artist.controller";

const router = express.Router();

router.get('/', controller.get);
router.post('/', uploadMiddleware().single('file'), controller.post);
router.get('/:id', controller.getById);
router.put('/:id', controller.update);
router.put('/profile/:id', uploadMiddleware().single('file'), controller.updateWithProfile);
router.delete('/:id', controller.delete);

export default router;
