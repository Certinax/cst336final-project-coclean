$(document).ready(() => {

    //sign up button
    $("#signUpBtn").on("click", function () {
        createUser();
    });

});


function createUser(){
    $.ajax({
        url: "/api/user",
        method: "POST",
        dataType:  "json",
        contentType: "application/json",
        data: JSON.stringify({
            name: $("#firstname").val(),
            surname: $("#lastname").val(),
            email: $("#email").val(),
            password: $("#password").val()
        }),
        success: function (result) {
            if(result.meta.success){
                $("#modalRegisterForm").modal("hide");
                $("#modalSignIn").modal("show");
                console.log("This Worked");
            } else {
                $("#feedbkSignup").html(result.result)
            }

        }

    });
}