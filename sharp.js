const fs = require('fs');
const path = require('path');
const sharp = require('sharp');
const { optimize } = require('svgo');

const inputDir = path.join(__dirname, 'public');
const rasterExts = ['.jpg', '.jpeg', '.png'];
const svgExt = '.svg';
const webpQuality = 75;

const walkDir = (dir, callback) => {
  fs.readdirSync(dir).forEach(file => {
    const fullPath = path.join(dir, file);
    if (fs.lstatSync(fullPath).isDirectory()) {
      walkDir(fullPath, callback);
    } else {
      callback(fullPath);
    }
  });
};

walkDir(inputDir, (filePath) => {
  const ext = path.extname(filePath).toLowerCase();

  // ✅ Raster image → Convert to WebP
  if (rasterExts.includes(ext)) {
    const outputPath = filePath.replace(ext, '.webp');
    sharp(filePath)
      .toFormat('webp', { quality: webpQuality })
      .toFile(outputPath)
      .then(() => {
        console.log(`✅ Compressed (WebP): ${filePath} → ${outputPath}`);
      })
      .catch(err => {
        console.error(`❌ Error compressing ${filePath}:`, err);
      });
  }

  // ✅ SVG → Optimize in-place
  if (ext === svgExt) {
    const svgData = fs.readFileSync(filePath, 'utf8');
    const result = optimize(svgData, {
      path: filePath,
      multipass: true
    });

    fs.writeFileSync(filePath, result.data);
    console.log(`✅ Optimized SVG: ${filePath}`);
  }
});
