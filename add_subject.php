<?php
ini_set('display_startup_errors',1);
ini_set('display_errors',1);
error_reporting(-1);

include_once('db.php');

if($mysqli->connect_errno > 0){
    die('Unable to connect to database [' . $mysqli->connect_error . ']');
}

// First, we need to calculate the index value. The database provided
// does not auto-increment the index so we must do it ourselves.
$query = $mysqli->query("
    SELECT MAX(idx) AS max FROM enrollment;");
$next_idx = mysqli_fetch_assoc($query)['max'] + 1;

$query = $mysqli->query("
    INSERT INTO enrollment (status
    , projId
    , subjId
    , homeId
    , startDate
    , eligibility
    , secondary
    , idx)
    VALUES(0
    , 0
    , " . $_GET['subjectId']. " 
    , " . $_GET['homeId'] . " 
    , NOW()
    , 0
    , 0
    , " . $next_idx . ");"
    );

print $query;
?>