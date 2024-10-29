<h1><i class="fa fa-paint-brush"></i>Branding</h1>

<ol class="breadcrumb">
	<li><a href="#"><i class="fa fa-home"></i>Home</a></li>
	<li><i class="fa fa-installation"></i>Installation</li>
	<li><i class="fa fa-paint-brush"></i>Branding</li>
</ol>

<div class="content">
	<p><%= application.name %> offers the ability to customize your own instance with your own aesthetics and branding.</p>

	<ol>
		<li>
			<h2><i class="fa fa-file"></i>Open Branding Configuration File</h2>
			<p>The branding and customization is controlled by a JSON file located in the "config" folder.  Open up "branding.json" in your text editor of choice. This is where the branding for your website is defined. </p>
		</li>

		<li>
			<h2><i class="fa fa-font"></i>Set Title</h2>
			<p>First, set the "title" parameter.  This controls the title that appears in your users' web browser tabs when they visit your website. </p>

			<div class="code well">
	"title": "&lt;Your Application Name Here&gt;"
			</div>
		</li>

		<li>
			<h2><i class="fa fa-image"></i>Set Header Logo</h2>
			<p>Set the header's "logo" parameter.  This controls the logo that appears in the header bar of your website. </p>

			<div class="code well">
	"header": {
		"brand": {
			"logo": {
				"src": "images/logos/logo.svg",
				"background_color": "var(--primary-color)",
				"border": "rounded"
			}
		}
	}
			</div>
		</li>

		<li>
			<h2><i class="fa fa-image"></i>Set Splash Logo</h2>
			<p>Set the header's "logo" parameter.  This controls the logo that appears in the center of the main welcome page that users first see when they visit your website. </p>

			<div class="code well">
	"welcome": {
		"splash": {
			"brand": {
				"logo": {
					"src": "images/logos/logo.svg",
					"background_color": "var(--primary-color)",
					"border": "rounded"
				}
			}
		}
	}
			</div>
		</li>

		<li>
			<h2><i class="fa fa-quote-left"></i>Set Header Logotype</h2>
			<p>Set the header's logotype.  This is your brand's name that will appear in the header bar.  Your logotype is composed of one or more names, each of which can have its own font and color. </p>

			<div class="code well">
	"header": {
		"brand": {
			"logotype": {
				"names": {
					"My ": {
						"font": "&lt;Your Brand Font Here&gt;",
						"color": "&lt;Your Brand Color Here&gt;"
					},
					"Website!": {
						"font": "&lt;Your Brand Font Here&gt;",
						"color": "&lt;Your Brand Color Here&gt;"
					},
					".com": {
						"size": "50%"
					}
				}
			}
		}
	}
			</div>
		</li>

		<li>
			<h2><i class="fa fa-quote-left"></i>Set Splash Logotype</h2>
			<p>Set the splash's "logotype" parameter.  This controls the logotype / brand name that appears in the center of the main welcome page that users first see when they visit your website. Your logotype is composed of one or more names, each of which can have its own font and color. </p>

			<div class="code well">
	"welcome": {
		"splash": {
			"logotype": {
				"names": {
					"My ": {
						"font": "&lt;Your Brand Font Here&gt;",
						"color": "&lt;Your Brand Color Here&gt;"
					},
					"Website!": {
						"font": "&lt;Your Brand Font Here&gt;",
						"color": "&lt;Your Brand Color Here&gt;"
					},
					".com": {
						"size": "50%"
					}
				}
			}
		}
	}
			</div>
		</li>

		<li>
			<h2><i class="fa fa-quote-left"></i>Set Tagline</h2>
			<p>Set the "tagline" parameter. A tagline is a succinct, catchy description of your website, company, or product. This will appear underneath your name on the main page. </p>

			<div class="code well">
	"tagline": {
		"text": "&lt;Your Tagline Here&gt;",
		"font": "&lt;Your Tagline Font Here&gt;",
		"color": "&lt;Your Tagline Color Here&gt;"
	}
			</div>
		</li>

		<li>
			<h2><i class="fa fa-quote-left"></i>Set Description</h2>
			<p>Set the "description" parameter.  The description should be a short description of what your website, company, or product does. This will appear underneath the tagline on the main page. </p>

			<div class="code well">
	"description": {
		"text": "&lt;Description of Your Web Application Here&gt;",
		"font": "&lt;Your Description Font Here&gt;",
		"color": "&lt;Your Description Color Here&gt;"
	}
			</div>
		</li>

		<li>
			<h2><i class="fa fa-file"></i>Set Page Style</h2>
			<p>You can use the "page" parameter to set the styling used on the main page of your website. Typically, this might be a color associated with your brand or a very light or very dark background color.  You can also set a "theme" which determines colors used for the page content and headings.  The "theme" parameter may have the values "standard", "light", or "dark". </p>

			<div class="code well">
	"page":{
		"background": "&lt;Your Page Background Color Here&gt;",
		"color": "&lt;Your Page Color Here&gt;",
		"theme": ""&lt;Your Page Theme Here&gt;",
		"font": ""&lt;Your Page Font Here&gt;"
	}
			</div>
		</li>

		<li>
			<h2><i class="fa fa-caret-down"></i>Set Footer</h2>
			<p>Lastly, you can control the footer displayed at the bottom of each page. </p>

			<div class="code well">
	"footer": {
		"background": ""&lt;Your Footer Background Color Here&gt;",
		"color": "&lt;Your Footer Color Here&gt;",
		"font": "&lt;Your Footer Font Here&gt;",
		"copyright": {
			"year": "&lt;Your Copyright Year Here&gt;",
			"entity": "&lt;Your Organization Name Here&gt;"
		}
	}
			</div>
		</li>
	</ol>
</div>