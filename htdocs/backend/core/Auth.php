<?php
namespace MyApp\Core;
use MyApp\Middleware\RateLimiter;

use Firebase\JWT\JWT;
use Firebase\JWT\Key;
use Exception;

class Auth {
    private static $revokedTokens = [];
    
    public static function generateToken($userId): string {
        $payload = [
            "sub" => $userId,
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

    public static function generateCookie($data): void {
        setcookie('token', $data, [
            'expires' => time() + 900,
            'path' => '/',
            'secure' => true,
            'httponly' => true,
            'samesite' => 'Strict'
        ]);
    }
}
?>