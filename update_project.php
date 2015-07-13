<?php
ini_set('display_startup_errors',1);
ini_set('display_errors',1);
error_reporting(-1);

include_once('common.php');
include_once('db.php');

if($mysqli->connect_errno > 0){
    die('Unable to connect to database [' . $mysqli->connect_error . ']');
}

// Insert a new row into the enrollment table showing the updated enrollment.
$subjId = $_POST['subject_id'];
$projId = $_POST['project_id'];
$status = $_POST['enrollment-states'];
$eligibility = $_POST['eligibility-states'];
$secondary = $_POST['eligibility-sub-states'];

// We need to calculate the index value. The database provided
// does not auto-increment the index so we must do it ourselves.
$query = $mysqli->query("
    SELECT MAX(idx) AS max FROM enrollment;");
$next_idx = mysqli_fetch_assoc($query)['max'] + 1;

// Get the homeId for the current subject
$query = $mysqli->query("
    SELECT homeId FROM enrollment
    WHERE subjId = " . $subjId . "
    LIMIT 1;");
$homeId = mysqli_fetch_assoc($query)['homeId'];

$query = $mysqli->query("
    INSERT INTO enrollment (status
    , projId
    , subjId
    , homeId
    , startDate
    , eligibility
    , secondary
    , idx)
    VALUES(" . $status . "
    , " . $projId . "
    , " . $subjId . " 
    , " . $homeId . " 
    , NOW()
    , " . $eligibility . "
    , " . $secondary . "
    , " . $next_idx . ");"
    );

    print create_response_string('success', NULL, NULL);
?>