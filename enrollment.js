// Select the text of an input field when we click on it.
$("input[type='text']").on("click", function () {
 $(this).select();
});

// Display any ajax errors in an altert box.
function searchErrorFunction(request, status, error) {
  alert(request.responseText);
}

// Process the list of projects for the current subject.
// This will parse the reponse, and insert table rows
// into the project table for each row retrieved from the 
// backend.
function processProjectListResponse(response) {
  // Clear all existing rows in the result table
  $("#project_table > tbody > tr").remove();
  $("#pool_table > tbody > tr").remove();

  var poolHTML = '';
  var projectHTML = '';
  $.each(JSON.parse(response), function (i, item) {
    var dateString = new Date(item.startDate.split(' ')[0]).toDateString();

    var tempHtml = '<tr><td>' + item.projectName + '</td><td>' +
    item.status + '</td><td>' + 
    item.eligibility + ' (' + item.secondary + ')</td><td>' + 
    dateString + '</td></tr>';

    if(item.projectName == "Pool") {
      poolHTML += tempHtml;
    } else {
      projectHTML += tempHtml;
    } 

  });
  $('#pool_table > tbody').append(poolHTML);
  $('#project_table > tbody').append(projectHTML);
  $('#search-results').show();
}

$("#search-subject-form").submit(function(e) {
  // Make two ajax calls: one to retrieve the subject 
  // overview (homeId, pool enrollment, etc), and one
  // to retrieve the status for all projects.
  
  $.ajax({
    type: "GET",
    url: "subject_overview.php",
    data: $("#id-input").serialize() + "&type=projects",
    success: processProjectListResponse,        
    error: searchErrorFunction
    });    
    return false; // avoid executing the actual submit of the form.
});