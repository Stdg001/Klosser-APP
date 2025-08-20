<?php
namespace MyApp\Core;
use MyApp\Core\ApiResponse;
use mysqli;
use Exception;
use InvalidArgumentException;
use RuntimeException;
use mysqli_result;

class DB {
  public static function Connection($dbConfig) {
    try {
      $conn = new mysqli();
      
      // Configuración de timeouts
      $conn->options(MYSQLI_OPT_CONNECT_TIMEOUT, 3); // 3 segundos para conexión
      $conn->options(MYSQLI_OPT_READ_TIMEOUT, 30);   // 30 segundos para consultas
      
      // Configuración SSL si está habilitado
      if ($dbConfig['ssl'] ?? false) {
        $conn->ssl_set(
          '/path/to/client-key.pem',
          '/path/to/client-cert.pem',
          '/path/to/ca-cert.pem',
          NULL,
          NULL
        );
      }
      
      // Conexión real con parámetros del array
      $conn->real_connect(
        $dbConfig['host'],
        $dbConfig['user'],
        $dbConfig['pass'],
        $dbConfig['name']
      );
      
      if ($conn->connect_error) {
        throw new Exception;
      }
      
      // Configuraciones de seguridad
      $conn->set_charset("utf8mb4");
      $conn->query("SET sql_mode='STRICT_TRANS_TABLES,NO_ENGINE_SUBSTITUTION'");
      
      return $conn;
    } catch (Exception) {
      ApiResponse::error('DB Conecction Error', 503);
    }
  }

