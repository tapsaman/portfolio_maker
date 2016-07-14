<?php
$fileName = "test.html";

function test_input($data)
{
	$data = trim($data);
	$data = stripslashes($data);
	$data = htmlspecialchars($data);
	return $data;
}

echo "asd1";

if ($_SERVER["REQUEST_METHOD"] == "POST")
{    
	$file = fopen($fileName, "w")or die("Unable to open file!");
	
	$text = $_POST["html"]; //test_input( $_POST["HTML"] );
	
	fwrite($file, $text);
	fclose($file);

	echo "<br>All done! (file is saved as 'test.html' in php-folder for now...)";
}

?>
