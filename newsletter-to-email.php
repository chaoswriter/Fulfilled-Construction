<?php
// multiple recipients
$to  = 'salimdirani@gmail.com';
$from = 'salimdirani@gmail.com';
$subject = "New Subscriber to Newsletter";

$email = $_POST['email'];

if(!filter_var($email, FILTER_VALIDATE_EMAIL))
{
  echo "<p class='bg-warning text-warning'><i class='fa fa-exclamation-triangle'></i>E-mail is not valid, please correct and resend.</p>";
  exit;
}

// message
$message = "
<html>
<head>
  <title>New Subscriber to Newsletter</title>
</head>
<body>
  <h1 style='color:#606060!important;font-family:Helvetica,Arial,sans-serif;font-size:40px;font-weight:bold;letter-spacing:-1px;line-height:115%;margin:0;padding:0;text-align:left'>
    Yippee! Your list has gained a new subscriber.
  </h1>

  <br />

  <h3 style='color:#606060!important;font-family:Helvetica,Arial,sans-serif;font-size:18px;font-weight:bold;letter-spacing:-.5px;line-height:115%;margin:0;padding:0;text-align:left'>
    Here's who subscribed:
  </h3>

  <p>$email</p>
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
  echo "<p class='bg-success text-success'><i class='fa fa-envelope'></i>You are now subscribed, Thank you.</p>";
  exit;
}else{
  echo "<p class='bg-warning text-warning'><i class='fa fa-exclamation-triangle'></i>An error has occured please try again.</p>'";
  exit;
}

?>
