<!doctype html>
<html lang="en">
<head>
	<meta charset="UTF-8">
	<title>Share File by Email Link</title>
	<style>
		body {
			font-family: sans-serif;
		}
	</style>
</head>
<body>
	You have been invited by {{ $sender }} to share the following file: 
	<a href="{{ $url }}">{{ $url }}</a>
	<br />
	<br />
	To download this file, just click the link above. 	
	@if ($senderMessage)
	The sender included the following message:
	<br />
	<br />
	"{{ $senderMessage }}"
	@endif
	<br />
	<br />
	Sent from {{ $app_name }} (<a href="{{ $client_url }}">{{ $client_url }}</a>).
</body>
</html>