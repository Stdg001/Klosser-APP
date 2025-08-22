<?php

use MyApp\Core\ApiResponse;
use MyApp\Core\Auth;
use MyApp\Core\DB;
use MyApp\Middleware\RateLimiter;

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    header("Access-Control-Allow-Methods: POST, GET, DELETE");
}

// Auth::verifyToken();
$conn = DB::Connection($databases['db_main']);

try {
    if ($_SERVER['REQUEST_METHOD'] === 'POST') {

        // Api body request:
        // {
        //     formData: {
        //         "mode": "login" || "register",
        //         "email": "",
        //         "password": "",
        //         "name": "",
        //         "confirmPassword": "",
        //         "remember": true || false,
        //         "terms": true || false
        //     }
        // }
        
        RateLimiter::check($_SERVER['REMOTE_ADDR']);
        $input = json_decode(file_get_contents('php://input'), true);
        if (empty($input['formData']) || !isset($input['formData']['mode'])) {
            ApiResponse::error('Datos incompletos', 400);
        }

        $formData = $input['formData'];
        try {
            if ($formData['mode'] === 'login') {
                if (empty($formData['email']) || empty($formData['password'])) {
                    ApiResponse::error('Email y contraseña requeridos', 400);
                }

                $query = DB::Query($conn, 'SELECT * FROM users WHERE email = ?', [$formData['email']], 's');                
                if (empty($query['data']) || !password_verify($formData['password'], $query['data'][0]['password'])) {
                    RateLimiter::recordAttempt($_SERVER['REMOTE_ADDR']);
                    ApiResponse::error('Credenciales inválidas', 401);
                }
                
                $user = $query['data'][0];
                $token = Auth::generateToken($user['id']);
                
                $data = [
                    'user' => array_diff_key($user, ['password' => '']),
                    'token' => $token
                ];
                
            } elseif ($formData['mode'] === 'register') {
                // ¡Falta completamente la lógica de registro!
                ApiResponse::error('Modo register no implementado', 501);
            } else {
                ApiResponse::error('Modo no válido', 400);
            }

            // Generar cookie y responder
            Auth::generateCookie($data['token']);
            RateLimiter::clearAttempts($_SERVER['REMOTE_ADDR']);
            
            ApiResponse::success([
                'name' => $data['user']['name'],
                'token' => $data['token']
            ]);
                
        } catch (Exception $e) {
            RateLimiter::recordAttempt($_SERVER['REMOTE_ADDR']);
            ApiResponse::error('Error en el servidor: ' . $e->getMessage(), 500);
        }

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