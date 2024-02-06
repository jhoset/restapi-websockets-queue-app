import { UuidAdapter } from "../../config";
import { Ticket } from "../../domain";
import { WssService } from "./wss.service";


export class TicketService {

    constructor(private readonly wssService = WssService.instance) {

    }


    public tickets: Ticket[] = [
        {
            id: UuidAdapter.v4(),
            number: 1,
            createdAt: new Date(),
            done: false,
        },
        {
            id: UuidAdapter.v4(),
            number: 2,
            createdAt: new Date(),
            done: false,
        },
        {
            id: UuidAdapter.v4(),
            number: 3,
            createdAt: new Date(),
            done: false,
        },
        {
            id: UuidAdapter.v4(),
            number: 4,
            createdAt: new Date(),
            done: false,
        },
        {
            id: UuidAdapter.v4(),
            number: 5,
            createdAt: new Date(),
            done: false,
        }


    ];
    private readonly _workingOnTickets: Ticket[] = [];

    public get pendingTickets(): Ticket[] {
        return this.tickets.filter(e => (!e.handleAtDesk));
    }

    public get lastTicketsWorkingOn(): Ticket[] {
        return this._workingOnTickets.slice(0, 4);
    }

    public get lastTicketNumber(): number {
        if (!this.tickets.length) return 0;
        return this.tickets.at(-1)?.number ?? 0
    }

    public createTicket() {
        const newTicket: Ticket = {
            id: UuidAdapter.v4(),
            number: this.lastTicketNumber + 1,
            createdAt: new Date(),
            done: false
        }
        this.tickets.push(newTicket)

        this.notifyPendingTicketChange();

        return newTicket;
    }

    public drawTicket(desk: string) {
        const ticket = this.tickets.find(e => !e.handleAtDesk)
        if (!ticket) {
            return { status: 'error', message: 'No available tickets' };
        }
        ticket.handleAtDesk = desk;
        ticket.handleAt = new Date();

        this._workingOnTickets.push({ ...ticket })
        this.notifyPendingTicketChange();
        this.notifyTicketWorkingChange();
        return { status: 'OK', ticket }
    }

    public finishTicket(id: string) {
        const ticket = this.tickets.find(e => e.id === id);
        if (!ticket) return { status: 'Error', message: 'Ticket Not Found' };

        this.tickets = this.tickets.map(e => {
            if (e.id == id) {
                e.done = true;
                e.doneAt = new Date();
            }
            return e;
        })
        this._workingOnTickets.shift();
        this.notifyTicketWorkingChange();
        return { status: 'OK', message: 'Ticket Finished Successfully' }

    }

    private notifyPendingTicketChange() {
        this.wssService.sendMessage('on-ticket-count-change', this.pendingTickets);
    }

    private notifyTicketWorkingChange() {
        this.wssService.sendMessage('on-ticket-working-change', this.lastTicketsWorkingOn);
    }


}