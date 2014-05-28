<?php
error_reporting(E_ALL);
$PDO = new PDO('mysql:host=localhost;dbname=sketchscreen', 'sketch', 'sketchpass123');

if(isset($_POST['images'])) {
	$stmt = $PDO->prepare("insert into images (timestamp, data) values(UNIX_TIMESTAMP(), :data)");
	$stmt->bindValue('data', $_POST['images']);
	$stmt->execute();
}
else if(isset($_GET['action']) && $_GET['action'] == 'getimage') {
	$stmt = $PDO->prepare("SELECT data FROM images ORDER BY timestamp DESC LIMIT 1");
	$stmt->execute();
	$data = $stmt->fetchColumn();
	echo ($data);
} 

?>
