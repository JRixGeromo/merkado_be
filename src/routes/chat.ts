import { Router } from 'express';
import { createChatMessage, getChatMessages } from '../controllers/chatController';

const router = Router();

router.post('/', createChatMessage); // Create new chat message
router.get('/:senderId/:recipientId', getChatMessages); // Get chat messages between two users

export default router;
