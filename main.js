$("#downloadBtn").click(download);
$("#addBtn").click(addZone);
$("#clearBtn").click(clear);

$("#title").change(validateTitle);

function download() {
    // Modified from the example here:
    // https://stackoverflow.com/a/18197341

    // Creates a link which downloads the file, and "clicks" it.
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

function validateTitle() {
    let title = $('#title').val();
    title = title.replace(/ /g,"_").toLowerCase();
    title = title.replace(/.yaml$/,"");
    $('#title').val(title+".yaml");
}

function clear() {
    // Clears the form fields
    $('#zoneName').val('');
    $('#coordinates').val('');
    $('#radius').val('');
}

function addZone() {
    // Creates YAML for zone
    if ($('#zoneName').val() === '') {
        // fail
        return false;
    }
    if ($('#coordinates').val() === '') {
        //fail
        return false;
    }

    let name = $('#zoneName').val();
    let latitude = $('#coordinates').val().split(',')[0];
    let longitude = $('#coordinates').val().split(',')[1];
    let radius = $('#radius').val() === '' ? 25 : $('#radius').val();
    let icon = $('#iconSelect').val();

    $('#generatedYaml').append(`- name: ` + name + `
  latitude: ` + latitude + `
  longitude: ` + longitude + `
  radius: ` + radius + `
  icon: `+icon + `
`);

    clear();
}