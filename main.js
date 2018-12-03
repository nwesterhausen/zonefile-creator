// SET API
const TOOL_VERSION = "0.4";
const API_KEY = "35d6bff4686147378ebf7d20ce5a1daf";
const BASE_API_URL = "https://api.opencagedata.com/geocode/v1/json?key=" + API_KEY + "&q=";

// REGISTER EVENT LISTENERS
$("#downloadBtn").click(download);
$("#addBtn").click(addZone);
$("#clearBtn").click(clear);
$("#clearYamlBtn").click(clearYaml);
$("#copyBtn").click(copyToClipboard);

$("#title").change(validateTitle);
$("#location").change(validateLocation);
$("#zoneName").change(validateZoneName);

$("#version_number").text(TOOL_VERSION);

/**
 * Takes the generated YAML and puts it into a file that gets downloaded.
 *
 * Modified from the example here:
 * https://stackoverflow.com/a/18197341
 *
 */
function download() {
    let filename = $('#title').val() === '' ? 'zones.yaml' : $('#title').val();
    let text = '# Generated with Zone.yaml Generator for Home Assistant, version ' + TOOL_VERSION + `
` + $('#generatedYaml').text();

    var element = document.createElement('a');
    element.setAttribute('href', 'data:text/yaml;charset=utf-8,' + encodeURIComponent(text));
    element.setAttribute('download', filename);

    element.style.display = 'none';
    document.body.appendChild(element);

    element.click();

    document.body.removeChild(element);
}

/**
 * Make sure the title is not empty, and let's not duplicate '.yaml' at the end :)
 * Also replaces spaces with underscores.
 */
function validateTitle() {
    let title = $('#title').val();
    title = title.replace(/ /g, "_").toLowerCase();
    title = title.replace(/.yaml$/, "");
    $('#title').val(title + ".yaml");
}

/**
 * Performs validation on the latitude/longitude values, ensuring we can parse out two numbers from the input.
 */
function validateLocation() {
    let locationfeedback = $("#locationFeedback");
    let locationInput = $("#location");
    let locinput = locationInput.val();
    let lookupType = locationInput.attr("data-lookup-type");

    locationInput.removeClass("is-invalid is-valid");
    locationfeedback.removeClass("valid-feedback invalid-feedback");
    locationfeedback.text("");

    if (locinput === "") return;

    if (lookupType === "useAddress") {
        let sep = ',';
        if (locinput.indexOf(",") === -1) sep = ' ';

        let lat = parseFloat(locinput.split(sep)[0]);
        let lon = parseFloat(locinput.split(sep)[1]);

        if (locinput.split(sep).length === 2 && locinput.split(sep)[0].indexOf(' ') === -1 && typeof lat === "number" && typeof lon === "number") {
            locationfeedback.html("This looks like latitude and longitude, please use an address!");
            locationInput.addClass("is-invalid");
            locationfeedback.addClass("invalid-feedback");
            $("#addBtn").attr("disabled", "");
        } else {

            console.log("Looking up by address!", locinput);
            $.getJSON(BASE_API_URL + encodeURI(locinput), null, function (result) {
                console.log("Got result back!", result);
                parseLocationJSON(result);
            });
        }
    } else {

        let sep = ',';
        if (locinput.indexOf(",") === -1) sep = ' ';

        let lat = parseFloat(locinput.split(sep)[0]);
        let lon = parseFloat(locinput.split(sep)[1]);

        if (isNaN(lat) || isNaN(lon) || locinput.split(sep).length > 2  || locinput.split(sep)[0].indexOf(' ') !== -1) {
            locationfeedback.html("Please use the format <em>latitude, longitude</em>!");
            locationInput.addClass("is-invalid");
            locationfeedback.addClass("invalid-feedback");
            $("#addBtn").attr("disabled", "");
        } else {
            locationfeedback.html("Latitude: " + lat + ", Longitude: " + lon);
            locationInput.addClass("is-valid");
            locationfeedback.addClass("valid-feedback");
            locationInput.attr("data-latitude",lat);
            locationInput.attr("data-longitude",lon);
            if ($("#zoneName").hasClass("is-valid"))
                $("#addBtn").removeAttr("disabled");
        }
    }
}

/**
 * Parse location from the JSON returned by the API
 * @param json response from forward geocoding response
 */
