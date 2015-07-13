<?php
ini_set('display_startup_errors',1);
ini_set('display_errors',1);
error_reporting(-1);

include_once('db.php');

if($mysqli->connect_errno > 0){
    die('Unable to connect to database [' . $mysqli->connect_error . ']');
}

print $_GET['input-subject-id'] . ' ' . $_GET['input-home-id'];
// $query = $mysqli->query("
//     SELECT e.subjId AS subjectId, 
//     pl.name AS projectName,
//     status.Name as status,
//     e.startDate AS startDate,
//     es.Title AS eligibility,
//     ess.Title AS secondary
//     FROM enrollment e LEFT JOIN
//     enrollment_states status ON
//     e.status = status.StateId LEFT JOIN
//     project_list pl ON
//     e.projId = pl.projectId LEFT JOIN 
//     eligibility_states es ON
//     e.eligibility = es.StateId LEFT JOIN
//     eligibility_sub_states ess ON
//     e.eligibility = ess.StateId AND e.secondary = ess.SubStateId
//     WHERE status.Display != 0 AND
//     subjId = " . $_GET['id'] . " ORDER BY e.startDate DESC;");
// $rows = array();
// while($r = mysqli_fetch_assoc($query)) {
//     $rows[] = $r;
// }
// print json_encode($rows);
?>