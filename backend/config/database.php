<?php
// database.php

$host = "localhost";
$dbname = "sgr";
$username = "root";
$password = "";

try {
    $conexion = new PDO(
        "mysql:host=$host;dbname=$dbname;charset=utf8mb4",
        $username,
        $password
    );

    $conexion->setAttribute(
        PDO::ATTR_ERRMODE,
        PDO::ERRMODE_EXCEPTION
    );
    
    $conexion->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_ASSOC);

} catch (PDOException $e) {
    header("Content-Type: application/json; charset=UTF-8");
    http_response_code(500);
    echo json_encode([
        "error" => "Error interno: No se pudo conectar a la base de datos."
    ]);
    exit;
}