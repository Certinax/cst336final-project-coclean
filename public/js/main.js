$(document).ready(() => {
  $(".collapse").on("show.bs.collapse", function() {
    $(".collapse").collapse("hide");
  });

  $("#signin").on("click", () => {
    if ($("#username").val() && $("#signinPassword").val()) {
      $("#feedbkSignin").empty();
      login();
    } else {
      $("#feedbkSignin").html("All fields required!");
    }
  });

  $("#modalSignIn").keyup(e => {
    if (e.keyCode === 13) {
      login();
    }
  });

  $("#myTable").DataTable();
});

function clearSigninModal() {
  $("#modalSignIn")
    .find("input")
    .val("");
}

function login() {
  $.ajax({
    url: "/login",
    method: "POST",
    dataType: "json",
    contentType: "application/json",
    data: JSON.stringify({
      username: $("#username").val(),
      password: $("#signinPassword").val()
    }),
    success: function(result) {
      if (result.success) {
        clearSigninModal();
        $("#modalSignIn").modal("hide");
        location.reload();
      } else {
        $("#feedbkSignin").html(result.text);
      }
    },
    error: function(error) {
      console.log(error);
    },
    complete: function() {}
  });
}

function logout() {
  $.ajax({
    url: "/logout",
    method: "get",
    dataType: "json",
    contentType: "application/json",
    success: function(result) {
      if (result.success) {
        window.location.href = "/";
      }
    },
    error: function(error) {
      console.log(error);
    },
    complete: function() {}
  });
}
