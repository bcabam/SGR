<?php
require_once __DIR__ . "/../../config/database.php";

// 1. Encabezados estrictos para permitir Sesiones (CORS)
header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Credentials: true");
header("Access-Control-Allow-Methods: GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json; charset=UTF-8");

// Manejo de pre-flight requests de los navegadores
if ($_SERVER["REQUEST_METHOD"] === "OPTIONS") {
    http_response_code(200);
    exit;
}

// 2. Iniciar y validar la sesión
session_start();

if (!isset($_SESSION['admin_id'])) {
    http_response_code(401);
    echo json_encode(["error" => "Acceso denegado. No has iniciado sesión."]);
    exit;
}

// 3. Obtener los datos
try {
    // Usamos query() porque no hay parámetros dinámicos de usuario, es seguro.
    $consulta = $conexion->query("SELECT id, nombre, responsable, estado FROM delegaciones ORDER BY id DESC");
    
    // fetchAll() ya devuelve un array asociativo gracias a la configuración en database.php
    $resultados = $consulta->fetchAll();

    http_response_code(200);
    echo json_encode($resultados);

} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(["error" => "Error interno al obtener las delegaciones."]);
}
?>