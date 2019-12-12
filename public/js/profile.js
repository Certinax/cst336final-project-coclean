$(document).ready(() => {

    $("#deleteProfile").on("click", function () {
        deleteUser();
    });

    $("#updateProfile").on("click", function () {
        updateUser();
    });
});


function deleteUser() {
    $.ajax({
        url: "/profile/delete",
        method: "delete",
        dataType: "json",
        contentType: "application/json",
        data: JSON.stringify({
            password: $("#deleteProfileInput").val()
        }),
        success: function(result) {
            if (result.meta.success) {
                window.location.href = "/";
                $("#deleteFeedback").html(result.meta);
            } else {
                $("#deleteFeedback").html(result.meta.text);
            }
        }
    });
}

function updateUser() {
    $.ajax({
        url: "/profile/update",
        method: "put",
        dataType: "json",
        contentType: "application/json",
        data: JSON.stringify({
            password: $("#updatePasswordConfirm").val()
        }),
        success: function(result) {
            if (result.meta.success) {
                $("#updateFeedback").html(result.meta);
                console.log("success")
            } else {
                $("#updateFeedback").html(result.meta.text);
                console.log("fail")
            }
        }
    });
}

