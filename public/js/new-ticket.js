const currentTicketNumberLabel = document.querySelector("#lbl-new-ticket");
const generateNewTicketButton = document.querySelector("#generateNewTicket");

async function getLastTicketNumber() {
    const lastTicketNumber = await fetch('/api/ticket/last').then(resp => resp.json());
    currentTicketNumberLabel.innerHTML = `Last Ticket # ${lastTicketNumber}`;
}

async function createTicket() {
    const newTicket = await fetch('/api/ticket', {
        method: 'POST'
    }).then(resp => resp.json())

    currentTicketNumberLabel.innerHTML = `Last Ticket # ${newTicket?.number}`;
}

getLastTicketNumber();
generateNewTicketButton.addEventListener('click', () => {
    createTicket();
})

