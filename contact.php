<?php
// multiple recipients
$to  = 'salimdirani@gmail.com';
$from = 'salimdirani@gmail.com';
$subject = "A visitor sent you a message while on lightpath.com";

$name = $_POST['name'];
$email = $_POST['email'];
$phone = $_POST['phone'];
$message = $_POST['message'];

if($email == '' or $message == '' or $name == ''){
  echo "One or more required fields are missing or invalid, please correct and resend.";
  exit;
}

// message
$message = "
<html>
<head>
  <title>Lightpath visitor Contact Form</title>
</head>
<body>
  <p><i>$subject</i></p>
  <p>{$message}</p>
  <ul style='list-style:none; margin:20px; color:#666'>
    <li><span style='color:#999'>-Name:</span>$name</li>
    <li><span style='color:#999'>-email:</span>$email</li>
    <li><span style='color:#999'>-email:</span>$phone</li>
  </ul>
</body>
</html>
";

// To send HTML mail, the Content-type header must be set
$headers  = 'MIME-Version: 1.0' . "\r\n";
$headers .= 'Content-type: text/html; charset=iso-8859-1' . "\r\n";
$headers .= "Reply-to: {$email}". "\r\n";

// Additional headers
//$headers .= "To: <{$to}>" . "\r\n";
$headers .= "From: $name({$subject}) <$from>" . "\r\n";
$headers .= "Cc: {$to}". "\r\n";
$headers .= "Bcc: {$to}" . "\r\n";
// Mail it
$mail_sent = @mail($to, $subject, $message, $headers);

if($mail_sent){
  echo "<span class='notice'>Your message has been sent, thank you.</span>";
  exit;
}else{
  echo "<span class='error'>We couldn't send your message please try again, thank you.</span>";
  exit;
}

?>
