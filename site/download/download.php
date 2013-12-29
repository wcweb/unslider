<?php 

include_once 'jsmin.php';

$file = '../../src/unslider.js';
$secondary = '../../src/unslider.fade.js';

$contents = file_get_contents($file);

echo strlen(JSMin::minify($contents));
echo '<br>';
echo strlen($contents);
echo '<br>';

$contents .= file_get_contents($secondary);

echo round(strlen($contents) / 100) / 10 . 'kb';

echo '<br>';

echo round(strlen(JSMin::minify($contents)) / 100) / 10 . 'kb';