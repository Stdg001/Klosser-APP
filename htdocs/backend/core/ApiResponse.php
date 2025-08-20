<?php
namespace MyApp\Core;
 
class ApiResponse {
  public static function success($data = '') {
    http_response_code(200);
    echo json_encode(['success' => true, 'data' => $data]);
    exit;
  }

  public static function error($message = '', $code = 400) {
    http_response_code($code);
    echo json_encode(['success' => false, 'error' => $message]);
    exit;
  }
}
?>