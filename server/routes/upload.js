import express from 'express';
import { upload, uploadImage } from '../controllers/uploadController.js';
import { protect, admin } from '../middleware/auth.js';

const router = express.Router();

router.post('/', protect, admin, upload.single('image'), uploadImage);

export default router;
