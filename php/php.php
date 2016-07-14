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
    echo "asd2";
    
    $file = fopen($fileName, "a")or die("Unable to open file!");

    $text = $_POST["html"]; //test_input( $_POST["HTML"] );

    fwrite($file, $text);
    fclose($file);
}

?>