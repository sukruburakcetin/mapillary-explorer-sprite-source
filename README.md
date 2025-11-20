# Mapillary Explorer Sprite Source
## Sprite Generator for Traffic Signs & Objects (Normal + @2x)
This repository stores the custom icon sprite sets used by the Mapillary Explorer widget for ArcGIS Experience Builder and related map applications.

- Mapillary traffic signs sprite and metadata

<p align="center">
  <img src="https://raw.githubusercontent.com/sukruburakcetin/mapillary-explorer-sprite-source/refs/heads/main/sprites/package_signs/package_signs.png">
</p>

- Mapillary objects(points) sprite and metadata

<p align="center">
  <img src="https://raw.githubusercontent.com/sukruburakcetin/mapillary-explorer-sprite-source/refs/heads/main/sprites/package_objects/package_objects.png">
</p>

It includes a Node.js script (generate-sprites.js) that converts all SVG icons into WebGL-compatible sprite sheets for Mapbox/ArcGIS:
```
package_objects/
  sprite.png
  sprite.json
  sprite@2x.png
  sprite@2x.json

package_signs/
  sprite.png
  sprite.json
  sprite@2x.png
  sprite@2x.json
```
These sprite sheets are consumed by vector tile layers such as:
```
const vectorTileSourceUrl =
  "https://tiles.mapillary.com/maps/vtp/mly_map_feature_traffic_sign/2/{z}/{x}/{y}?access_token=YOUR_TOKEN";

const style = {
  version: 8,
  sprite: "https://raw.githubusercontent.com/sukruburakcetin/mapillary-explorer-sprite-source/main/sprites/package_signs/sprite",
  ...
};
```
ArcGIS & Mapbox automatically load:
- sprite.png for normal displays
- sprite@2x.png for retina displays (DPR ≥ 2)

You only need to host the 4 final sprite files; individual PNG icons are not required in production.

### 1. Folder Structure
The repo should look like:
```
sprites/
 ├── package_signs/
 │    ├── sprite.png
 │    ├── sprite.json
 │    ├── sprite@2x.png
 │    └── sprite@2x.json
 ├── package_objects/
 │    ├── sprite.png
 │    ├── sprite.json
 │    ├── sprite@2x.png
 │    └── sprite@2x.json
mapillary_sprite_source/
 ├── package_signs/     ← raw input SVG icons
 └── package_objects/   ← raw input SVG icons
generate-sprites.js
README.md
```
Only mapillary_sprite_source/ contains raw SVG icons.

### 2. Installing Dependencies
Install Node.js dependencies:
```
npm install sharp
```
### 3. Running the Sprite Generator
To generate sprites for package_objects:
```
node generate-sprites.js
```
Or edit the script's inDir to point to package_signs instead:
```
const inDir = './mapillary_sprite_source/package_signs';
```
The script will automatically create:
```
pngs/
pngs@2x/
```
And output:
```
pngs/sprite.png
pngs/sprite.json
pngs@2x/sprite@2x.png
pngs@2x/sprite@2x.json
```
Move them into:
```
sprites/package_signs/
```
or
```
sprites/package_objects/
```
depending on the category.

### 4. How the Script Works
The script:
1. Reads all .svg files in mapillary_sprite_source/<category>
2. Converts each SVG to a 32×32 PNG
3. Arranges them into a grid (max 1024px width)
- Prevents hitting WebGL 16,384px sprite size limit

4. Generates:
- sprite.png
- sprite.json
- sprite@2x.png
- sprite@2x.json

Even the @2x variant uses 32×32 icons to avoid huge icons on mobile and maintain layout consistency.

### 5. Using the Sprite in ArcGIS Experience Builder

Point your VectorTileLayer style to the hosted sprite:
```
const spriteBaseUrl =
  "https://raw.githubusercontent.com/sukruburakcetin/mapillary-explorer-sprite-source/main/sprites/package_signs/sprite";

const style = {
  version: 8,
  sprite: spriteBaseUrl,
  layers: [
    {
      id: "traffic-signs-icons",
      type: "symbol",
      source: "mapillary-traffic-signs",
      layout: {
        "icon-image": ["get", "value"],
        "icon-size": 1
      }
    }
  ]
};
```
ArcGIS will automatically try to fetch:
```
sprite.png
sprite.json
sprite@2x.png
sprite@2x.json
```

### 6. Hosting on GitHub
All final sprite files must be committed:
```
sprites/package_signs/sprite.png
sprites/package_signs/sprite.json
sprites/package_signs/sprite@2x.png
sprites/package_signs/sprite@2x.json
```
GitHub Raw URLs work perfectly for Mapbox/ArcGIS.

### 7. Notes & Best Practices
- SVGs should all be vector, not PNG-in-SVG
To avoid blurry output.

- Keep icons centered in the SVG
So the 32×32 result aligns properly.

- No need to upload individual PNG files
Only sprite sheets + JSON are used in production.

Grid layout ensures:
- Smaller sprite size
- Faster loading
- Avoiding WebGL limits (max 16,384px)

### 8. Regenerating After Icon Changes
Whenever you:
- Add a new SVG
- Delete an icon
- Rename icons
- Update SVG artwork

Just run:
```
node generate-sprites.js
```
and commit updated sprite files.

## License

Traffic sign sources and sprites are based on open data from [Mapillary.com](https://www.mapillary.com).
