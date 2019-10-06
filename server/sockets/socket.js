//SERVIDOR 

const { io } = require('../server');

const { TicketControl } = require('../clases/ticket-control');


const ticketControl = new TicketControl();


io.on('connection', (client) => {


    client.on('siguienteTicket', (data, callback) => {

        let siguiente = ticketControl.siguienteTicket();

        console.log(siguiente);
        callback(siguiente);
    });

    // emite el estado actual

    client.emit('estadoActual', {
        actual: ticketControl.getUltimoTicket(),
        ultimos4: ticketControl.getUltimos4()
    });

    client.on('atenderTicket', (data, callback) => {
        if (!data.escritorio) {
            return callback({
                err: true,
                mensaje: 'El escritorio es necesario'
            });
        }

        // creamos una referencia y llamamamos a la funcion atender ticket que se encuentra en sockets-controls
        let atenderTicket = ticketControl.atenderTicket(data.escritorio);

        callback(atenderTicket);



        // actualizar o notificar cambios en los ultimos tickets

        client.broadcast.emit('ultimos4', {
            ultimos4: ticketControl.getUltimos4()
        });





    });



});