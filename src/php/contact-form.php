<?php

// Esto le dice a PHP que usaremos cadenas UTF-8 hasta el final
mb_internal_encoding('UTF-8');

// Esto le dice a PHP que generaremos cadenas UTF-8
mb_http_output('UTF-8');
if (isset($_SERVER['HTTP_ORIGIN'])) {
  // Decide if the origin in $_SERVER['HTTP_ORIGIN'] is one
  // you want to allow, and if so:
  header("Access-Control-Allow-Origin: {$_SERVER['HTTP_ORIGIN']}");
  header('Access-Control-Allow-Credentials: true');
  header('Access-Control-Max-Age: 86400');    // cache for 1 day
}
if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {

    if (isset($_SERVER['HTTP_ACCESS_CONTROL_REQUEST_METHOD']))
        // may also be using PUT, PATCH, HEAD etc
        header("Access-Control-Allow-Methods: GET, POST, OPTIONS");

    if (isset($_SERVER['HTTP_ACCESS_CONTROL_REQUEST_HEADERS']))
        header("Access-Control-Allow-Headers: {$_SERVER['HTTP_ACCESS_CONTROL_REQUEST_HEADERS']}");

    exit(0);
}

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

require './phpmailer/Exception.php';
require './phpmailer/PHPMailer.php';
require './phpmailer/SMTP.php';

$name = $_POST['name'];
$email = $_POST['email'];
$message = $_POST['message'];

// $obj = array(
//   name=>$name,
//   phone=>$phone,
//   email=>$email,
//   message=>$message,
//   col=>$col,
//   city=>$city,
//   skill=>$skill
// );


// echo json_encode( $obj, JSON_FORCE_OBJECT );

$mailto = "contacto@dagaveazul.com";
$mailto2 = "tino.navarro@hotmail.com";

function response ($msg, $status, $code, $error){
  $res=array(
    msg => $msg,
    status => $status,
    code => $code,
    error => $error
  );
  echo json_encode( $res, JSON_FORCE_OBJECT );
}

function sendEmail($name,$email, $message, $mailto, $mailto2){
  $mail = new PHPMailer(true);
  try{
    $mail->SMTPOptions = array(
      'ssl' => array(
        'verify_peer' => false,
        'verify_peer_name' => false,
        'allow_self_signed' => true
      )
    );
    $mail->SMTPDebug = 0;                                 // Enable verbose debug output
    // $mail->SMTPSecure = 'tls';
    $mail->SMTPAutoTLS = false;
    $mail->isSMTP();                                      // Set mailer to use SMTP
    $mail->Host = "localhost";  // Specify main and backup SMTP servers
    $mail->SMTPAuth = false;                               // Enable SMTP authentication
    // $mail->Username = 'rhzoluciones@gmail.com';                 // SMTP username
    // $mail->Password = 'DiazN101875*/';                           // SMTP password
    // $mail->SMTPSecure = 'tls';                            // Enable TLS encryption, `ssl` also accepted
    $mail->Port = 25;                                   // TCP port to connect to
    // $mail->SMTPKeepAlive = true;  
    $mail->Mailer = "smtp";

    //Recipients
    $mail->setFrom($email, $name);
    $mail->addAddress($mailto);
    //$mail->addAddress($mailto2);
    $mail->isHTML(true);                                  // Set email format to HTML
    $mail->CharSet = 'UTF-8';
    $mail->Subject = "Formulario de contacto destiladoraagaveazul.com";
    $mail->Body = "
      <html>
        <body>
          <h1>Formulario de Contacto</h1>
          <p>Nombre: {$name}</p>
          <p>Email: {$email}</p>
          <p>Mensaje: {$message}</p>
        </body>
      </html>
    ";
    $mail->send();
    response('Formulario enviado con éxito,</br>en breve nos pondremos en contacto con usted', true,200, null);
    
  }catch (Exception $e) {
    response('Error al tratar de enviar el mensaje,</br>por favor vuelva a intentarlo', false, 500,$mail->ErrorInfo, $email,$name,true,200);

  }
}

function validate($name,$email, $message, $mailto, $mailto2){
  if(!isset($name) || $name==='' || !isset($email) || $email==='' || !isset($message) || $message==='' ){
    response('Pro favor complete todos los campos, </br> vuelva a intentarlo',false,401,"campos imcompletos");
  }else{
    sendEmail($name,$email, $message, $mailto, $mailto2);
  }
}

validate($name,$email, $message, $mailto, $mailto2);
