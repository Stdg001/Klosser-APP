<?php

require_once 'libs/JWT/JWT.php';
require_once 'libs/JWT/Key.php';

// Autoloader para MyApp\Core
spl_autoload_register(function ($class) {
  $prefix = 'MyApp\\';
  $baseDir = __DIR__ . '/';

  // Verifica si la clase pertenece a tu namespace
  if (strpos($class, $prefix) === 0) {
    $relativeClass = substr($class, strlen($prefix));
    $file = $baseDir . str_replace('\\', '/', $relativeClass) . '.php';
    
    if (file_exists($file)) {
      require $file;
    } else {
      error_log("ERROR: Archivo no encontrado para la clase $class: $file");
    }
  }
});

header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Access-Control-Allow-Credentials: true");
header('X-Content-Type-Options: nosniff');
header('X-Frame-Options: DENY');
header('X-XSS-Protection: 1; mode=block');

define('MAX_EXECUTION_TIME', 5);
define('SECRET_KEY', 'clave_secreta_123');

$databases = [
  'db_main' => [
    'host' => '---',
    'user' => '---',
    'pass' => '---',
    'name' => '---',
  ],
];

function safe_session_start() {
    if (session_status() === PHP_SESSION_NONE) {
        session_set_cookie_params([
            'lifetime' => 0,
            'path' => '/',
            'secure' => true,
            'httponly' => true,
            'samesite' => 'Strict'
        ]);

        session_start();
    } else {
        // Para depurar
        error_log("La sesión ya está iniciada antes de safe_session_start()");
    }
}
?>