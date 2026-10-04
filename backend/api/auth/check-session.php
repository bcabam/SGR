<?php
header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Credentials: true");
header("Access-Control-Allow-Methods: GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json; charset=UTF-8");

if ($_SERVER["REQUEST_METHOD"] === "OPTIONS") {
    http_response_code(200);
    exit;
}

session_start();

// Verificamos si la variable de sesión del administrador existe
if (isset($_SESSION['admin_id'])) {
    http_response_code(200);
    echo json_encode(["autenticado" => true]);
} else {
    // Devolvemos 200 para evitar el error rojo en la consola del navegador, 
    // pero indicamos mediante JSON que no hay sesión activa.
    http_response_code(200);
    echo json_encode(["autenticado" => false]);
}
?>