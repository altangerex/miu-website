<?php
/**
 * Contact form handler for cPanel (datacom.mn) hosting.
 * The contact page form POSTs here. On success/failure it redirects back to
 * the page it came from with ?sent=1 or ?error=1 (the page shows a banner).
 *
 * SETUP: $TO is already set to info@miu.mn. Change it if the inbox differs.
 * Sending to a mailbox on the SAME domain/host is the most reliable.
 */

// ------- CONFIG -------
$TO      = 'info@miu.mn';
$SUBJECT_PREFIX = 'MIU.mn — Вэбсайтын мессеж';
// ----------------------

function back($path, $status) {
    // Only allow same-site relative paths (prevent open redirect).
    if (!is_string($path) || $path === '' || $path[0] !== '/' || strpos($path, '//') === 0) {
        $path = '/mn/contact/';
    }
    $sep = (strpos($path, '?') === false) ? '?' : '&';
    header('Location: ' . $path . $sep . $status . '=1#form', true, 303);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    back('/mn/contact/', 'error');
}

$next = isset($_POST['_next']) ? $_POST['_next'] : '/mn/contact/';

// Honeypot: bots fill this hidden field. Pretend success, send nothing.
if (!empty($_POST['bot-field'])) {
    back($next, 'sent');
}

$name    = trim($_POST['name']    ?? '');
$company = trim($_POST['company'] ?? '');
$email   = trim($_POST['email']   ?? '');
$phone   = trim($_POST['phone']   ?? '');
$subject = trim($_POST['subject'] ?? '');
$message = trim($_POST['message'] ?? '');

// Basic validation
if ($name === '' || $message === '' || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
    back($next, 'error');
}

// Strip header-injection attempts from single-line fields
$clean = function ($s) { return str_replace(["\r", "\n", "%0a", "%0d"], ' ', $s); };
$name    = $clean($name);
$company = $clean($company);
$email   = $clean($email);
$phone   = $clean($phone);
$subject = $clean($subject !== '' ? $subject : $SUBJECT_PREFIX);

$body  = "Нэр: {$name}\r\n";
$body .= "Байгууллага: {$company}\r\n";
$body .= "И-мэйл: {$email}\r\n";
$body .= "Утас: {$phone}\r\n";
$body .= "Сэдэв: {$subject}\r\n\r\n";
$body .= $message . "\r\n";

$headers  = 'From: MIU.mn <no-reply@' . ($_SERVER['HTTP_HOST'] ?? 'localhost') . ">\r\n";
$headers .= 'Reply-To: ' . $email . "\r\n";
$headers .= "Content-Type: text/plain; charset=UTF-8\r\n";

$ok = @mail($TO, '[' . $SUBJECT_PREFIX . '] ' . $subject, $body, $headers);

back($next, $ok ? 'sent' : 'error');
