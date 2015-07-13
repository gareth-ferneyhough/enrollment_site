<?php
ini_set('display_startup_errors',1);
ini_set('display_errors',1);
error_reporting(-1);

include_once('common.php');
include_once('db.php');

if($mysqli->connect_errno > 0){
    die('Unable to connect to database [' . $mysqli->connect_error . ']');
}

// First, get the current enrollment state, eligibility state,
// and eligibility substate for the current user and project.
$query = $mysqli->query("
    SELECT status AS enrollment_state, 
        eligibility AS eligibility_state,
        secondary AS eligibility_sub_state
        FROM enrollment 
        WHERE subjId = " . $_GET['subject_id'] . "
        AND projId = " . $_GET['project_id'] . ";"
    );
if(!$query){
    print create_response_string('error', 'Database error occured', NULL);
    die();
}
$rows = array();
while($r = mysqli_fetch_assoc($query)) {
    $rows[] = $r;
}

$current_states = json_encode($rows);


// Next, get the list of available enrollment states.
$query = $mysqli->query("
    SELECT stateId, Name FROM enrollment_states
        WHERE Display != 0;");
if(!$query){
    print create_response_string('error', 'Database error occured', NULL);
    die();
}
$rows = array();
while($r = mysqli_fetch_assoc($query)) {
    $rows[] = $r;
}

$enrollment_states = json_encode($rows);


// Next, get the list of available eligibility states.
$query = $mysqli->query("
    SELECT StateId, Title FROM eligibility_states;");
if(!$query){
    print create_response_string('error', 'Database error occured', NULL);
    die();
}
$rows = array();
while($r = mysqli_fetch_assoc($query)) {
    $rows[] = $r;
}

$eligibility_states = json_encode($rows);

// Create our response string.
$response = create_response_string('success', NULL, 
    array('current_states' => $current_states,
        'enrollment_states' => $enrollment_states, 
        'eligibility_states' => $eligibility_states));

print $response;
?>