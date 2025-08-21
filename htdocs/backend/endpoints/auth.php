<?php

use MyApp\Core\ApiResponse;
use MyApp\Core\Auth;
use MyApp\Core\DB;
use MyApp\Core\Perms;
use MyApp\Middleware\RateLimiter;

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    header("Access-Control-Allow-Methods: POST, GET, DELETE");
}

// Auth::verifyToken();
$conn = null; //DB::Connection($databases['db_1']);

try {
    if ($_SERVER['REQUEST_METHOD'] === 'POST') {
        $input = json_decode(file_get_contents('php://input'), true);

        ApiResponse::error($input, 400);
        if (empty($input['formData']) || $input['formData']['mode']) {
            ApiResponse::error('Datos incompletos', 400);
        }

        // Verifica rate limiting
        RateLimiter::check($_SERVER['REMOTE_ADDR']);

        // Intento de login
        $data = Auth::login($conn, $input['pass'], $input['user']);
        RateLimiter::clearAttempts($_SERVER['REMOTE_ADDR']);  // Limpia intentos si es exitoso'

        setcookie('token', $data['token'], [
            'expires' => time() + 900,
            'path' => '/',
            'secure' => true,
            'httponly' => true,
            'samesite' => 'Strict'
        ]);

        ApiResponse::success([
            'name' => $data['user']['name'],
        ]);

    } elseif ($_SERVER['REQUEST_METHOD'] === 'GET') {
        $decoded = Auth::verifyToken();

    } elseif ($_SERVER['REQUEST_METHOD'] === 'DELETE') {
        $token = $_COOKIE['token'] ?? null;
        if ($token) {
            Auth::revokeToken($token);
        }
        Auth::clearAuthCookie();
        ApiResponse::success("Sesión cerrada");
    }
} catch (Exception $e) {
    RateLimiter::recordAttempt($_SERVER['REMOTE_ADDR']);  // Registra intento fallido
    ApiResponse::error($e->getMessage(), 401);
}
?>