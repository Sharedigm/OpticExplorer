<!doctype html>
<html lang="en">
<head>
	<meta charset="UTF-8">
	<title>Password Changed</title>
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
	Your password was recently changed.  
	<br />
	<br />
	If this action was not undertaken by you or by your request, please contact us.
	<br />
	<br />
	Sent from {{ $app_name }} (<a href="{{ $client_url }}">{{ $client_url }}</a>).
</body>
</html>