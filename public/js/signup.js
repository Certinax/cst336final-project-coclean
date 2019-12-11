$(document).ready(() => {
  //sign up button
  $("#signUpBtn").on("click", function() {
    if (inputValidation()) {
      signUp();
      $("#modalRegisterForm")
        .find("input")
        .val("");
    } else {
      $("#feedbkSignup").html("All fields required!");
    }
  });

  $("#modalRegisterForm")
    .find("input")
    .on("blur", function() {
      inputFeedback($(this));
    })
    .keyup(e => {
      if (e.keyCode === 13) {
        signUp();
      }
    });

  $("#signupRePassword").on("blur", function() {
    passwordComparing();
  });
});

function inputFeedback(input) {
  let valid = false;
  if (!input[0].value) {
    input.next("label").attr("data-error", "");
    input.removeClass("valid");
    input.addClass("invalid");
  } else {
    input.removeClass("invalid");
    input.addClass("valid");
  }
  return valid;
}

function passwordComparing() {
  let msg = "Password doesn't match";
  if ($("#signupRePassword").val().length < 1) {
    msg = "Required field";
    return false;
  }
  if (
    $("#signupRePassword").val() !== $("#signupPassword").val() ||
    $("#signupRePassword").val().length < 1
  ) {
    $("#signupRePassword")
      .next("label")
      .attr("data-error", msg);
    $("#signupRePassword").removeClass("valid");
    $("#signupRePassword").addClass("invalid");
    return false;
  } else {
    $("#signupRePassword").removeClass("invalid");
    $("#signupRePassword").addClass("valid");
    return true;
  }
}

function allFieldsSet() {
  const data = $("#modalRegisterForm").find("input");
  let valid = true;
  data.map(input => {
    if (input.value === "") {
      valid = false;
      return valid;
    }
  });
  return valid;
}

function inputValidation() {
  if (passwordComparing() && allFieldsSet()) {
    return true;
  }
  return false;
}

function signUp() {
  $.ajax({
    url: "/signup",
    method: "POST",
    dataType: "json",
    contentType: "application/json",
    data: JSON.stringify({
      name: $("#firstname").val(),
      surname: $("#lastname").val(),
      email: $("#email").val(),
      password: $("#signupPassword").val(),
      repassword: $("#signupRePassword").val()
    }),
    success: function(result) {
      if (result.meta.success) {
        $("#modalRegisterForm").modal("hide");
        $("#creationSuccessMessage").text(result.result);
        $("#userCreationModal").modal("show");
      } else {
        $("#feedbkSignup").html(result.result);
      }
    }
  });
}
