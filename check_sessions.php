<?php
require 'vendor/autoload.php';
$app = require 'bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

// The session cookie from the browser request
$cookieValue = 'eyJpdiI6InZ1SnVGSC84bUFtS1BSV2c4ekhoUkE9PSIsInZhbHVlIjoiNFlIWEtOVXk1cDVKcjdQMXVEdDFadGE1ZExlcW1DNUEwb3FMQ0pVQVNNamRXbkNpbnloUWhHRmNwbnhWZk1yU3B4WkMvdkZEQUdheDc0T2Rjdjl5d2YydEpINUUwMkQ3NkJZRTBZZDAwZTNSTzZXNDVRRC9yREdOVzFMei84eUciLCJtYWMiOiIzY2ZjNWQ0ZmM5YzdmNjJmMmI5YjE1MWExN2ZjOWUzNmM0NTEzMTY1YWVjYWQyOTBiZjgzMGE3M2NlNWZiY2JhIiwidGFnIjoiIn0=';

try {
    $encrypter = app('encrypter');
    $decrypted = $encrypter->decrypt($cookieValue, false);
    echo "Decrypted session ID: " . $decrypted . PHP_EOL;

    // Check if this session exists in DB
    $exists = DB::table('sessions')->where('id', $decrypted)->exists();
    echo "Session exists in DB: " . ($exists ? 'YES' : 'NO') . PHP_EOL;

    // Show actual session in DB
    $session = DB::table('sessions')->first();
    echo "DB session ID: " . ($session ? $session->id : 'none') . PHP_EOL;
} catch (Exception $e) {
    echo "Decryption error: " . $e->getMessage() . PHP_EOL;
}

// Also test XSRF token
echo PHP_EOL . "--- XSRF Token Test ---" . PHP_EOL;
$xsrfToken = 'zdZowHhVajZr2PkkTQDjTaOYZHcpwdzgv7zUnTfG';
echo "XSRF token from browser: " . $xsrfToken . PHP_EOL;

// Try to get the CSRF token from the session payload
if (isset($session) && $session) {
    $payload = unserialize(base64_decode($session->payload));
    echo "Session _token: " . ($payload['_token'] ?? 'NOT SET') . PHP_EOL;
    echo "Tokens match: " . (hash_equals($payload['_token'] ?? '', $xsrfToken) ? 'YES' : 'NO') . PHP_EOL;
}
