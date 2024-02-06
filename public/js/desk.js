const lblPending = document.querySelector("#lbl-pending");
const lblCurrentDesk = document.querySelector("#lbl-current-desk");
const alertEmptyList = document.querySelector("#empty-list");
const finishCurrentTicket = document.querySelector("#finish-current-ticket");
const takeNextTicket = document.querySelector("#take-next-ticket");
const headerTitleRef = document.querySelector("#title");
const taskListRef = document.querySelector("#task-list");

const searchParams = new URLSearchParams(window.location.search);

if (!searchParams.has('escritorio')) {
    window.location = 'index.html';
    throw new Error('Desk is required')
}

const deskNumber = searchParams.get('escritorio')
lblCurrentDesk.innerHTML = `Authenticated as <i>${deskNumber}</i> `;
let workingOnTicket = null;





function checkTicketCount(currentCount = 0) {
    lblPending.innerHTML = currentCount;
    if (!currentCount) {
        alertEmptyList.classList.remove('d-none');
    } else {
        alertEmptyList.classList.add('d-none');
    }
}

async function takeNextPendingTicket() {
    finishTicket();
    const { status, ticket, message } = await fetch(`/api/ticket/draw/${deskNumber}`).then(resp => resp.json())
    if (status == "error") {
        headerTitleRef.innerHTML = message;
        return;
    }
    workingOnTicket = ticket;
    headerTitleRef.innerHTML = `Working on ticket <span class="btn btn-secondary"> #${ticket.number} </span> `;
}

async function finishTicket() {
    if (workingOnTicket) {
        const { status, message } = await fetch(`/api/ticket/finish/${workingOnTicket.id}`, {
            method: 'PUT'
        }).then(resp => resp.json())
        if (status === 'OK') {
            workingOnTicket = null;
            headerTitleRef.innerHTML = "Available to take the following ticket..."
        } else {
            headerTitleRef.innerHTML = "Something went wrong..."
        }
    }
}

async function loadInitialCount() {
    const pendingTickets = await fetch('/api/ticket/pending').then(resp => resp.json());
    checkTicketCount(pendingTickets.length)
    displayPendingTaskList(pendingTickets)
}

function displayPendingTaskList(taskList) {
    taskListRef.innerHTML = ''
    taskList.forEach((element, index) => {
        const li = document.createElement('li');
        li.textContent = `Ticket #${element.number}`
        li.classList.add('list-group-item')
        if (index == 0) {
            li.textContent = `Next Ticket > #${element.number}`
            li.classList.add('active');
        }
        taskListRef.appendChild(li);

    });
}

function connectToWebSockets() {

    const socket = new WebSocket('ws://localhost:3000/ws');

    socket.onmessage = (event) => {
        const { type, payload } = JSON.parse(event.data)
        if (type == 'on-ticket-count-change') {
            checkTicketCount(payload.length)
            displayPendingTaskList(payload)
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

takeNextTicket.addEventListener('click', () => {
    takeNextPendingTicket();
})

finishCurrentTicket.addEventListener('click', () => {
    finishTicket();
})

connectToWebSockets();
loadInitialCount();