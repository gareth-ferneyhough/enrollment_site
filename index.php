<?PHP include("header.html"); ?>
<body>
  <div class="container" id="top-level-container">
    <div id="header">
      <h3>ORCATECH Subject Enrollment - Subject View</h3>
    </div>
    <div id="search-area">
      <form class="form-inline" id="search-subject-form">
        <div class="form-group">
          <label for="id-input">Subject id:</label>
          <input type="text" class="form-control" id="id-input" name="id" placeholder="subject id">
        </div>
        <button type="submit" class="btn btn-default">Search</button>
      </form>      
      <button id="new-subject-button" class="btn btn-default">Add new subject</button>
    </div>
    <div id="search-results-area">
      <h4>Subject information:</h4>
      <div id="subject-information">
        <div class="container">
          <div class="row">
            <div class="col-md-2"><label>Subject id: </label><label id="subj_id"></label></div>
            <div class="col-md-2"><label>Home id: </label><label id="home_id"></label></div>  
            <div class="col-md-2"><button id="edit_subject_button" class="btn btn-default">Update subject information</button></div>            
          </div>
        </div>
      </div>
      <div>
        <h4>Pool:</h4>
        <table id="pool_table" class="table">
          <thead>
            <th>Current Status</th>
            <th>Eligibility</th>
            <th>As of Date</th>
            <th>Actions</th>       
          </thead>
          <tbody>
          </tbody>
        </table>
      </div>
      <div>
        <h4>Projects:</h4>
        <table id="project_table" class="table">
          <thead>
            <th>Project</th>
            <th>Current Status</th>
            <th>Eligibility</th>
            <th>As of Date</th>     
            <th>Actions</th>     
          </thead>
          <tbody>
          </tbody>
        </table>
      </div>
      <br>
      <button id="new_project_button" class="btn btn-default">Enroll in new project</button>
      <button id="view_history_button" class="btn btn-default">View enrollment history</button>
    </div>
    <div id="add-new-subject-area">
      <h4>Enter new subject information:</h4>
      <form class="form-horizontal">
        <div class="form-group">
          <label for="input-subject-id" class="col-sm-2 control-label">Subject id</label>
          <div class="col-sm-10">
            <input type="text" class="form-control" id="input-subject-id" placeholder="Subject id">
          </div>
        </div>
        <div class="form-group">
          <label for="input-home-id" class="col-sm-2 control-label">Home id</label>
          <div class="col-sm-10">
            <input type="text" class="form-control" id="input-home-id" placeholder="Home id">
          </div>
        </div>
        <div class="form-group">
          <div class="col-sm-offset-2 col-sm-10">
            <button type="submit" class="btn btn-default">Enroll</button>
          </div>
        </div>
      </form>
    </div>
  </div>
  </div>
</body>
<?PHP include("footer.html"); ?>
