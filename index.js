document.addEventListener("DOMContentLoaded", () =>{
    const filmDetails = document.getElementById("Details");
    const filmsList = document.getElementById("films");
    const poster = document.getElementById("poster");
    const title = document.getElementById("title");
    const runtime = document.getElementById("runtime");
    const showtime = document.getElementById("showtime");
    const availableTickets = document.getElementById("available-tickets");
    const butTicketButton = document.getElementById("buy-ticket");


    fetch('http://localhost:3000/films/1')
    .then(response => response.json())
    .then(film => displayFilmDetails(film));

    fetch('http://localhost:3000/films')
     .then(response => response.json())
     .then(films => {
       filmsList.innerHTML = '';
       films.forEach(film => {
        const li = document.createElement('li');
          li.textContent = film.title;
          li.classList.add('film', 'item');
            if (film.capacity - film.tickets_sold === 0) {
                li.classList.add('sold-out');
            }
               li.addEventListener('click', () => displayFilmDetails(film));
               filmsList.appendChild(li);
            });
        });


        function displayFilmDetails(film) {
        poster.src = film.poster;
        title.textContent = film.title;
        runtime.textContent = `Runtime: ${film.runtime} minutes`;
        showtime.textContent = `Showtime: ${film.showtime}`;
        availableTickets.textContent = `Available Tickets: ${film.capacity - film.tickets_sold}`;
        buyTicketButton.disabled = film.capacity - film.tickets_sold === 0;
        buyTicketButton.textContent = film.capacity - film.tickets_sold === 0 ? 'Sold Out' : 'Buy Ticket';

        buyTicketButton.onclick = () => {
            if (film.tickets_sold < film.capacity) {
                film.tickets_sold++;
                availableTickets.textContent = `Available Tickets: ${film.capacity - film.tickets_sold}`;
                buyTicketButton.disabled = film.capacity - film.tickets_sold === 0;
                buyTicketButton.textContent = film.capacity - film.tickets_sold === 0 ? 'Sold Out' : 'Buy Ticket';

       fetch(`http://localhost:3000/films/${film.id}`, {
                    method: 'PATCH',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ tickets_sold: film.tickets_sold })
                });
            }
        };
    }

});