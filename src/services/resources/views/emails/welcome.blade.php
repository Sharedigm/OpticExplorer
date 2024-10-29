<!doctype html>
<html lang="en">
<head>
	<meta charset="UTF-8">
	<title>Welcome</title>
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
	Thank you for for registering for an account and we hope you enjoy using {{ $app_name }}!
	<br />
	<br />
	Sent from {{ $app_name }} (<a href="{{ $client_url }}">{{ $client_url }}</a>).
</body>
</html>