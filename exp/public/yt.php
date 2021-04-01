<?php
$GOOGLE_API_KEY = "";
$query = rawurlencode($_GET["query"]);
$data = file_get_contents("https://youtube.googleapis.com/youtube/v3/search?part=snippet&q=$query&regionCode=HR&maxResults=10&key=$GOOGLE_API_KEY");
$json = json_decode($data, true);
?>

<form>
	<input type="text" name="query">
	<button type="submit">Search</button>
</form>

<?php foreach($json["items"] as $key=>$value): ?>
<div class="yt_search_result">
	<input type="radio" name="yt_video" value="<?= $value["id"]["videoId"] ?>">
	<a href="https://www.youtube.com/watch?v=<?= $value["id"]["videoId"] ?>" target="_blank" rel="noopener noreferrer">
		<img src="<?= $value["snippet"]["thumbnails"]["default"]["url"] ?>"
			width="<?= $value["snippet"]["thumbnails"]["default"]["width"] ?>"
			height="<?= $value["snippet"]["thumbnails"]["default"]["height"] ?>">
	</a>
	<div>
		<a href="https://www.youtube.com/watch?v=<?= $value["id"]["videoId"] ?>" target="_blank" rel="noopener noreferrer">
			<?= $value["snippet"]["title"] ?>
		</a><br>
		<small><?= $value["snippet"]["channelTitle"] ?></small>
	</div>
</div>
<?php endforeach ?>

<style>
.yt_search_result {
	display: flex;
	align-items: center;
}
</style>
