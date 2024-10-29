<!doctype html>
<html lang="en">
<head>
	<meta charset="UTF-8">
	<title>User Account Enabled</title>
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
	Your account has been enabled by an administrator!
	<br />
	<br />
	If you have any questions please contact us.
	<br />
	<br />
	Sent from {{ $app_name }} (<a href="{{ $client_url }}">{{ $client_url }}</a>).
</body>
</html>