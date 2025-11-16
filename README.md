# Mapillary Explorer Sprite Source
This repository also includes traffic sign sources and sprite assets derived from Mapillary.com, allowing users to display and symbolize recognized traffic signs within the Esri Experience Builder Mapillary Explorer widget.

- Mapillary traffic sign & objects(points) sprite and metadata

Includes:
- package_signs.png (sprite sheet)
- package_signs.json (layout and coordinates)

These files are generated from Mapillary traffic sign & objects(points) SVG sources
and will be used for symbol rendering in the Experience Builder widget.

# Mapillary Traffic Sign & Bbjects(Points) Sprite Builder

This guide explains how to build **Mapillary traffic sign sprite sheets** (PNG + JSON) using **Node.js 22**.  
The process converts all Mapillary traffic sign SVGs into PNG format and bundles them into a single sprite image with layout metadata.

---

## Prerequisites

- [Node.js 22+](https://nodejs.org/)
- A folder containing Mapillary traffic sign & objects(points) **SVG** files  
  (for example: `mapillary_sprite_source/package_signs`)

---

## Step-by-Step: Build the Sprite

### Create a Workspace Folder

```bash
mkdir C:\Temp\sprites
cd C:\Temp\sprites
```
Install Dependencies

Install the required npm packages:
```
npm install spritesmith glob svg2png
```
### Convert SVGs to PNGs

This step converts all .svg files into .png format.
```
node -e "const svg2png = require('svg2png'), fs = require('fs'), path = require('path'); const inDir='./mapillary_sprite_source/package_signs'; const outDir='./pngs'; fs.mkdirSync(outDir,{recursive:true}); fs.readdirSync(inDir).forEach(f=>{ if(f.endsWith('.svg')){ const svg = fs.readFileSync(path.join(inDir,f)); svg2png(svg).then(buf=>fs.writeFileSync(path.join(outDir,f.replace('.svg','.png')),buf)); }});"
```
This creates PNG equivalents of all traffic sign SVGs inside ./pngs.

### Generate sprite.png + sprite.json

Now combine all PNGs into a single sprite sheet and generate the layout mapping.
```
node -e "const Spritesmith=require('spritesmith'),glob=require('glob'),fs=require('fs'); const files=glob.sync('./pngs/*.png'); Spritesmith.run({src:files},function(err,result){ if(err)throw err; fs.writeFileSync('./package_signs.png',result.image); const mapping={}; for(const name in result.coordinates){ mapping[pathBasename(name,'.png')]={ x: result.coordinates[name].x, y: result.coordinates[name].y, width: result.coordinates[name].width, height: result.coordinates[name].height, pixelRatio:1 }; } fs.writeFileSync('./package_signs.json',JSON.stringify(mapping,null,2)); }); function pathBasename(p,suffix){ return p.split(/[\\/]/).pop().replace(suffix,''); }"
```

### This produces the following output files:
```
./package_signs.png
./package_signs.json
```

## Output Description / File	Description
package_signs.png	/ Sprite sheet containing all traffic sign PNGs
package_signs.json / JSON metadata with coordinates and dimensions for each sign

## Example Usage

You can use the generated package_signs.png and package_signs.json in web maps or Esri Experience Builder widgets to render Mapillary traffic signs efficiently.

## License

Traffic sign sources and sprites are based on open data from [Mapillary.com](https://www.mapillary.com).
