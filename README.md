# Zone.yaml Generator for Home Assistant
Simple HTML Tool for creating zone.yaml files. [Use it on github.io](https://nwesterhausen.github.io/zonefile-creator/).
In [my Home Assistant setup](https://github.com/nwesterhausen/Home-Assistant-Config), I use *include_dir_merge* for my
zones configuration, and utilize zones mostly for notifications and partially for automation.

## Usage

Use the form at the top to add individual zones to your zone file.
After you're finished adding zones, download the completed YAML.

1. Input a name.
2. Input latitude and longitude you copy from a place like Google Maps.
2. (Optional) Input a radius. *defaults to `25m`*
3. (Optional) Change the icon with the dropdown
4. Click **Add**
4. Repeat those steps until all the zones you want in your zone file are created (you will see it fill in down below as you go).
5. (Optional) Specify a title for your YAML file. *defaults to `zones.yaml`*

When you are ready to download the formatted YAML, click **Download** at the bottom of the page.

### Using a zones.yaml file
You can use the [include](https://www.home-assistant.io/docs/configuration/splitting_configuration/) directive in your configuration.yaml to include an external file with your zones.

1. Put your zones.yaml file next to your configuration.yaml.
2. Add this to your configuration.yaml:
  ```yaml
  zones: !include zone.yaml
  ```

### Using multiple zones files
You can also use [configuration splitting]() to use more than one yaml file for all your zones. For example, my zones files are named after what is inside them, and I include them all into my configuration.

1. Create a folder next to your configuration.yaml file to put your zones into.
2. Put your zones.yaml files into that folder.
3. Add this to your configuration.yaml:
  ```yaml
  zones: !include_dir_merge zones
  ```
## How to run on your own computer
If you don't want to run this tool online, you can run it from your own machine.

1. Download or clone the repository to your computer.
2. If you downloaded a .zip, unpack it
3. Open `index.html` in an HTML5 capable browser (Chrome and Firefox both have been tested)

To run offline, provide offline copies of jQuery and Bootstrap. 
