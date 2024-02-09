<?php

class pokemon
{
    function obtenerPokemons($cantidad)
    {
        $url = 'https://pokeapi.co/api/v2/pokemon?limit=' . $cantidad;
        $data = file_get_contents($url);
        $pokemonList = json_decode($data, true)['results'];

        $pokemons = [];

        foreach ($pokemonList as $pokemon) {
            $pokemonData = file_get_contents($pokemon['url']);
            $pokemonData = json_decode($pokemonData, true);

            $pokemonInfo = [
                'name' => $pokemonData['name'],
                'image' => $pokemonData['sprites']['front_default']
            ];

            $pokemons[] = $pokemonInfo;
        }

        return $pokemons;
    }

    public function obtenerDetallesPokemon($pokemonId)
    {
        $url = 'https://pokeapi.co/api/v2/pokemon/' . $pokemonId;
        $data = file_get_contents($url);
        $pokemonData = json_decode($data, true);

        $pokemonDetails = [
            'name' => $pokemonData['name'],
            'id' => $pokemonData['id'], // Agrega el id del pokemon al array 'pokemonDetails
            'image' => $pokemonData['sprites']['front_default'],
            'height' => $pokemonData['height'],
            'weight' => $pokemonData['weight'],
            'abilities' => $pokemonData['abilities'],
            'moves' => $pokemonData['moves'],
        ];

        return $pokemonDetails;
    }
}
