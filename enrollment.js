// Global state object.
var state = {subjectId: -1, currentProjectId: -1, projectIdMap: {}, eligibilityStatesMap: {}};

// Select the text of an input field when we click on it.
$("input[type='text']").on("click", function () {
 $(this).select();
});

function populateEligibilitySubStatesDropdown(eligibility_state_index, current_eligibility_sub_state) {
  // Empty and repopulate the eligibility sub state drop down.
  // This is called every time the user changed the option of the eligibility state.
  // Yes, this is inefficient. 
  $('#update-area > form > #eligibility-sub-states').empty();
  if(typeof(state.eligibilityStatesMap[eligibility_state_index]) == 'undefined'){
    return;
  }
  var temp_html = '';
  $.each(state.eligibilityStatesMap[eligibility_state_index], function (i, item) {
    temp_html += '<option value=' + item.id;
    if(current_eligibility_sub_state == item.id) { // mark as selected if need be
      temp_html += ' selected';
    }
    temp_html += '>' + item.title + '</option>';
  }); 
  
  $('#update-area > form > #eligibility-sub-states').append(temp_html);
}

function registerUpdateButtonClick() {
  $(".btn-update-project").on("click", function() {
    // Save the state so we know what project the user selected
    state.currentProjectId = this.attributes["data-proj-id"].value;

    $.ajax({
    type: "GET",
    url: "get_enrollment_states.php",
    data: "subject_id=" + state.subjectId + 
      "&project_id=" + state.currentProjectId,
    success: processGetEnrollmentStatesResponse,        
    error: searchErrorFunction
    });   
  });
}

function setAppDisplayState(state) {
  switch(state) {
    case 'home':
      $('#search-results-area').hide();
      $('#add-new-subject-area').hide();
      $('#update-area').hide();
    break;

    case 'searchResults':
      $('#search-results-area').show();
      $('#add-new-subject-area').hide();
      $('#update-area').hide();
    break;

    case 'addNewSubject':
      $('#search-results-area').hide();
      $('#add-new-subject-area').show();
      $('#update-area').hide();
    break;

    case 'updateProject':
      $('#search-results-area').hide();
      $('#add-new-subject-area').hide();
      $('#update-area').show();
    break;
  }
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

  // Populate our map from projectIds to their descriptions.
  state.projectIdMap[json.projectId] = "Pool";

  $('#subj_id').html(json.subjectId);
  $('#home_id').html(json.homeId);

  $('#pool_table > tbody').append(pool_table_html);

  registerUpdateButtonClick();
  state.subjectId = json.subjectId;
  setAppDisplayState("searchResults");
}

// Process the list of projects for the current subject.
// This will parse the reponse, and insert table rows
// into the project table for each row retrieved from the 
// backend.
function processProjectListResponse(response) {
  // Clear our projectIds map.
  state.projectIdsMap = {};

  // Clear all existing rows in the result table
  $("#project_table > tbody > tr").remove();
  var temp_html = '';
  $.each(JSON.parse(response), function (i, item) {
    var myDate = new Date(item.startDate.split(' ')[0]);
    // // Super-hack to prevent Date from applying a timezone offset
    // myDate.setHours(myDate.getHours() - 
    //   myDate.getTimezoneOffset() / 60);
    var dateString = myDate.toDateString();    

    temp_html += '<tr><td>' + item.projectName + '</td><td>' +
    item.status + '</td><td>' + 
    item.eligibility + ' (' + item.secondary + ')</td><td>' + 
    dateString + '</td><td>' +
    getUpdateButtonHtml(item.projectId) + '</td></tr>';

    // Populate our map from projectIds to their descriptions.
    state.projectIdMap[item.projectId] = item.projectName;
  });  
  $('#project_table > tbody').append(temp_html);

  registerUpdateButtonClick();
  setAppDisplayState("searchResults");
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
  // Populate subjectId and project name
  $("#update-area > #subject-id").html(state.subjectId);
  $("#update-area > #project-name").html(state.projectIdMap[state.currentProjectId]);

  // Clear all existing dropdowns
  $("#update-area > form > select > option").remove();

  var json = JSON.parse(response);
  // Create eligibility sub state map.
  // This is inefficient, but we need to update the sub state
  // options every time the eligibility state options change.
  // Let's create a map of eligibility states which map to 
  // their corresponding sub state ids and names, then populate the 
  // sub state options in the handler for the eligibility state changed event. 
  state.eligibilityStatesMap = {};
  $.each(JSON.parse(json.data.eligibility_sub_states), function (i, item) {
    if(typeof(state.eligibilityStatesMap[item.StateId]) == 'undefined'){
      state.eligibilityStatesMap[item.StateId] = [];
    }
    state.eligibilityStatesMap[item.StateId].push(
      {'id': item.SubStateId, 'title': item.Title});
  });

  // Parse the current states from the response, so we can ensure
  // that they are currently selected in the dropdown.
  var current_states = JSON.parse(json.data.current_states)[0];
  var enrollment_state = current_states.enrollment_state;
  var eligibility_state = current_states.eligibility_state;
  var eligibility_sub_state = current_states.eligibility_sub_state;

  // Populate enrollment state dropdown
  var temp_html = '';
  $.each(JSON.parse(json.data.enrollment_states), function (i, item) {
    temp_html += '<option value=' + item.stateId;
    if(enrollment_state == item.stateId) { // mark as selected if need be
      temp_html += ' selected';
    }
    temp_html += '>' + item.Name + '</option>';
  });  
  $('#update-area > form > #enrollment-states').append(temp_html);

  // Populate eligibility state dropdown
  temp_html = '';
  $.each(JSON.parse(json.data.eligibility_states), function (i, item) {
    temp_html += '<option value=' + item.StateId;
    if(eligibility_state == item.StateId) { // mark as selected if need be
      temp_html += ' selected';
      populateEligibilitySubStatesDropdown(item.StateId, eligibility_sub_state);
    }
    temp_html += '>' + item.Title + '</option>';
  });  
  $('#update-area > form > #eligibility-states').append(temp_html);

  setAppDisplayState('updateProject');
}

function processUpdateResponse(response) {
  // Just performed update, so requery the server
  // and re-show the subjects projects.
  searchSubjectFormSubmit();
}

function searchSubjectFormSubmit(e) {
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
}

$("#search-subject-form").submit(function(e) {
  return searchSubjectFormSubmit(e);
});

$("#add-new-subject-form").submit(function(e) { 
  $.ajax({
    type: "POST",
    url: "add_subject.php",
    data: $("#add-new-subject-form").serialize(),
    success: processAddSubjectResponse,        
    error: searchErrorFunction
    });    

    return false; // avoid executing the actual submit of the form.
});

$("#new-subject-button").click(function() {
  setAppDisplayState("addNewSubject")
});

$('#update-area > form > #eligibility-states').change(function() {
  $("#update-area > form > #eligibility-states option:selected").each(function() {
      populateEligibilitySubStatesDropdown($(this).val(), null);
  });
});

$("#update-area > form > #btn-cancel").click(function() {
  setAppDisplayState("searchResults");
  return false; // avoid executing the actual submit of the form.
});

$("#update-area > form > #btn-save").click(function() {
    $.ajax({
    type: "POST",
    url: "update_project.php",
    data: $("#update-form").serialize() +
      "&subject_id=" + state.subjectId + 
      "&project_id=" + state.currentProjectId,
    success: processUpdateResponse,        
    error: searchErrorFunction
    });    

    return false; // avoid executing the actual submit of the form.
});
