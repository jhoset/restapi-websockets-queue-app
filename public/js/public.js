const firstTicketRef = document.querySelector("#lbl-ticket-01");
const firstDeskRef = document.querySelector("#lbl-desk-01");

const secondTicketRef = document.querySelector("#lbl-ticket-02");
const secondDeskRef = document.querySelector("#lbl-desk-02");

const thirdTicketRef = document.querySelector("#lbl-ticket-03");
const thirdDeskRef = document.querySelector("#lbl-desk-03");

const fourthTicketRef = document.querySelector("#lbl-ticket-04");
const fourthDeskRef = document.querySelector("#lbl-desk-04");

const ticketRefs = [firstTicketRef, secondTicketRef, thirdTicketRef, fourthTicketRef];
const deskRefs = [firstDeskRef, secondDeskRef, thirdDeskRef, fourthDeskRef]


async function getWorkingOnTickets() {
    const workingOnList = await fetch('/api/ticket/working-on').then(res => res.json());
    renderFirst4Tickets(workingOnList);
}


function clearScreen() {
    ticketRefs.forEach((ref, index) => {
        ticketRefs[index].innerHTML = `No Ticket`;
        deskRefs[index].innerHTML = `-`
    })
}

function renderFirst4Tickets(ticketList) {
    clearScreen()
    ticketList.forEach((ticket, index) => {
        ticketRefs[index].innerHTML = `Ticket #${ticket.number}`;
        deskRefs[index].innerHTML = `< ${ticket.handleAtDesk} >`
    })

}


function connectToWebSockets() {

    const socket = new WebSocket('ws://localhost:3000/ws');

    socket.onmessage = (event) => {
        const { type, payload } = JSON.parse(event.data)
        if (type == 'on-ticket-working-change') {
            renderFirst4Tickets(payload);
        }
    };

    socket.onclose = (event) => {
        console.log('Connection closed');
        setTimeout(() => {
            console.log('retrying to connect');
            connectToWebSockets();
        }, 1500);

    };

    socket.onopen = (event) => {
        console.log('Connected');
    };

}

connectToWebSockets();


getWorkingOnTickets();