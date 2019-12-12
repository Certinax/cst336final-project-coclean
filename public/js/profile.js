$(document).ready(() => {
  //populateProfileFields("ikh@gmail.com");
});

function populateProfileFields(userID) {
  $.ajax({
    url: `/api/user/${userID}`,
    method: "GET",
    dataType: "json",
    contentType: "application/json",
    success: function(result) {
      const { name, surname, email, school } = result.result[0];

      $("#profileFirstName").val(name);
      $("#profileLastName").val(surname);
      $("#profileEmail").val(email);
      $("#profileSchool").val(school);
    }
  });
}
