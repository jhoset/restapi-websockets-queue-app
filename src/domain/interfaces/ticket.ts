export interface Ticket {
    id: string;
    number: number;
    createdAt: Date;
    handleAtDesk?: string; //Desk 1, Desk 2, Desk 3
    handleAt?: Date;
    done: boolean;
    doneAt?: Date;
}