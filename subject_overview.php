<?php
ini_set('display_startup_errors',1);
ini_set('display_errors',1);
error_reporting(-1);

include_once('common.php');
include_once('db.php');

if($mysqli->connect_errno > 0){
    die('Unable to connect to database [' . $mysqli->connect_error . ']');
}

switch($_GET["type"]) {
	case "projects":
		get_projects($mysqli, $_GET["id"]);	
		break;
	case "overview":
		get_overview($mysqli, $_GET["id"]);
}

function get_projects($mysqli, $subject_id) {
	$query = $mysqli->query("
		SELECT e1.subjId AS subjectId
		    , e1.projId AS projectId
		    , pl.name AS projectName
		    , enrollment_status.Name as status
		    , e1.startDate as startDate
		    , es.Title AS eligibility
		    , ess.Title AS secondary
		    FROM enrollment e1
		    JOIN (SELECT e2.projId,
		             MAX(e2.startDate) AS max_date
		            FROM enrollment e2 WHERE subjId = " . $subject_id . "
		            GROUP BY e2.projId) x ON x.projId = e1.projId
		                AND x.max_date = e1.startDate
		    LEFT JOIN enrollment_states enrollment_status 
		    ON e1.status = enrollment_status.StateId 
		    LEFT JOIN project_list pl 
		    ON e1.projId = pl.projectId 
		    LEFT JOIN eligibility_states es 
		    ON e1.eligibility = es.StateId 
		    LEFT JOIN eligibility_sub_states ess 
		    ON e1.eligibility = ess.StateId 
		        AND e1.secondary = ess.SubStateId
		    WHERE enrollment_status.Display != 0 
		        AND e1.projId != 0
		        AND subjId = " . $subject_id . "
		    ORDER BY e1.startDate;"
    );
	$rows = array();
	while($r = mysqli_fetch_assoc($query)) {
	    $rows[] = $r;
	}
	print json_encode($rows);
}

function get_overview($mysqli, $subject_id) {
	$query = $mysqli->query("
		SELECT e.subjId AS subjectId
			, e.projId AS projectId
			, e.homeId as homeId
			, e.RAId as raId
			, status.Name as status
			, e.startDate as startDate
			, es.Title AS eligibility
			, ess.Title AS secondary
		FROM enrollment e 
			LEFT JOIN enrollment_states status 
			ON e.status = status.StateId 			
			LEFT JOIN eligibility_states es 
			ON e.eligibility = es.StateId 
			LEFT JOIN eligibility_sub_states ess 
			ON e.eligibility = ess.StateId 
				AND e.secondary = ess.SubStateId
		WHERE projId = 0
			AND subjId = " . $subject_id . "
		ORDER BY startDate DESC
		LIMIT 1;");
	$rows = array();
	while($r = mysqli_fetch_assoc($query)) {
	    $rows[] = $r;
	}
	print json_encode($rows);
}

?>