<h1><i class="<%= config.apps['calculator'].icon %>"></i><%= config.apps['calculator'].name %></h1>

<ol class="breadcrumb">
	<li><a href="#"><i class="fa fa-home"></i>Home</a></li>
	<li><a href="#apps"><i class="fa fa-rocket"></i>Apps</a></li>
	<li><i class="fa fa-calculator"></i><%= config.apps['calculator'].name %></li>
</ol>

<div class="content">
	<div class="attention icon colored <%= config.apps['calculator'].color %>">
		<img src="images/icons/apps/<%= config.apps['calculator'].image || config.apps['calculator'].app + '.svg' %>" />
	</div>

	<div class="description section">
		<p>The <%= config.apps['calculator'].name %> app lets you conveniently perform algebraic, scientific, or computational calculations. </p>
	</div>

	<div class="details section">
		<div class="row">
			<div class="col-sm-6">
				<h2><i class="fa fa-check"></i>Features</h2>
				<ul>
					<li>Basic, scientific, and programmer calculator modes</li>
					<li>Basic arthmetic operations: add, subtract mulitply, and divide</li>
					<li>Square root and power functions</li>
					<li>Trigonometric functions</li>
					<li>Logarithmic functions</li>
					<li>Mathmatical constants, pi and e</li>
					<li>Memory storage functions</li>
					<li>Base conversions functions (binary, octal, decimal, and hexidecimal)</li>
					<li>Bitwise logical operations (and, or, xor, not)</li>
					<li>Bit shifting operations (shift left, shift right, rotate left, rotate right)</li>
				</ul>
			</div>
			<div class="col-sm-6">
				<h2><i class="fa fa-star"></i>Benefits</h2>
				<ul>
					<li>Perform basic, scientific, or programming calculations. </li>
				</ul>
			</div>
		</div>
	</div>

	<h2><i class="fa fa-desktop"></i>Screen Shots</h2>
	<div class="figure desktop-only">
		<div class="figure">
			<a href="images/info/apps/calculator/calculator.png" target="_blank" class="lightbox" title="<%= config.apps['calculator'].name %>"><img class="dialog" src="images/info/apps/calculator/calculator.png" style="width:300px" /></a>
			<div class="caption"><%= config.apps['calculator'].name %></div>
		</div>
	</div>
	<div class="figure row desktop-only">
		<div class="figure col-sm-6">
			<a href="images/info/apps/calculator/scientific-calculator.png" target="_blank" class="lightbox" title="Scientific <%= config.apps['calculator'].name %>"><img class="dialog" src="images/info/apps/calculator/scientific-calculator.png" style="width:300px" /></a>
			<div class="caption">Scientific <%= config.apps['calculator'].name %></div>
		</div>
		<div class="figure col-sm-6">
			<a href="images/info/apps/calculator/programmer-calculator.png" target="_blank" class="lightbox" title="Programmer <%= config.apps['calculator'].name %>"><img class="dialog" src="images/info/apps/calculator/programmer-calculator.png" style="width:300px" /></a>
			<div class="caption">Programmer <%= config.apps['calculator'].name %></div>
		</div>
	</div>
	<div class="figure row mobile-only">
		<div class="figure col-sm-6">
			<a href="images/info/apps/calculator/mobile/mobile-calculator.png" target="_blank" class="lightbox" title="<%= config.apps['calculator'].name %>"><img class="dialog" src="images/info/apps/calculator/mobile/mobile-calculator.png" /></a>
			<div class="caption"><%= config.apps['calculator'].name %></div>
		</div>
		<div class="figure col-sm-6">
			<a href="images/info/apps/calculator/mobile/mobile-scientific-calculator.png" target="_blank" class="lightbox" title="Scientific <%= config.apps['calculator'].name %>"><img class="dialog" src="images/info/apps/calculator/mobile/mobile-scientific-calculator.png" /></a>
			<div class="caption">Scientific <%= config.apps['calculator'].name %></div>
		</div>
		<div class="figure col-sm-6">
			<a href="images/info/apps/calculator/mobile/mobile-programmer-calculator.png" target="_blank" class="lightbox" title="Programmer <%= config.apps['calculator'].name %>"><img class="dialog" src="images/info/apps/calculator/mobile/mobile-programmer-calculator.png" /></a>
			<div class="caption">Programmer <%= config.apps['calculator'].name %></div>
		</div>
	</div>
</div>