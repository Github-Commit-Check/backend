import express, { Request, Response, Router } from 'express'
import * as community from '../services/community';

const router: Router = express.Router();

router.post('/send-message/:kind', async (req: Request, res: Response) => { 
    const { message } = req.body;
    const { kind } = req.params;

    if (!message) {
        return res.status(400).send('Message is required');
    }

    try {

        const response = await community.sendMessage(message,kind);

        if (response.status === 200) {
            res.status(200).send('Message sent successfully');
        } else {
            res.status(response.status).send('Failed to send message');
        }
    } catch (error) {
        console.error('Error sending message:', error);
        res.status(500).send('Internal Server Error');
    }
})

export = router;