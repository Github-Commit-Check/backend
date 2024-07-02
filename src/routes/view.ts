import express, { Request, Response, Router } from 'express'
import * as schedule from '../services/scheduleAlarm';

const router: Router = express.Router();

router.get('/', async (req:Request, res:Response) => {
    return res.status(200).json({
        //message: schedule.test()
    });
})

router.get('/db', async (req:Request, res:Response) => {
    return res.status(200).json({
        //message: schedule.dbTest()
    });
})

export = router;