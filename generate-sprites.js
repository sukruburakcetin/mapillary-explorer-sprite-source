const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const inDir = './mapillary_sprite_source/package_objects';
const outDirs = ['./pngs', './pngs@2x'];

// Ensure output directories exist
for (const outDir of outDirs) {
  fs.mkdirSync(outDir, { recursive: true });
}

// Read SVG files
const files = fs.readdirSync(inDir).filter(f => f.endsWith('.svg'));
if (!files.length) throw new Error('No SVG files found in input folder!');

const SPRITE_MAX_WIDTH = 1024; // max width of sprite sheet
const ICON_SIZE = 32;           // all icons are 32x32

async function generateSprite(scale) {
  const cols = Math.floor(SPRITE_MAX_WIDTH / ICON_SIZE);
  const rows = Math.ceil(files.length / cols);
  const spriteWidth = cols * ICON_SIZE;
  const spriteHeight = rows * ICON_SIZE;

  const metadata = {};
  const buffers = [];

  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    const name = path.basename(file, '.svg');
    const svgPath = path.join(inDir, file);
    const outDir = scale === 1 ? outDirs[0] : outDirs[1];
    const outFile = path.join(outDir, `${name}${scale === 2 ? '@2x' : ''}.png`);

    // Convert SVG to PNG (always 32x32)
    const buffer = await sharp(svgPath)
      .resize(ICON_SIZE, ICON_SIZE)
      .png()
      .toBuffer();

    fs.writeFileSync(outFile, buffer); // optional: save individual PNG
    buffers.push({ buffer, name });

    const col = i % cols;
    const row = Math.floor(i / cols);
    metadata[name] = {
      x: col * ICON_SIZE,
      y: row * ICON_SIZE,
      width: ICON_SIZE,
      height: ICON_SIZE
    };
  }

  // Create blank sprite image
  const spriteBuffer = await sharp({
    create: {
      width: spriteWidth,
      height: spriteHeight,
      channels: 4,
      background: { r: 0, g: 0, b: 0, alpha: 0 }
    }
  })
    .composite(buffers.map(b => ({
      input: b.buffer,
      left: metadata[b.name].x,
      top: metadata[b.name].y
    })))
    .png()
    .toBuffer();

  const outDir = scale === 1 ? outDirs[0] : outDirs[1];
  const spriteName = `sprite${scale === 2 ? '@2x' : ''}.png`;
  const jsonName = `sprite${scale === 2 ? '@2x' : ''}.json`;

  fs.writeFileSync(path.join(outDir, spriteName), spriteBuffer);
  fs.writeFileSync(path.join(outDir, jsonName), JSON.stringify(metadata, null, 2));

  console.log(`Generated ${spriteName} and ${jsonName} (${spriteWidth}×${spriteHeight}px)`);
}

// Run generation for 1x and @2x
(async () => {
  try {
    await generateSprite(1); // normal
    await generateSprite(2); // @2x (still 32x32 icons)
    console.log('All sprites generated successfully!');
  } catch (err) {
    console.error(err);
  }
})();
