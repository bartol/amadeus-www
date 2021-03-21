<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <title>amadeus2.hr admin</title>
    <meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=no">
	<link rel="stylesheet" type="text/css" href="https://cdn.jsdelivr.net/npm/normalize.css@8.0.1/normalize.min.css" />
	<link rel="stylesheet" type="text/css" href="/admin/index.css" />
	<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
	<link rel="preload" as="style" href="https://fonts.googleapis.com/css2?family=Roboto:wght@400;500&display=swap">
	<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Roboto:wght@400;500&display=swap" media="print" onload="this.media='all'">
  </head>
  <body>

    <nav id="menu">
		<ul>
		<li>Proizvodi</li>
		<li>Kategorije</li>
		</ul>
    </nav>

    <main id="panel">
		<div>
			<button class="toggle-button">☰</button>
			<br>
			<br>
			<br>
			<br>
			<input type="text" placeholder="naziv">
			<button>Košarica (1291 kn)</button>
			<!--<iframe src="https://uptime.bdeak.net/785702036" defer></iframe>-->
		</div>
    </main>



    <script src="https://cdn.jsdelivr.net/npm/slideout@1.0.1/dist/slideout.min.js"></script>
    <script>
      var slideout = new Slideout({
        'panel': document.getElementById('panel'),
        'menu': document.getElementById('menu'),
      });
      document.querySelector('.toggle-button').addEventListener('click', function() {
        slideout.toggle();
      });
    </script>

  </body>
</html>
