document.addEventListener('DOMContentLoaded', () => {
    const filmDetails = document.getElementById('film-details');
    const filmList = document.getElementById('films');
    const poster = document.getElementById('poster');
    const title = document.getElementById('title');
    const runtime = document.getElementById('runtime');
    const showtime = document.getElementById('showtime');
    const availableTickets = document.getElementById('available-tickets');
    const buyTicketButton = document.getElementById('buy-ticket');

    
    fetch('http://localhost:3000/films/1')
        .then(response => response.json())
        .then(film => {
            displayFilmDetails(film);
        })
        .catch(error => console.error('Error fetching film details:', error));

    
    fetch('http://localhost:3000/films')
        .then(response => response.json())
        .then(films => {
            filmList.innerHTML = '';
            films.forEach(film => {
                const filmItem = document.createElement('li');
                filmItem.textContent = film.title;
                filmItem.classList.add('film', 'item');
                filmItem.addEventListener('click', () => {
                    displayFilmDetails(film);
                });
                filmList.appendChild(filmItem);
            });
        })
        .catch(error => console.error('Error fetching films list:', error));

    
    function displayFilmDetails(film) {
        poster.src = film.poster;
        title.textContent = film.title;
        runtime.textContent = `Runtime: ${film.runtime} minutes`;
        showtime.textContent = `Showtime: ${film.showtime}`;
        availableTickets.textContent = `Available Tickets: ${film.capacity - film.tickets_sold}`;
        buyTicketButton.textContent = 'Buy Ticket';
        buyTicketButton.disabled = film.capacity - film.tickets_sold === 0;

        
        buyTicketButton.onclick = () => {
            if (film.tickets_sold < film.capacity) {
                film.tickets_sold += 1;
                availableTickets.textContent = `Available Tickets: ${film.capacity - film.tickets_sold}`;
                if (film.tickets_sold === film.capacity) {
                    buyTicketButton.textContent = 'Sold Out';
                    buyTicketButton.disabled = true;
                }
                updateTicketsSold(film);
            }
        };
    }

    
    function updateTicketsSold(film) {
        fetch(`http://localhost:3000/films/${film.id}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ tickets_sold: film.tickets_sold })
        })
        .catch(error => console.error('Error updating tickets sold:', error));
    }
});