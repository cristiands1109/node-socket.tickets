const fs = require('fs');

// esta clase es una referencia local que no necesita ser exportada
// proceso de creacion de ticket
class Ticket {

    constructor(numero, escritorio) {

        this.numero = numero;
        this.escritorio = escritorio;


    }

}

class TicketControl {

    constructor() {

        this.ultimo = 0;
        this.hoy = new Date().getDate();
        this.tickets = []; // arreglo de tickets
        this.ultimosTickets = []; // arreglo de ultimos 4 tickets

        // hace referencia a la ubicacion del archivo que contiene las informaciones grabadas
        let data = require('../data/data.json');


        // validacion de si la fecha 
        // en caso que la fecha es la misma que la actual carga los datos 
        // caso contrario ejecuta la funcion reiniciar conteo que reinicia todo el sistema
        if (data.hoy === this.hoy) {
            this.ultimo = data.ultimo;
            this.tickets = data.tickets;
            this.ultimosTickets = data.ultimosTickets;
        } else {
            this.reiniciarConteo();
        }


    }


    siguienteTicket() {

        // aumenta en uno el la cantidad de tickets
        this.ultimo += 1;

        // crea un nuevo ticket con los parametros numero, escritorio
        let ticket = new Ticket(this.ultimo, null);

        // agrega el ticket creado en el arreglo
        this.tickets.push(ticket);

        // graba los archivos
        this.grabarArchivo();

        // retorna un mensaje con el ultimo ticket creado
        return `Ticket: ${this.ultimo}`;


    }


    getUltimoTicket() {
        // retorna el ultimo ticket 
        return `Ticket: ${this.ultimo}`;
    }

    getUltimos4() {
        // retorna el ultimo ticket 
        return this.ultimosTickets;
    }


    atenderTicket(escritorio) {

        // se verifica que existan tickets pendiente por atender 
        if (this.tickets.length === 0) {
            return 'No hay mas tickets';
        }

        // obtener cual es el primer ticket del arreglo
        let numeroUltimoTicket = this.tickets[0].numero;

        // elimina el primer ticket del arreglo / la primera posicion del arreglo
        this.tickets.shift();

        // crea un nuevo ticket que es le que sera atendido
        let atenderTicket = new Ticket(numeroUltimoTicket, escritorio);

        // se agrega el ticket creado al principio del arreglo de los tickets ultimos tickets
        this.ultimosTickets.unshift(atenderTicket);

        // validacion para verificar que existan solo 4 tickets en el arreglo
        if (this.ultimosTickets.length > 4) {
            this.ultimosTickets.splice(-1, 1); // borra el ultimo
        }

        // impresion en consola de los tickets a ser atendidos
        console.log('Ultimos 4 tickets');
        console.log(this.ultimosTickets);

        // graba los archivos
        this.grabarArchivo();

        // retorna los tickets 
        return atenderTicket;
    }

    reiniciarConteo() {

        // se reinicia en cero los tickets creados
        this.ultimo = 0;
        // se vacia el arreglo de los tickets
        this.tickets = [];
        // vacia el arrelgo de los ultimos tickets
        this.ultimosTickets = [];
        // mensaje en consola para saber que se ha reiniciado el sistema
        console.log('Se ha inicializado el sistema');
        // se procede a ejecutar la funcion de grabar
        this.grabarArchivo();


    }

    grabarArchivo() {

        let jsonData = {
            // cual es el ultimo ticket
            ultimo: this.ultimo,
            // fecha de hoy
            hoy: this.hoy,
            // arreglo de la cantidad de tickets existentes o creados
            tickets: this.tickets,
            // arreglo de los ultimos o primeros 4 tickets
            ultimosTickets: this.ultimosTickets
        };

        // se convierte el arreglo en un string
        let jsonDataString = JSON.stringify(jsonData);

        // se realiza la grabacion del archivo
        fs.writeFileSync('./server/data/data.json', jsonDataString);

        // console.log('Se ha inicializado el sistema');

    }





}


module.exports = {
    TicketControl
};