<?php
namespace MyApp\Core;
use MyApp\Middleware\RateLimiter;

use Firebase\JWT\JWT;
use Firebase\JWT\Key;
use Exception;

class Auth {
    private static $revokedTokens = [];
    
    public static function getUserData($conn, $username): array {
        $query = DB::Query($conn, 'SELECT * FROM workers WHERE DNI = ?', [$username], 's');
        if (empty($query['data'])) throw new Exception("Usuario no encontrado");
        return $query['data'][0];
    }

    public static function login($conn, $password, $username): array {
        RateLimiter::check($_SERVER['REMOTE_ADDR']);

        $user = self::getUserData($conn, $username);
        if (!password_verify($password, $user['password'])) {
            RateLimiter::recordAttempt($_SERVER['REMOTE_ADDR']);
            throw new Exception("Credenciales inválidas");
        }

        $token = self::generateToken($user['id'], $user['role']);
        return [
            'user' => array_diff_key($user, ['password' => '']),
            'token' => $token
        ];
    }

    private static function generateToken($userId, $role): string {
        $payload = [
            "sub" => $userId,
            "role" => $role,
            "iat" => time(),
            "exp" => time() + 900, // 15 minutos
            "jti" => bin2hex(random_bytes(16))
        ];
        return JWT::encode($payload, SECRET_KEY, 'HS256');
    }

    public static function verifyToken(): array {
        $token = $_COOKIE['token'] ?? null;
        if (!$token || in_array($token, self::$revokedTokens)) {
            self::clearAuthCookie();
            throw new Exception("Token inválido");
        }

        try {
            $decoded = JWT::decode($token, new Key(SECRET_KEY, 'HS256'));
            return (array) $decoded;
        } catch (Exception $e) {
            self::clearAuthCookie();
            throw new Exception("Error en verificación: " . $e->getMessage());
        }
    }

    public static function revokeToken($token): void {
        self::$revokedTokens[] = $token;
    }

    public static function clearAuthCookie(): void {
        setcookie('token', '', time() - 3600, '/', '', true, true);
    }
}
?>