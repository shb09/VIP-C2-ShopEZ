import express from 'express';
import { getUsers, getUser, updateUserRole, deleteUser, getAnalytics } from '../controllers/userController.js';
import { protect, admin } from '../middleware/auth.js';

const router = express.Router();

router.get('/', protect, admin, getUsers);
router.get('/analytics', protect, admin, getAnalytics);
router.get('/:id', protect, admin, getUser);
router.put('/:id', protect, admin, updateUserRole);
router.delete('/:id', protect, admin, deleteUser);

export default router;
