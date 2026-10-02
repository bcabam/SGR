<?php
require_once __DIR__ . "/../../config/database.php";

header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Credentials: true"); // Permite recibir la sesión
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Content-Type: application/json; charset=UTF-8");

if ($_SERVER["REQUEST_METHOD"] === "OPTIONS") {
    http_response_code(200);
    exit;
}

// INICIAR Y VALIDAR SESIÓN
session_start();
if (!isset($_SESSION['admin_id'])) {
    http_response_code(401);
    echo json_encode(["error" => "Acceso denegado. No has iniciado sesión."]);
    exit;
}

if ($_SERVER["REQUEST_METHOD"] !== "POST") {
    http_response_code(405);
    echo json_encode(["error" => "Método no permitido."]);
    exit;
}

$datos = json_decode(file_get_contents("php://input"), true);

if (!isset($datos["id"])) {
    http_response_code(400);
    echo json_encode(["error" => "Falta el ID de la delegación."]);
    exit;
}

$id = (int) $datos["id"];

if ($id <= 0) {
    http_response_code(400);
    echo json_encode(["error" => "El ID no es válido."]);
    exit;
}

try {
    $consulta = $conexion->prepare("DELETE FROM delegaciones WHERE id = :id");
    $consulta->execute([":id" => $id]);

    if ($consulta->rowCount() === 0) {
        http_response_code(404);
        echo json_encode(["error" => "La delegación no existe."]);
        exit;
    }

    echo json_encode(["mensaje" => "Delegación eliminada correctamente."]);

} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(["error" => "Error al eliminar la delegación."]);
}