import { Router } from "express";
import { TicketController } from "./controller";

export class TicketRoutes {



    public static get routes() {
        const router = Router();


        const controller = new TicketController();

        router.get('/', controller.getTickets);
        router.get('/last', controller.getLastTicketNumber);
        router.get('/pending', controller.pendingTickets);

        router.post('/', controller.createTicket);

        router.get('/draw/:desk', controller.drawTicket);
        router.put('/finish/:ticketId', controller.ticketFinished);

        router.get('/working-on', controller.workingOn);

        return router;
    }


}