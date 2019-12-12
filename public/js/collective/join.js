$(document).ready(() => {
  $("#joinbutton").on("click", () => {
    console.log("create from click");
    joinCollective();
  });
});

function joinCollective() {
  console.log("Join method");
  $.ajax({
    url: "/collective/join",
    method: "post",
    dataType: "json",
    contentType: "application/json",
    data: JSON.stringify({
      key: $("#collectiveKey").val()
    }),
    success: function(result) {
      if (result.success) {
        window.location.href = "/collective";
      } else {
        $("#joinFeedback").html(result.text);
      }
    },
    error: function(error) {
      console.log(error);
    }
  });
}
