<?php
ini_set('display_startup_errors',1);
ini_set('display_errors',1);
error_reporting(-1);

include_once('common.php');
include_once('db.php');

if($mysqli->connect_errno > 0){
    die('Unable to connect to database [' . $mysqli->connect_error . ']');
}

$query = $mysqli->query("
    SELECT stateId, Name FROM enrollment_states;");
$rows = array();
while($r = mysqli_fetch_assoc($query)) {
    $rows[] = $r;
}
print json_encode($rows);


?>