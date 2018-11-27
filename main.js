function download(filename, text) {
    // Modified from the example here:
    // https://stackoverflow.com/a/18197341

    // Creates a link which downloads the file, and "clicks" it.
    var element = document.createElement('a');
    element.setAttribute('href', 'data:text/yaml;charset=utf-8,' + encodeURIComponent(text));
    element.setAttribute('download', filename);

    element.style.display = 'none';
    document.body.appendChild(element);

    element.click();

    document.body.removeChild(element);
}