function parseLocationJSON(json) {
    let latlonfeedback = $("#locationFeedback");
    if (json.hasOwnProperty("results") && json.results.length > 0) {
        latlonfeedback.html("Latitude: " + json.results[0].geometry.lat + ", Longitude: " + json.results[0].geometry.lng);
        $("#location").addClass("is-valid");
        latlonfeedback.addClass("valid-feedback");
        $("#location").attr("data-latitude",json.results[0].geometry.lat);
        $("#location").attr("data-longitude",json.results[0].geometry.lng);
        if ($("#zoneName").hasClass("is-valid"))
            $("#addBtn").removeAttr("disabled");
    } else {
        latlonfeedback.html("Did not get a valid response when looking up the address, see console.");
        $("#location").addClass("is-invalid");
        latlonfeedback.addClass("invalid-feedback");
        $("#addBtn").attr("disabled", "");
        console.error("API return was not as expected.", json);
    }
}

/**
 * Looks at the value in the 'zoneName' field and checks that it isn't empty.
 */
function validateZoneName() {

    $("#zoneName").removeClass("is-invalid is-valid");

    let name = $("#zoneName").val();
    let namefeedback = $("#nameFeedback");
    namefeedback.removeClass("valid-feedback invalid-feedback");

    if (name.length === 0) {
        namefeedback.html("Please use type a name!");
        $("#zoneName").addClass("is-invalid");
        namefeedback.addClass("invalid-feedback");
        $("#addBtn").attr("disabled", "");
    } else {
        namefeedback.html();
        $("#zoneName").addClass("is-valid");
        namefeedback.addClass("valid-feedback");
        if ($("#location").hasClass("is-valid"))
            $("#addBtn").removeAttr("disabled");
    }
}

/**
 * Clear the name, coordinate and radius fields. Set the icon to the default.
 */
function clear() {
    $('#zoneName').val('');
    $('#location').val('');
    $('#radius').val('');
    $('#iconSelect').val("mdi:pin-outline");
    $('#addBtn').attr("disabled", "");
}

function clearYaml() {
    $("#generatedYaml").html("");
}

/**
 * Build a zone from the values in the form, formatted as YAML.
 * This shouldn't be called unless input has been validated.
 * It will sanity check for the "is-valid" class in the name and coordinates field.
 */
function addZone() {
    if ($('#location').hasClass("is-valid") && $('#zoneName').hasClass("is-valid")) {
        let name = $('#zoneName').val();
        let latitude = $('#location').attr("data-latitude");
        let longitude = $('#location').attr("data-longitude");
        let radius = $('#radius').val() === '' ? 25 : $('#radius').val();
        let icon = $('#iconSelect').val();

        $('#generatedYaml').append(
            `- name: ` + name + `
  latitude: ` + latitude + `
  longitude: ` + longitude + `
  radius: ` + radius + `
  icon: ` + icon + `
`);

        clear();
    } else {
        console.error("Unable to create a zone because one or more of the inputs were invalid.");
    }
}

/**
 * Put text onto the clipboard
 * @param string text to put on the clipboard
 */
function copyToClipboard() {
    const copyText = document.getElementById("generatedYaml").textContent;
    const textArea = document.createElement('textarea');
    textArea.id = "tempTA";
    textArea.textContent = copyText;
    document.body.append(textArea);
    textArea.select();
    document.execCommand("copy");
    $('#tempTA').remove();
}

$('input[type="radio"]').on('click change', function (e) {
    let locationInput = $("#location");
    locationInput.attr("data-lookup-type", e.target.id);
    locationInput.removeAttr("disabled");
    locationInput.removeClass("is-invalid is-valid");
    switch (e.target.id) {
        case "useLatlon":
            locationInput.attr("placeholder", "10.5213, -7.4663");
            validateLocation();
            break;
        case "useAddress":
            locationInput.attr("placeholder", "123 Main Street, 43212");
            validateLocation();
            break;
        case "useGeoloc":
            locationInput.attr("disabled", "");
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(function (position) {
                    locationInput.attr("value", position.coords.latitude + ", " + position.coords.longitude);
                    validateLocation();
                });
            } else {
                locationInput.addClass("is-invalid");
                locationInput.attr("value", "Geolocation is not supported by this browser.");
            }
            break;
    }
});
