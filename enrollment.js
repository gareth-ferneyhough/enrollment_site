$("input[type='text']").on("click", function () {
 $(this).select();
});

$("#search-subject-form").submit(function(e) {
  var formURL = e.currentTarget.action;
  var formMethod = e.currentTarget.method;

  $.ajax({
    type: formMethod,
    url: formURL,
    data: $("#search-subject-form").serialize(),
    success: function (response) {
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
      },
      error: function(request, status, error)
      {
        alert(request.responseText);
      }
    });    
    return false; // avoid executing the actual submit of the form.
  });