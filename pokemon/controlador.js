let cantidadPokemonsCargados = 20; // Variable para llevar el seguimiento de la cantidad de Pokémon cargados
let isLoading = false; // Variable de estado para controlar si se está cargando información

document.addEventListener("DOMContentLoaded", function () {
    // Al cargar la página, hacer la petición inicial al controlador PHP
    fetchPokemons(cantidadPokemonsCargados);

    // Agrega un event listener al evento scroll
    window.addEventListener('scroll', handleScroll);

    // Agregar event listener al botón de cerrar modal
    document.getElementById('close').addEventListener('click', closeModal);
});

function fetchPokemons(cantidad) {
    const formData = new FormData();
    formData.append('accion', 'loadPokemon'); // Define la acción que se va a realizar en el controlador
    formData.append('cantidad', cantidad); // Define la cantidad de Pokémon a cargar

    // Muestra el overlay oscuro
    document.getElementById('overlay').style.display = 'block';
    // Muestra el loader
    document.getElementById('loader').style.display = 'block';

    fetch('controlador.php', {
        method: 'POST',
        body: formData
    })
        .then(response => response.json())
        .then(data => {
            const pokemonContainer = document.getElementById('pokemon-container');
            data.forEach(pokemonData => {
                const pokemonCard = document.createElement('div');
                pokemonCard.classList.add('pokemon-card');

                const name = document.createElement('h2');
                name.textContent = pokemonData.name.toUpperCase();
                pokemonCard.appendChild(name);

                const img = document.createElement('img');
                img.classList.add('pokemon-img');
                img.src = pokemonData.image;
                img.alt = pokemonData.name;
                // Agrega un manejador de eventos de clic a la imagen del Pokémon
                img.addEventListener('click', function () {
                    openModal(pokemonData.name); // Abre el modal con el ID del Pokémon
                });
                pokemonCard.appendChild(img);

                pokemonContainer.appendChild(pokemonCard);
            });
            // Oculta el overlay oscuro y el loader después de cargar los Pokémon
            document.getElementById('overlay').style.display = 'none';
            document.getElementById('loader').style.display = 'none';
            isLoading = false; // Establece isLoading a false para indicar que se ha terminado de cargar información
        })
        .catch(error => {
            console.log('Error fetching Pokémon data:', error);
            // En caso de error, oculta el overlay oscuro y el loader
            document.getElementById('overlay').style.display = 'none';
            document.getElementById('loader').style.display = 'none';
            isLoading = false; // Establece isLoading a false para indicar que se ha terminado de cargar información
        });
}

function handleScroll() {
    // Verifica si el usuario ha llegado al fondo de la página y si no se está cargando información
    if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight && !isLoading) {
        // Si ha llegado al fondo y no se está cargando información, carga más Pokémon
        cantidadPokemonsCargados += 10;
        isLoading = true; // Establece isLoading a true para indicar que se está cargando información

        // Muestra el loader
        document.getElementById('loader').style.display = 'block';

        // Realiza la solicitud para cargar más Pokémon
        fetchPokemons(cantidadPokemonsCargados);
    }
}

function openModal(pokemonId) {
    const formData = new FormData();
    formData.append('accion', 'getPokemonDetails'); // Define la acción que se va a realizar en el controlador
    formData.append('id', pokemonId); // Define el ID del Pokémon

    // Muestra el overlay oscuro
    document.getElementById('overlay').style.display = 'block';
    // Muestra el loader
    document.getElementById('loader').style.display = 'block';

    // Realizar la solicitud al controlador PHP para obtener los detalles del Pokémon
    fetch('controlador.php', {
        method: 'POST',
        body: formData
    })
        .then(response => response.json())
        .then(data => {
            // Mostrar la información del Pokémon en el modal
            const modalContent = document.getElementById('modal-content');
            modalContent.innerHTML = `
                <h2>${data.name.toUpperCase()} #${data.id}</h2>
                <img src="${data.image}" alt="${data.name}">
                <p>Altura: ${data.height}</p>
                <p>Peso: ${data.weight}</p>
                <h3>Habilidades:</h3>
                <ul>
                    ${data.abilities.map(ability => `<li>${ability.ability.name}</li>`).join('')}
                </ul>
                <h3>Movimientos:</h3>
                <ul>
                    ${data.moves.slice(0, 3).map(move => `<li>${move.move.name}</li>`).join('')}
                </ul>
            `;
            document.getElementById('loader').style.display = 'none';
            // Muestra el modal
            document.getElementById('modal').style.display = 'block';
        })
        .catch(error => {
            console.log('Error fetching Pokémon details:', error);
            // Oculta el overlay oscuro y el loader después de cargar los Pokémon
            document.getElementById('overlay').style.display = 'none';
            document.getElementById('loader').style.display = 'none';
        });
}

function closeModal() {
    // Ocultar el modal y el overlay
    document.getElementById('modal').style.display = 'none';
    document.getElementById('overlay').style.display = 'none';
}
