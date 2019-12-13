$(document).ready(() => {
  console.log("Ready from /statistic");
  $("#getStats").on("click", function() {
    console.log("asd");
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
      console.log(result);
      $("#collective").empty();
      result.result.map(collective => {
        $("#collective").append(
          `<option value=${collective.name}>${collective.name}</option>`
        );
      });
    },
    error: function(error) {
      console.log(error);
    }
  });
}
