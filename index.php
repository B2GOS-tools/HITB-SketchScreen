<?php
  header('Access-Control-Allow-Origin: '.$_SERVER['HTTP_ORIGIN']);
    header('Access-Control-Allow-Methods: GET, PUT, POST, DELETE, OPTIONS');
    header('Access-Control-Max-Age: 1000');
    header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With');
$PDO = new PDO('mysql:host=localhost;dbname=sketchscreen', 'sketch', 'sketchpass123');
//var_dump($_POST);
if(isset($_POST['images'])) {
	$stmt = $PDO->prepare("insert into images (timestamp, data) values(UNIX_TIMESTAMP(), :data)");
	$stmt->bindValue('data', json_encode($_POST['images']));
	$stmt->execute();
}
else if(isset($_GET['action']) && $_GET['action'] == 'getimage') {
	$stmt = $PDO->prepare("SELECT data FROM images ORDER BY timestamp DESC LIMIT 1");
	$stmt->execute();
	$data = $stmt->fetchColumn();
	echo ($data);
} 

?>
