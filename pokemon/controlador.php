<?php
include "modelo.php"; // Incluye el Modelo.
$modelo = new pokemon(); // Instancia a la clase del modelo
try // Try, manejo de Errores
{
    $metodo = $_SERVER['REQUEST_METHOD'];
    $response = null;
    $variables = $_POST;
    if (!isset($_POST['accion'])) {
        echo "No se ha definido una acción.";
        return;
    } // Evita que ocurra un error si no manda accion.
    $accion = trim($variables['accion']);
    // Dependiendo de la accion se ejecutaran las tareas y se definira el tipo de respuesta.
    switch ($accion) {

        case 'loadPokemon':
            $cantidad = $variables['cantidad'];
            $response = $modelo->obtenerPokemons($cantidad);
            break;

        case 'getPokemonDetails':
            $pokemonId = $variables['id'];
            $response = $modelo->obtenerDetallesPokemon($pokemonId);
            break;
    }

    // Respuestas del Controlador
    echo json_encode($response, true); // $response será un array con los datos de nuestra respuesta.
} // Fin Try
catch (Exception $e) {
    echo "Error: " . $e->getMessage();
} // Fin Catch
