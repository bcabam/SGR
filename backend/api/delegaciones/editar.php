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

/* =========================================================
   RECIBIR Y LIMPIAR DATOS
   ========================================================= */
$datos = json_decode(file_get_contents("php://input"), true);

if (!is_array($datos)) {
    http_response_code(400);
    echo json_encode(["error" => "Los datos enviados no tienen un formato válido."]);
    exit;
}

if (!isset($datos["id"]) || !isset($datos["nombre"]) || !isset($datos["responsable"]) || !isset($datos["estado"])) {
    http_response_code(400);
    echo json_encode(["error" => "Faltan datos obligatorios."]);
    exit;
}

$id = (int) $datos["id"];
$nombre = trim($datos["nombre"]);
$responsable = trim($datos["responsable"]);
$estado = trim($datos["estado"]);

if ($id <= 0) {
    http_response_code(400);
    echo json_encode(["error" => "El ID no es válido."]);
    exit;
}

/* =========================================================
   VALIDACIONES DE FORMATO Y LONGITUD
   ========================================================= */
if ($nombre === "" || $responsable === "") {
    http_response_code(400);
    echo json_encode(["error" => "El nombre y el responsable son obligatorios."]);
    exit;
}

if (mb_strlen($nombre) < 3 || mb_strlen($nombre) > 60) {
    http_response_code(400);
    echo json_encode(["error" => "El nombre de la delegación debe tener entre 3 y 60 caracteres."]);
    exit;
}

if (mb_strlen($responsable) < 3 || mb_strlen($responsable) > 60) {
    http_response_code(400);
    echo json_encode(["error" => "El nombre del responsable debe tener entre 3 y 60 caracteres."]);
    exit;
}

if (!preg_match("/^[\p{L}\s'-]+$/u", $nombre)) {
    http_response_code(400);
    echo json_encode(["error" => "El nombre de la delegación contiene caracteres no permitidos."]);
    exit;
}

if (!preg_match("/^[\p{L}\s'-]+$/u", $responsable)) {
    http_response_code(400);
    echo json_encode(["error" => "El nombre del responsable contiene caracteres no permitidos."]);
    exit;
}

if (!in_array($estado, ["Activa", "Inactiva"], true)) {
    http_response_code(400);
    echo json_encode(["error" => "El estado no es válido."]);
    exit;
}

try {
    /* =========================================================
       1. VALIDAR EXISTENCIA DEL ID
       ========================================================= */
    $consultaExiste = $conexion->prepare("SELECT id FROM delegaciones WHERE id = :id LIMIT 1");
    $consultaExiste->execute([":id" => $id]);
    
    if (!$consultaExiste->fetch()) {
        http_response_code(404);
        echo json_encode(["error" => "La delegación que intentas editar no existe."]);
        exit;
    }

    /* =========================================================
       2. VALIDAR DUPLICADOS (EXCLUYENDO EL ID ACTUAL)
       ========================================================= */
    $consultaDuplicado = $conexion->prepare(
        "SELECT id FROM delegaciones WHERE LOWER(nombre) = LOWER(:nombre) AND id != :id LIMIT 1"
    );
    $consultaDuplicado->execute([
        ":nombre" => $nombre,
        ":id" => $id
    ]);
    
    if ($consultaDuplicado->fetch()) {
        http_response_code(409);
        echo json_encode(["error" => "Ya existe otra delegación registrada con ese nombre."]);
        exit;
    }

    /* =========================================================
       3. ACTUALIZAR DELEGACIÓN
       ========================================================= */
    $consulta = $conexion->prepare(
        "UPDATE delegaciones
         SET nombre = :nombre,
             responsable = :responsable,
             estado = :estado
         WHERE id = :id"
    );

    $consulta->execute([
        ":id" => $id,
        ":nombre" => $nombre,
        ":responsable" => $responsable,
        ":estado" => $estado
    ]);

    http_response_code(200);
    echo json_encode([
        "mensaje" => "Delegación actualizada correctamente."
    ]);

} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode([
        "error" => "Error interno al actualizar la delegación."
    ]);
}