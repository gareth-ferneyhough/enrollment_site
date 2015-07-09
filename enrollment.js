// Select the text of an input field when we click on it.
$("input[type='text']").on("click", function () {
 $(this).select();
});

// Display any ajax errors in an alert box.
function searchErrorFunction(request, status, error) {
  alert(request.responseText);
}

// Process the overview for the current subject.
function processOverviewResponse(response) {
  // Clear all existing rows in the result table
  $("#pool_table > tbody > tr").remove();
  
  var json = JSON.parse(response)[0];
  var dateString = new Date(json.startDate.split(' ')[0]).toDateString();

  var pool_table_html = '<tr><td>' + json.status + '</td><td>' + 
  json.eligibility + ' (' + json.secondary + ')</td><td>' + 
  dateString + '</td></tr>';

  $('#subj_id').append(json.subjectId);
  $('#home_id').append(json.homeId);
  $('#ra_id').append(json.raId);
  
  $('#pool_table > tbody').append(pool_table_html);
  $('#search-results').show();
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
    dateString + '</td></tr>';
  });  
  $('#project_table > tbody').append(temp_html);
  $('#search-results').show();
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