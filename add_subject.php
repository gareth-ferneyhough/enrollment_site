<?php
ini_set('display_startup_errors',1);
ini_set('display_errors',1);
error_reporting(-1);

include_once('common.php');
include_once('db.php');

if($mysqli->connect_errno > 0){
    die('Unable to connect to database [' . $mysqli->connect_error . ']');
}

// Fist, we need to make sure that a subject with the given id does not exist.
$query = $mysqli->query("
    SELECT COUNT(*) AS count FROM enrollment
    WHERE subjId = " . $_POST['subjectId'] . ";");
$count = mysqli_fetch_assoc($query)['count'];
if($count > 0) {
    print create_response_string('error', 'subject already exists', NULL);
    die();
}

// Next, we need to calculate the index value. The database provided
// does not auto-increment the index so we must do it ourselves.
$query = $mysqli->query("
    SELECT MAX(idx) AS max FROM enrollment;");
$next_idx = mysqli_fetch_assoc($query)['max'] + 1;


// Now formulate the query to insert the new subject.
$poolProjectId = 0; // index of the pool 
$statusAvailable = 0;
$eligibilityStateAvailable = 0;
$eligibilitySubStateAvailable = 0;

$query = $mysqli->query("
    INSERT INTO enrollment (status
    , projId
    , subjId
    , homeId
    , startDate
    , eligibility
    , secondary
    , idx)
    VALUES(" . $statusAvailable . "
    , " . $poolProjectId . "
    , " . $_POST['subjectId']. " 
    , " . $_POST['homeId'] . " 
    , NOW()
    , " . $eligibilityStateAvailable . "
    , " . $eligibilitySubStateAvailable . "
    , " . $next_idx . ");"
    );

    print create_response_string('success', NULL, NULL);
?>