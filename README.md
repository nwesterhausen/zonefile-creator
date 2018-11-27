# Zone.yaml Generator for Home Assistant
Simple HTML Tool for creating zone.yaml files.

## How to run

1. Download or clone the repository to your computer.
2. If you downloaded a .zip, unpack it
3. Open `index.html` in an HTML5 capable browser (Chrome and Firefox both have been tested)
 
## Usage

The top section is for generating different zones from a title, latitude, and longitude. If you don't specify a radius, it will use `25`, and right now the icon is forced to `mdi:pin-outline`.

1. Input a name.
2. Input latitude and longitude you copy from a place like Google Maps.
2. (Optional) Input a radius. *defaults to `25m`*
4. Click **Add**

4. Repeat those steps until all the zones you want in your zone file are created (you will see it fill in down below as you go).

5. (Optional) Specify a title for your YAML file. *defaults to `zones.yaml`*

When you are ready to download the formatted YAML, click **Download** at the bottom of the page.