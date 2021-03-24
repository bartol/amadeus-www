<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <title>amadeus2.hr admin</title>
    <meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=no">
	<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/normalize.css@8.0.1/normalize.min.css">
	<link rel="stylesheet" href="/admin/index.css">
	<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/photoswipe@4.1.3/dist/photoswipe.min.css">
	<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/photoswipe@4.1.3/dist/default-skin/default-skin.min.css">
	<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
	<link rel="preload" as="style" href="https://fonts.googleapis.com/css2?family=Roboto:wght@400;500&display=swap">
	<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Roboto:wght@400;500&display=swap" media="print" onload="this.media='all'">
  	<link rel="stylesheet" href="https://cdn.plyr.io/3.6.4/plyr.css" />
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
			<button class="toggle-button button">☰</button>
			<br>
			<br>
			<br>
			<br>
			<input type="text" class="input" placeholder="naziv">
			<button class="button-nofill">Košarica (1291 kn)</button>
			<button class="button">Košarica (1291 kn)</button>
			<br>

			<br>
			<br>
			<br>


			<div class="angled_wrapper bounce">
				<div class="angled-r">
					<div id="player" data-plyr-provider="youtube" data-plyr-embed-id="bTqVqk7FSmY"></div>
				</div>
			</div>

			<br>
			<br>
			<br>

			<div class="angled_wrapper bounce">
				<div class="angled-l">
					<div class="aspect">
						<div class="img_wrapper" onclick="pswp_init()">
							<img src="https://s3.eu-central-1.amazonaws.com/amadeus2.hr/img/2381-8202-0001186197_1.png">
						</div>
					</div>
				</div>
			</div>

			<a href="/" class="card">
				<div class="aspect-1">
					<img src="https://s3.eu-central-1.amazonaws.com/amadeus2.hr/img/2381-8202-0001186197_1.png">
				</div>
				<div class="card_label">
					<div>VIVAX SMART FLY 6 DIAMOND BLACK</div>
					<div class="prices">
						<div class="old_price">1699,00 kn</div>
						<div>1.099,00 kn (-600,00 kn)</div>
					</div>
					<div class="green dostupnost">Raspoloživo odmah</div>
				</div>
			</a>


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
			this.innerHTML = this.innerHTML === "☰" ? "⨉" : "☰"
			slideout.toggle();
		});
	</script>

	<script src="https://cdn.plyr.io/3.6.4/plyr.js"></script>
	<script>
		const player = new Plyr('#player');
	</script>

	<script>
		document.body.addEventListener('mousedown', function() {
			document.body.classList.add('using-mouse');
		});
		document.body.addEventListener('keydown', function(event) {
			if (event.keyCode === 9) {
				document.body.classList.remove('using-mouse');
			}
		});
	</script>

	<div class="pswp" tabindex="-1" role="dialog" aria-hidden="true">
		<div class="pswp__bg"></div>
		<div class="pswp__scroll-wrap">
			<div class="pswp__container">
				<div class="pswp__item"></div>
				<div class="pswp__item"></div>
				<div class="pswp__item"></div>
			</div>
			<div class="pswp__ui pswp__ui--hidden">
				<div class="pswp__top-bar">
					<div class="pswp__counter"></div>
					<button class="pswp__button pswp__button--close" title="Close (Esc)"></button>
					<button class="pswp__button pswp__button--zoom" title="Zoom in/out"></button>
					<div class="pswp__preloader">
						<div class="pswp__preloader__icn">
							<div class="pswp__preloader__cut">
								<div class="pswp__preloader__donut"></div>
							</div>
						</div>
					</div>
				</div>
				<div class="pswp__share-modal pswp__share-modal--hidden pswp__single-tap">
					<div class="pswp__share-tooltip"></div>
				</div>
				<button class="pswp__button pswp__button--arrow--left" title="Previous (arrow left)">
				</button>
				<button class="pswp__button pswp__button--arrow--right" title="Next (arrow right)">
				</button>
			</div>
		</div>
	</div>
	<script src="https://cdn.jsdelivr.net/npm/photoswipe@4.1.3/dist/photoswipe.min.js"></script>
	<script src="https://cdn.jsdelivr.net/npm/photoswipe@4.1.3/dist/photoswipe-ui-default.min.js"></script>
	<script>
		function pswp_init() {
			var el = document.querySelector('.pswp');
			var items = [
				{ src: 'https://cdn.statically.io/img/s3.eu-central-1.amazonaws.com/f=auto,q=90//amadeus2.hr/img/2381-8202-0001186197_1.png', w: 600, h: 600 },
				{ src: 'https://cdn.statically.io/img/s3.eu-central-1.amazonaws.com/f=auto,q=90//amadeus2.hr/img/1711-vivax-fly-6-637424387824536453_748_4222x.jpeg', w: 844, h: 1163 },
				{ src: 'https://cdn.statically.io/img/s3.eu-central-1.amazonaws.com/f=auto,q=90//amadeus2.hr/img/4574-vivax-fly-6-slika-4.jpeg', w: 1680, h: 1120 },
			];
			var options = {
				bgOpacity: 0.85,
				captionEl: false,
				fullscreenEl: false,
				shareEl: false,
				timeToIdle: 0,
				timeToIdleOutside: 0,
				showHideOpacity:true,
				getThumbBoundsFn:false,
			};
			var gallery = new PhotoSwipe(el, PhotoSwipeUI_Default, items, options);
			gallery.init();
		}
	</script>


</body>
</html>
