$("input[type='text']").on("click", function () {
 $(this).select();
});

$("#search-subject-form").submit(function(e) {
  var formURL = e.currentTarget.action;
  var formMethod = e.currentTarget.method;
  debugger;

  $.ajax({
    type: formMethod,
    url: formURL,
    data: $("#search-subject-form").serialize(),
    success: function (response) {
        // Clear all existing rows in the result table
        $("#project_table > tbody > tr").remove();

        var trHTML = '';
        $.each(JSON.parse(response), function (i, item) {              
          trHTML += '<tr><td>' + item.projectName + '</td><td>' +
          item.status + '</td><td>' + 
          item.eligibility + ' (' + item.secondary + ')</td><td>' + 
          item.startDate + '</td></tr>';
        });
        $('#project_table > tbody').append(trHTML);
      },
      error: function(request, status, error)
      {
        alert(request.responseText);
      }
    });    
    return false; // avoid executing the actual submit of the form.
  });