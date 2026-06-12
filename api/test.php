<?php
// test.php
header("Access-Control-Allow-Origin: *"); // Allow Tauri to talk to PHP
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");

echo json_encode([
    "status" => "success",
    "message" => "PHP Backend is connected!"
]);
?>