const express = require("express");
const router = express.Router();
const axios = require("axios");
const url = require("url");


/*router.get("/", function(req, res) {
  res.render("profile", {
    profile: true,
    title: "User Profile",
    username: "Christina"
  });
});*/

router.get("/", function(req, res) {
  const requrl = url.format({
    protocol: req.protocol,
    host: req.get("host")
  });

  const apiURL = `${requrl}/api/user/ikh@gmail.com`;

  axios
      .get(apiURL)
      .then(function(result) {
          const {
              name,
              surname,
              email,
              school
          } = result.data.result[0];
          res.render("profile", {
              profile: true,
              title: "User Profile",
              username: name,
              lastname: surname,
              email: email,
              school: school
          });
      })
      .catch(function(error) {
        console.log(error);
      });
});


function populateProfileFields(userID){
    $.ajax({
        url: `/api/user/${userID}`,
        method: "GET",
        dataType:  "json",
        contentType: "application/json",
        success: function (result) {
            const {
                name,
                surname,
                email,
                school
            } = result.result[0];

            $("#profileFirstName").val(name);
            $("#profileLastName").val(surname);
            $("#profileEmail").val(email);
            $("#profileSchool").val(school);
        }

    });
}




module.exports = router;
