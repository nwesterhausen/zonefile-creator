$("#downloadBtn").click(download);
$("#addBtn").click(addZone);
$("#clearBtn").click(clear);
$("#copyBtn").click(copyToClipboard);
$("#useCurrentLocation").click(fillinCurrentLocation);

$("#title").change(validateTitle);
$("#latlon").change(validateLatlong);
$("#zoneName").change(validateZoneName);

/**
 * Takes the generated YAML and puts it into a file that gets downloaded.
 *
 * Modified from the example here:
 * https://stackoverflow.com/a/18197341
 *
 */
function download() {
    let filename = $('#title').val()  === '' ? 'zones.yaml' : $('#title').val();
    let text = '# Generated with Zone.yaml Generator for Home Assistant' + `
` +$('#generatedYaml').text();

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
    title = title.replace(/ /g,"_").toLowerCase();
    title = title.replace(/.yaml$/,"");
    $('#title').val(title+".yaml");
}

/**
 * Performs validation on the latitude/longitude values, ensuring we can parse out two numbers from the input.
 */
function validateLatlong() {

    $("#latlon").removeClass("is-invalid is-valid");

    let latlon = $("#latlon").val();
    let latlonfeedback = $("#latlongFeedback");
    latlonfeedback.removeClass("valid-feedback invalid-feedback");

    let sep = ',';
    if (latlon.indexOf(",") === -1) sep = ' ';

    let lat = parseFloat(latlon.split(sep)[0]);
    let lon = parseFloat(latlon.split(sep)[1]);

    if (isNaN(lat) || isNaN(lon)) {
        latlonfeedback.html("Please use the format <em>latitude, longitude</em>!");
        $("#latlon").addClass("is-invalid");
        latlonfeedback.addClass("invalid-feedback");
        $("#addBtn").attr("disabled","");
    } else {
        latlonfeedback.html("Latitude: "+lat+", Longitude: "+lon);
        $("#latlon").addClass("is-valid");
        latlonfeedback.addClass("valid-feedback");
        if ($("#zoneName").hasClass("is-valid"))
            $("#addBtn").removeAttr("disabled");
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
        $("#addBtn").attr("disabled","");
    } else {
        namefeedback.html();
        $("#zoneName").addClass("is-valid");
        namefeedback.addClass("valid-feedback");
        if ($("#latlon").hasClass("is-valid"))
            $("#addBtn").removeAttr("disabled");
    }
}

/**
 * Clear the name, coordinate and radius fields. Set the icon to the default.
 */
function clear() {
    $('#zoneName').val('');
    $('#latlon').val('');
    $('#radius').val('');
    $('#iconSelect').val("mdi:pin-outline");
    $('#addBtn').attr("disabled","");
}

/**
 * Build a zone from the values in the form, formatted as YAML.
 * This shouldn't be called unless input has been validated.
 * It will sanity check for the "is-valid" class in the name and coordinates field.
 */
function addZone() {
    if ($('#latlon').hasClass("is-valid") && $('#zoneName').hasClass("is-valid")) {
        let name = $('#zoneName').val();
        let latitude = $('#latlon').val().split(',')[0];
        let longitude = $('#latlon').val().split(',')[1];
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

/**
 * Uses the geolocation API to fillin the current location
 */
function fillinCurrentLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function(position) {
            $("#latlon").attr("value",position.coords.latitude+", "+position.coords.longitude);
        });
    } else {
        $("#latlon").attr("value","Geolocation is not supported by this browser.");
    }
}