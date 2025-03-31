document.addEventListener('DOMContentLoaded', () => {
    const filmList = document.getElementById('films');
    const filmDetails = document.getElementById('film-details');
    const poster = document.getElementById('poster');
    const title = document.getElementById('title');
    const description = document.getElementById('description');
    const runtime = document.getElementById('runtime');
    const showtime = document.getElementById('showtime');
    const availableTickets = document.getElementById('available-tickets');
    const buyTicketButton = document.getElementById('buy-ticket');
    let isButtonClicked = false; 

    filmList.innerHTML = '';

    fetch('https://my-json-server.typicode.com/mercyk001/flatadongo/films/1')
        .then(response => response.json())
        .then(film => {
            displayFilmDetails(film);
        })
        .catch(error => console.error('Error fetching film details:', error));

    fetch('https://my-json-server.typicode.com/mercyk001/flatadongo/films')
        .then(response => response.json())
        .then(films => {
            films.forEach(film => {
                const filmItem = document.createElement('li');
                filmItem.textContent = film.title;
                filmItem.classList.add('film', 'item');
                if (film.capacity - film.tickets_sold === 0) {
                    filmItem.classList.add('sold-out');
                }
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
        description.textContent = film.description; 
        runtime.textContent = `Runtime: ${film.runtime} minutes`;
        showtime.textContent = `Showtime: ${film.showtime}`;
        availableTickets.textContent = `Available Tickets: ${film.capacity - film.tickets_sold}`;
        buyTicketButton.textContent = film.capacity - film.tickets_sold === 0 ? 'Sold Out' : 'Buy Ticket';
        buyTicketButton.disabled = film.capacity - film.tickets_sold === 0;

        isButtonClicked = false;

        buyTicketButton.onclick = (event) => {
            event.preventDefault(); 
            if (!isButtonClicked && film.tickets_sold < film.capacity) {
                isButtonClicked = true; 
                film.tickets_sold += 1;
                availableTickets.textContent = `Available Tickets: ${film.capacity - film.tickets_sold}`;
                if (film.tickets_sold === film.capacity) {
                    buyTicketButton.textContent = 'Sold Out';
                    buyTicketButton.disabled = true;
                    updateFilmListItem(film);
                }
                updateTicketsSold(film);
            }
        };
    }

    function updateTicketsSold(film) {
        fetch(`https://my-json-server.typicode.com/mercyk001/flatadongo/films/${film.id}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ tickets_sold: film.tickets_sold })
        })
        .then(response => response.json())
        .then(updatedFilm => {
            console.log('Updated tickets sold:', updatedFilm.tickets_sold);
        })
        .catch(error => console.error('Error updating tickets sold:', error));
    }

    function updateFilmListItem(film) {
        const filmItems = document.querySelectorAll('.film.item');
        filmItems.forEach(item => {
            if (item.textContent === film.title) {
                item.classList.add('sold-out');
            }
        });
    }
});