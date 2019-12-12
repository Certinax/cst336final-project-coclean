$(document).ready(() => {
  console.log("Loaded...");

  $("#createCollective").on("click", () => {
    console.log("create from click");
    createCollective();
  });
});

function createCollective() {
  $.ajax({
    url: "/collective/create",
    method: "post",
    dataType: "json",
    contentType: "application/json",
    data: JSON.stringify({
      name: $("#collectiveName").val(),
      description: $("#description").val(),
      school: $("#school").val()
    }),
    success: function(result) {
      console.log(result);
      if (result.success) {
        window.location.href = "/collective";
      } else {
        $("#collectiveFeedback").html(result.text);
      }
    },
    error: function(error) {
      console.log(error);
    }
  });
}
