<!doctype html>
<html lang="en">
<head>
	<meta charset="UTF-8">
	<title>User Verification</title>
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
	To complete the registration process, click this link: 
	<a href="{{ $url }}">{{ $url }}</a>
	<br />
	<br />
	Sent from {{ $app_name }} (<a href="{{ $client_url }}">{{ $client_url }}</a>).
</body>
</html>