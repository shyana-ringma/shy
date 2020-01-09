
const url_fd2 = "https://uinames.com/api/";
const url_fd3 = "https://uinames.com/api/?gender=male";
const url_fd4 = "https://uinames.com/api/?gender=female";
const url_fd5 = "https://uinames.com/api/?region=germany&gender=female";

function generate() {
  document.getElementById("intro").style.display = "none";
  document.getElementById("datacss").style.display = "block";
  let url = "https://uinames.com/api/?";
  var region = document.getElementById("regionlist").value;
  var gender = document.getElementById("genders").value;
  console.log("region is " + region + " gender is " + gender);
  if (region != undefined && gender != undefined) {
    url = url + "region=" + region + "&gender=" + gender;
  }
  console.log("fetching " + url);
  fetch(url)
    .then(resp => resp.json()) // Transform the data into json
    .then(function(data) {
      document.getElementById("first").innerHTML = " " + data.name;
      document.getElementById("last").innerHTML = data.surname;
      document.getElementById("gender").innerHTML = " " + data.gender;
      document.getElementById("region").innerHTML = " " + data.region;
    })
    .catch(function(error) {
      document.getElementById("content").innerHTML +=
        "Error with Food Central API: " + error;
    }); // fetch url FILL IN MISSING CODE
} // generate
