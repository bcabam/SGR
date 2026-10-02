<?php
header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Credentials: true");
header("Content-Type: application/json; charset=UTF-8");

session_start();
session_unset();
session_destroy();

http_response_code(200);
echo json_encode(["mensaje" => "Sesión cerrada correctamente."]);
?>