<?php
require_once __DIR__ . "/../../config/database.php";

header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Credentials: true");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Content-Type: application/json; charset=UTF-8");

if ($_SERVER["REQUEST_METHOD"] === "OPTIONS") {
    http_response_code(200);
    exit;
}

// Iniciar el motor de sesiones de PHP
session_start();

$datos = json_decode(file_get_contents("php://input"), true);

if (!isset($datos["usuario"]) || !isset($datos["password"])) {
    http_response_code(400);
    echo json_encode(["error" => "Usuario y contraseña son requeridos."]);
    exit;
}

$usuario = trim($datos["usuario"]);
$password = $datos["password"];

try {
    $consulta = $conexion->prepare("SELECT id, password FROM usuarios WHERE usuario = :usuario LIMIT 1");
    $consulta->execute([":usuario" => $usuario]);
    $admin = $consulta->fetch();

    // password_verify compara el texto que escribió el usuario con el hash seguro
    if ($admin && password_verify($password, $admin['password'])) {
        
        // OWASP A07:2021 - Regenerar el ID de sesión para prevenir ataques de Fijación de Sesión
        session_regenerate_id(true);
        $_SESSION['admin_id'] = $admin['id'];
        
        http_response_code(200);
        echo json_encode(["mensaje" => "Inicio de sesión exitoso."]);
    } else {
        http_response_code(401);
        echo json_encode(["error" => "Usuario o contraseña incorrectos."]);
    }
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(["error" => "Error interno del servidor."]);
}
?>