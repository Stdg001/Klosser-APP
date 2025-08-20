<?php
namespace MyApp\Middleware;

use MyApp\Core\ApiResponse;

class RateLimiter {
    private static $maxAttempts = 5;  // Máximo de intentos permitidos
    private static $banTime = 300;    // Tiempo de bloqueo en segundos (5 minutos)

    public static function check($ip) {
        safe_session_start();  // Inicia la sesión si no está activa
        $key = "login_attempts_" . md5($ip);

        if (isset($_SESSION[$key])) {
            $data = $_SESSION[$key];
            if ($data['attempts'] >= self::$maxAttempts && (time() - $data['last_attempt'] < self::$banTime)) {
                // Bloquea el acceso si excede los intentos
                ApiResponse::error('Demasiados intentos. Espere 5 minutos.', 429);
            }
        }
    }

    public static function recordAttempt($ip) {
        safe_session_start();
        $key = "login_attempts_" . md5($ip);

        if (!isset($_SESSION[$key])) {
            $_SESSION[$key] = ['attempts' => 0, 'last_attempt' => time()];
        }

        $_SESSION[$key]['attempts']++;
        $_SESSION[$key]['last_attempt'] = time();
    }

    public static function clearAttempts($ip) {
        safe_session_start();
        $key = "login_attempts_" . md5($ip);
        unset($_SESSION[$key]);
    }
}
?>