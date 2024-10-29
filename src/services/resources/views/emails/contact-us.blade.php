<!doctype html>
<html lang="en">
<head>
	<meta charset="UTF-8">
	<title>Contact Us</title>
	<style>
		body {
			font-family: sans-serif;
		}
	</style>
</head>
<body>
	{{ $name }}@if ($username) ({{ $username }})@endif sent the following contact form message:
	<br />
	<br />
	From: {{ $name }}@if ($email) &lt;{{ $email }}&gt;@endif <br />
	Subject: {{ $subject }} <br />
	{{ $message_text }}
	<br />
	<br />
	Sent from {{ $app_name }} (<a href="{{ $client_url }}">{{ $client_url }}</a>).
</body>
</html>