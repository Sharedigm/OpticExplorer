<!doctype html>
<html lang="en">
<head>
	<meta charset="UTF-8">
	<title>Share File by Email Attachment</title>
	<style>
		body {
			font-family: sans-serif;
		}
	</style>
</head>
<body>
	You have been invited by {{ $sender }} to share the attached file.
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