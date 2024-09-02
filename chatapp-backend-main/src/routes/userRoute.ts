import { Router } from 'express';
import { register, login, getSession } from '../controllers/authController';

const router = Router();

router.post('/register', register);
router.post('/login', login);
router.get('/session', getSession);

export default router;
