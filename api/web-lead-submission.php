<?php
session_start();
header("Content-Type: application/json; charset=UTF-8");

require_once __DIR__ . '/../phpmailer/PHPMailer.php';
require_once __DIR__ . '/../phpmailer/SMTP.php';
require_once __DIR__ . '/../phpmailer/Exception.php';

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

date_default_timezone_set('Asia/Kolkata');

// 1. Verify Google reCAPTCHA
$recaptchaSecret = '6Lc2wR8sAAAAAC1z2-xEHW7B-7pg-o4qBbejOeMv'; // Replace with your Google reCAPTCHA secret key
$recaptchaResponse = $_POST['g-recaptcha-response'] ?? '';
if (empty($recaptchaResponse)) {
    echo json_encode(["error" => "Please complete the CAPTCHA."]);
    exit;
}

// Verify the response with Google
$verifyResponse = file_get_contents(
    "https://www.google.com/recaptcha/api/siteverify?secret={$recaptchaSecret}&response={$recaptchaResponse}"
);
$responseData = json_decode($verifyResponse);

if (!$responseData->success) {
    echo json_encode(["error" => "CAPTCHA verification failed. Please try again."]);
    exit;
}

// 2. Get and sanitize form data
$name = trim($_POST['name'] ?? "");
$email = trim($_POST['email'] ?? "");
$mobile = trim($_POST['mobile'] ?? "");
$message = trim($_POST['message'] ?? "");
$created_at = date("Y-m-d H:i:s");

// 3. Validate email
if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    echo json_encode(["error" => "Invalid email format"]);
    exit;
}

$domain = substr(strrchr($email, "@"), 1);
if (!checkdnsrr($domain, "MX")) {
    echo json_encode(["error" => "Invalid email domain"]);
    exit;
}

// 4. Send confirmation emails
try {
    $mail = new PHPMailer(true);
    $mail->isSMTP();
    $mail->Host = 'smtp.gmail.com';
    $mail->SMTPAuth = true;
   $mail->Username = 'aaravmahima4@gmail.com';
    $mail->Password = 'xsdciteithgwpzeh'; 
    $mail->SMTPSecure = 'tls';
    $mail->Port = 587;
    $mail->CharSet = 'UTF-8';

    $mail->setFrom('aaravmahima4@gmail.com', 'Aarav');

    // --- Email to user ---
    $mail->clearAllRecipients();
    $mail->addAddress($email, $name);
    $mail->isHTML(true);
    $mail->Subject = "Thank you for contacting us!";
    $mail->Body = "
        <h3>Hello {$name}</h3>
        <p>Thank you for reaching out to us. Your request has been successfully received.</p>
        <p>Our team will contact you within one business day.</p>
        <p>Best Regards,<br>Aarav Mahima<br>TekAlgo</p>
    ";
    $mail->send();

    // --- Email to internal team ---
    $mail->clearAllRecipients();
    $mail->addAddress('vijetavarma1@gmail.com');
    // $mail->addAddress('sonishreyans2@gmail.com');
    $mail->Subject = "New Website Lead: {$name}";
   $mail->Body = "
    <p><strong>Name:</strong> {$name}<br>
    <strong>Email:</strong> {$email}<br>
    <strong>Mobile No:</strong> {$mobile}<br>
    <strong>Message:</strong> {$message}<br>
    <strong>Submitted At:</strong> {$created_at}</p>
";
    $mail->send();

    echo json_encode(["success" => "Your details have been submitted successfully!"]);

} catch (Exception $e) {
    echo json_encode(["error" => "Email could not be sent: " . $mail->ErrorInfo]);
}


?>
