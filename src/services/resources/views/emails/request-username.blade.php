<!doctype html>
<html lang="en">
<head>
	<meta charset="UTF-8">
	<title>Username Request</title>
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
	You have recently requested a username reminder.  Your username is:  {{ $username }}
	<br />
	<br />
	If you did not request a username reminder or have other questions, please contact us.
	<br />
	<br />
	Sent from {{ $app_name }} (<a href="{{ $client_url }}">{{ $client_url }}</a>).
</body>
</html>