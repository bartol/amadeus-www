<div class="mobile_nav">
	<a href="/" class="mobile_nav_link<?php if (basename($_SERVER["SCRIPT_FILENAME"]) === "index.php") echo ' active'; ?>">
		<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
			<path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
			<polyline points="9 22 9 12 15 12 15 22" />
		</svg>
		<span class="mobile_nav_link_text">Početna</span>
	</a>
	<a href="/kategorije.php" class="mobile_nav_link<?php if (basename($_SERVER["SCRIPT_FILENAME"]) === "kategorije.php") echo ' active'; ?>">
		<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
			<circle cx="12" cy="12" r="10" />
			<polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76" />
		</svg>
		<span class="mobile_nav_link_text">Kategorije</span>
	</a>
	<a href="/trazilica.php" class="mobile_nav_link<?php if (basename($_SERVER["SCRIPT_FILENAME"]) === "trazilica.php") echo ' active'; ?>">
		<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
			<circle cx="11" cy="11" r="8" />
			<line x1="21" y1="21" x2="16.65" y2="16.65" />
		</svg>
		<span class="mobile_nav_link_text">Tražilica</span>
	</a>
	<a href="/kosarica.php" class="mobile_nav_link<?php if (basename($_SERVER["SCRIPT_FILENAME"]) === "kosarica.php") echo ' active'; ?>">
		<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
			<circle cx="9" cy="21" r="1" />
			<circle cx="20" cy="21" r="1" />
			<path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
		</svg>
	<span class="mobile_nav_link_text">Košarica</span>
	</a>
</div>
