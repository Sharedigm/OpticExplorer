<!doctype html>
<html lang="en">
<head>
	<meta charset="UTF-8">
	<title>Password Reset</title>
	<style>
		body {
			font-family: sans-serif;
		}
	</style>
</head>
<body>
	Dear {{ $name }},
	<br />
	<br />
	You have requested to reset your password.  To do so, click this link: 
	<a href="{{ $url }}">{{ $url }}</a>
	<br />
	<br />
	If you did not request a password change or have other questions, please contact us.
	<br />
	<br />
	Sent from {{ $app_name }} (<a href="{{ $client_url }}">{{ $client_url }}</a>).
</body>
</html>