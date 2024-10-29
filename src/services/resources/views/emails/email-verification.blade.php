<!doctype html>
<html lang="en">
<head>
	<meta charset="UTF-8">
	<title>Email Verification</title>
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
	Your email address has recently been requested to change to this address.
	<br />
	<br />
	To use this email address, click the following link: 
	<a href="{{ $url }}">{{ $url }}</a>
	<br />
	<br />
	If you have any questions please contact us.
	<br />
	<br />
	Sent from {{ $app_name }} (<a href="{{ $client_url }}">{{ $client_url }}</a>).
</body>
</html>