  /**
   * Executes a parameterized SQL query with improved security, error handling and caching
   * 
   * @param mysqli $conn Database connection
   * @param string $sql SQL query with placeholders
   * @param array $params Parameters to bind
   * @param string $types Parameter types (i, d, s, b)
   * @param bool $isTransaction Whether to run in transaction
   * @param bool $useCache Whether to cache the results (only for SELECT queries)
   * @param int $cacheTTL Cache time to live in seconds (default 300 = 5 minutes)
   * @return array Structured response with results
   * @throws InvalidArgumentException|RuntimeException On errors
   */
  public static function Query(
      mysqli $conn, 
      string $sql = '', 
      array $params = [], 
      string $types = '', 
      bool $isTransaction = false,
      bool $useCache = true,
      int $cacheTTL = 300
  ): array {
      // Static cache variable
      static $queryCache = [];
      static $lastCacheCleanup = 0;
      
      try {
          // Clean cache every hour if it grows too large
          if (time() - $lastCacheCleanup > 3600 || count($queryCache) > 1000) {
              self::cleanCache($queryCache, $cacheTTL);
              $lastCacheCleanup = time();
          }
          
          // Validación básica de la conexión
          if (!$conn instanceof mysqli) {
              throw new InvalidArgumentException("Invalid database connection");
          }
          
          // Validar que la consulta no esté vacía
          if (empty(trim($sql))) {
              throw new InvalidArgumentException("Empty query");
          }
          
          // Configurar límite de tiempo de ejecución
          set_time_limit(MAX_EXECUTION_TIME);
          
          // Transformar consultas con parámetros con nombre a ?
          if (preg_match_all('/:(\w+)/', $sql, $matches)) {
              $namedParams = $matches[1];
              $sql = preg_replace('/:\w+/', '?', $sql);
              
              // Reordenar params según los nombres
              $orderedParams = [];
              foreach ($namedParams as $name) {
                  if (!array_key_exists($name, $params)) {
                      throw new InvalidArgumentException("Missing parameter: $name");
                  }
                  $orderedParams[] = $params[$name];
              }
              $params = $orderedParams;
          }
          
          // Generar clave de caché
          $cacheKey = md5($sql . serialize($params) . ($isTransaction ? '_tx' : ''));
          
          // Verificar caché solo para SELECT y si useCache es true
          $isSelectQuery = stripos(trim($sql), 'SELECT') === 0;
          if ($isSelectQuery && $useCache && isset($queryCache[$cacheKey])) {
              $cached = $queryCache[$cacheKey];
              if (time() - $cached['timestamp'] <= $cacheTTL) {
                  return $cached['data'];
              }
              unset($queryCache[$cacheKey]); // Eliminar entrada expirada
          }
          
          // Detección de consultas potencialmente peligrosas
          $forbiddenPatterns = [
              '/\b(ALTER|CREATE|DROP|RENAME|TRUNCATE)\b/i',
              '/\b(GRANT|REVOKE)\b/i',
              '/\b(INSERT|UPDATE|DELETE)\b.+?\b(SYSTEM\.|INFORMATION_SCHEMA\.|mysql\.)/i',
              '/;\s*?$/',
              '/\b(UNION\s+ALL|SELECT\s+\*)\b/i',
              '/\b(LOAD_FILE|OUTFILE|DUMPFILE)\b/i',
              '/\b(SLEEP|BENCHMARK)\b\(/i'
          ];
          
          foreach ($forbiddenPatterns as $pattern) {
              if (preg_match($pattern, $sql)) {
                  throw new RuntimeException("Dangerous query detected");
              }
          }
          
          // Iniciar transacción si se solicita
          if ($isTransaction && $conn->autocommit(false)) {
              $conn->begin_transaction();
          }
          
          // Preparar la consulta
          $stmt = $conn->prepare($sql);
          if (!$stmt) {
              throw new RuntimeException("Query preparation error: " . $conn->error);
          }
          
          // Si hay parámetros, vincularlos
          if (!empty($params)) {
              // Auto-detectar tipos si no se especifican
              if (empty($types)) {
                  $types = array_reduce($params, function($carry, $item) {
                      switch (gettype($item)) {
                          case 'integer': return $carry . 'i';
                          case 'double':  return $carry . 'd';
                          case 'string':  return $carry . 's';
                          case 'NULL':    return $carry . 's';
                          case 'boolean': return $carry . 'i';
                          default:       return $carry . 'b';
                      }
                  }, '');
              }
              
              // Validar que los tipos coincidan con los parámetros
              if (strlen($types) !== count($params)) {
                  throw new InvalidArgumentException("Number of types doesn't match parameters count");
              }
              
              // Vincular parámetros
              $stmt->bind_param($types, ...$params);
          }
          
          // Ejecución con medición de tiempo
          $start = microtime(true);
          $executed = $stmt->execute();
          $duration = microtime(true) - $start;
          
          if ($duration > MAX_EXECUTION_TIME) {
              throw new RuntimeException("Exceeded maximum execution time");
          }
          
          if (!$executed) {
              throw new RuntimeException("Query execution error: " . $stmt->error);
          }
          
          // Obtener resultados para consultas SELECT
          $result = $stmt->get_result();
          
          // Preparar respuesta estructurada
          $response = [
              'affected_rows' => $stmt->affected_rows,
              'insert_id' => $stmt->insert_id,
              'execution_time' => $duration,
              'cached' => false
          ];
          
          // Si es una consulta que devuelve resultados
          if ($result instanceof mysqli_result) {
              $data = [];
              while ($row = $result->fetch_assoc()) {
                  $data[] = $row;
              }
              $response['data'] = $data;
              
              // Almacenar en caché si es una consulta SELECT y useCache es true
              if ($isSelectQuery && $useCache) {
                  $queryCache[$cacheKey] = [
                      'data' => $response,
                      'timestamp' => time()
                  ];
              }
          }
          
          // Confirmar transacción si todo fue bien
          if ($isTransaction) {
              $conn->commit();
              $conn->autocommit(true);
          }
          
          // Registrar métricas
          self::logQueryMetrics($sql, $duration, $response['affected_rows']);
          
          return $response;
      } catch (Exception $e) {
          // Revertir transacción si estaba activa
          if ($isTransaction && isset($conn)) {
              $conn->rollback();
              $conn->autocommit(true);
          }
          
          // Registrar el error completo para debugging
          error_log("Database Error: " . $e->getMessage() . " in " . $e->getFile() . ":" . $e->getLine());
          
          // Distinguir entre diferentes tipos de errores
          $statusCode = ($e instanceof RuntimeException) ? 400 : 503;
          $errorType = ($e instanceof InvalidArgumentException) ? 'Invalid Parameters' : 'Database Error';
          
          throw new Exception($errorType . ': ' . $e->getMessage());
      }
  }

  /**
   * Cleans expired cache entries
   * 
   * @param array &$cache Reference to the cache array
   * @param int $ttl Time to live in seconds
   */
  private static function cleanCache(array &$cache, int $ttl): void {
      $currentTime = time();
      foreach ($cache as $key => $entry) {
          if ($currentTime - $entry['timestamp'] > $ttl) {
              unset($cache[$key]);
          }
      }
  }

  /**
   * Logs query metrics for monitoring
   * 
   * @param string $sql The executed query
   * @param float $duration Execution time in seconds
   * @param int $affectedRows Number of affected rows
   */
  private static function logQueryMetrics(string $sql, float $duration, int $affectedRows): void {
      $logData = [
          'query' => substr($sql, 0, 255), // Limitar longitud
          'duration' => round($duration, 4),
          'affected_rows' => $affectedRows,
          'timestamp' => date('Y-m-d H:i:s')
      ];
      
      // Escribir en archivo de log o sistema de monitoreo
      file_put_contents('query_log.json', json_encode($logData) . "\n", FILE_APPEND);
  }
}
?>