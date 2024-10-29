<!doctype html>
<html lang="en">
<head>
	<meta charset="UTF-8">
	<title>Connection Invitation</title>
	<style>
		body {
			font-family: sans-serif;
		}
	</style>
</head>
<body>
	Dear {{ $invitee_name }},
	<br />
	<br />
	You have recently been invited to become a member of the web site <a href="{{ $client_url }}">{{ $client_url }}</a> and to connect with {{ $inviter_name }}. 
	@if ($inviter_message) 
	<br />
	<br />
	{{ $inviter_name }} wrote:
	"{{ $inviter_message }}"
	@endif
	<br />
	<br />
	To become a member and connection, click the link below:
	<a href="{{ $registration_url }}">{{ $registration_url }}</a>
	<br />
	<br />
	Sent from {{ $app_name }} (<a href="{{ $client_url }}">{{ $client_url }}</a>).
</body>
</html>