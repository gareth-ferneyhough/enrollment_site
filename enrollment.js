// Global state object.
var state = {subjectId: -1, currentProjectToUpdate: -1};

// Select the text of an input field when we click on it.
$("input[type='text']").on("click", function () {
 $(this).select();
});

function registerUpdateButtonClick() {
  $(".btn-update-project").on("click", function() {
    state.currentProjectToUpdate = this.attributes["data-proj-id"].value;
    $.ajax({
    type: "GET",
    url: "get_enrollment_states.php",
    success: processGetEnrollmentStatesResponse,        
    error: searchErrorFunction
    });   
  });
}

// Display any ajax errors in an alert box.
function searchErrorFunction(request, status, error) {
  alert(request.responseText);
}

function getUpdateButtonHtml(projectId) {
  return "<button id=\"update-project-button\" class=\"btn btn-warning btn-update-project\" data-proj-id=\"" + 
    projectId + "\">Update</button>";
}

// Process the overview for the current subject.
function processOverviewResponse(response) {
  // Clear all existing rows in the result table
  $("#pool_table > tbody > tr").remove();
  
  var json = JSON.parse(response)[0];
  var dateString = new Date(json.startDate.split(' ')[0]).toDateString();

  var pool_table_html = '<tr><td>' + json.status + '</td><td>' + 
  json.eligibility + ' (' + json.secondary + ')</td><td>' + 
  dateString + '</td><td>' +
  getUpdateButtonHtml(json.projectId) + '</td></tr>';

  $('#subj_id').html(json.subjectId);
  $('#home_id').html(json.homeId);

  $('#pool_table > tbody').append(pool_table_html);
  $('#search-results-area').show();
  $('#add-new-subject-area').hide();

  registerUpdateButtonClick();
  state.subjectId = json.subjectId;
}

// Process the list of projects for the current subject.
// This will parse the reponse, and insert table rows
// into the project table for each row retrieved from the 
// backend.
function processProjectListResponse(response) {
  // Clear all existing rows in the result table
  $("#project_table > tbody > tr").remove();
  var temp_html = '';
  $.each(JSON.parse(response), function (i, item) {
    var dateString = new Date(item.startDate.split(' ')[0]).toDateString();

    temp_html += '<tr><td>' + item.projectName + '</td><td>' +
    item.status + '</td><td>' + 
    item.eligibility + ' (' + item.secondary + ')</td><td>' + 
    dateString + '</td><td>' +
    getUpdateButtonHtml(item.projectId) + '</td></tr>';
  });  
  $('#project_table > tbody').append(temp_html);
  $('#search-results-area').show();
  $('#add-new-subject-area').hide();

  registerUpdateButtonClick();
}

function processAddSubjectResponse(response) {  
  var json = JSON.parse(response);
  var responseArea = $("#add-new-subject-area > #server-response");
  if(json.status == 'success') {
    responseArea.html("Subject enrolled successfully.");
    responseArea.removeClass();
    responseArea.addClass("text-success");
  }
  else{
    responseArea.html("Error enrolling subject: " + json.message);
    responseArea.removeClass();
    responseArea.addClass("text-warning");
  }  
}

function processGetEnrollmentStatesResponse(response) {
  alert(state.currentProjectToUpdate);
  //alert(response);
}

$("#search-subject-form").submit(function(e) {
  // Make two ajax calls: one to retrieve the subject 
  // overview (homeId, pool enrollment, etc), and one
  // to retrieve the status for all projects.
  
  $.ajax({
    type: "GET",
    url: "subject_overview.php",
    data: $("#id-input").serialize() + "&type=overview",
    success: processOverviewResponse,        
    error: searchErrorFunction
    });    

  $.ajax({
    type: "GET",
    url: "subject_overview.php",
    data: $("#id-input").serialize() + "&type=projects",
    success: processProjectListResponse,        
    error: searchErrorFunction
    });    

    return false; // avoid executing the actual submit of the form.
});

$("#add-new-subject-form").submit(function(e) { 
  $.ajax({
    type: "GET",
    url: "add_subject.php",
    data: $("#add-new-subject-form").serialize(),
    success: processAddSubjectResponse,        
    error: searchErrorFunction
    });    

    return false; // avoid executing the actual submit of the form.
});

$("#new-subject-button").click(function() {
  $('#search-results-area').hide();
  $('#add-new-subject-area').show();
});
