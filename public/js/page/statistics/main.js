$(document).ready(() => {
  $("#getStats").on("click", function() {
    if ($("#collectiveList").val() !== "") {
      getInfo();
    } else {
      $("#reportData")
        .empty()
        .append(
          "<p class='card-text'><span class='overdueRed'>Select a collective!</span></p>"
        );
    }
  });
  populateCollectives();
});

function insertDb() {
  $.ajax({
    url: "/statistics",
    method: "post",
    dataType: "json",
    contentType: "application/json",
    success: function(result) {
      console.log(result);
    },
    error: function(err) {
      console.log("Error");
    }
  });
}

function populateCollectives() {
  $.ajax({
    url: "/api/collective",
    method: "GET",
    dataType: "json",
    contentType: "application/json",
    success: function(result) {
      if (result.meta.success) {
        $("#collective").empty();
        result.result.map(collective => {
          $("#collectiveList").append(
            `<option value=${collective.ID}>${collective.name}</option>`
          );
        });
      }
    },
    error: function(error) {
      console.log(error);
    }
  });
}

function getInfo() {
  const endpoint = $("#stats").val();
  $.ajax({
    url: `statistics/${endpoint}`,
    method: "POST",
    dataType: "json",
    contentType: "application/json",
    data: JSON.stringify({
      id: $("#collectiveList").val()
    }),
    success: function(result) {
      console.log(result);
      if (endpoint === "members") {
        showMembers(result);
      } else if (endpoint === "overdues") {
        showOverdues(result);
      } else if (endpoint === "completed") {
        showCompleted(result);
      }
    },
    error: function(error) {
      console.log(error);
    }
  });
}

function showMembers(members) {
  const title = "Members in " + $("#collectiveList option:selected").text();
  const numOfMembers = members[0].NumOfMembers;
  $("#reportData")
    .empty()
    .append(`<h5 class="card-title">${title}</h5>`)
    .append(
      `<p class="card-text">Currently there are ${numOfMembers} people in this collective. </p>`
    )
    .append("<hr/>");
}

function showOverdues(overdues) {
  const title = "Overdues in " + $("#collectiveList option:selected").text();
  $("#reportData")
    .empty()
    .append(`<h5 class="card-title">${title}</h5>`);

  $("#reportData").append('<ul class="list-group"></ul>');
  overdues.map(person => {
    $("#reportData ul").append(
      `<li class="list-group-item d-flex justify-content-between align-items-center">${person.name}<span class="badge badge-primary badge-pill">${person.NumOfOverdues}</span></li>`
    );
  });
  $("#reportData").append("<hr class='pb-3'/>");
}

function showCompleted(completed) {
  const title = "Overdues in " + $("#collectiveList option:selected").text();
  const completion = completed[0].PercentageCompleted;
  $("#reportData")
    .empty()
    .append(`<h5 class="card-title">${title}</h5>`);

  if (!completion) {
    $("#reportData")
      .append(`<p class="card-text">This collective have no chores.</p>`)
      .append("<hr/>");
  } else {
    const completionRate = (Number.parseFloat(completion) * 100).toFixed(2);
    $("#reportData")
      .append(
        `<p class="card-text">The completion rate for chores in this collective is at ${completionRate}%.</p>`
      )
      .append("<hr/>");
  }
}
