const https = require('https');
const fs = require('fs');
const path = require('path');

const TARGET_DIR = path.resolve(__dirname, '../public/images');

const PHOTOS = [
  {
    key: 'hero-landscape',
    filename: 'hero-landscape.jpg',
    title: 'File:Mountain sunrise (Unsplash).jpg',
    url: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/8/85/Mountain_sunrise_%28Unsplash%29.jpg/1920px-Mountain_sunrise_%28Unsplash%29.jpg',
    desc: 'Home hero: breathtaking natural landscape with mountains, forest, warm sunrise light',
    license: 'CC0 1.0 (Public Domain Dedication)',
    creator: 'Alice Donovan Rouse (Unsplash / Wikimedia Commons)',
    sourceUrl: 'https://commons.wikimedia.org/wiki/File:Mountain_sunrise_(Unsplash).jpg',
  },
  {
    key: 'moss-on-stone',
    filename: 'moss-on-stone.jpg',
    title: 'File:Tortula muralis Lincolnshire 2024 01.jpg',
    url: 'https://upload.wikimedia.org/wikipedia/commons/1/1a/Tortula_muralis_Lincolnshire_2024_01.jpg',
    desc: 'Moss on Stone: detailed macro photograph of green moss growing on rough stone',
    license: 'CC BY 4.0',
    creator: 'Dr. Johnathan Ward (Wikimedia Commons)',
    sourceUrl: 'https://commons.wikimedia.org/wiki/File:Tortula_muralis_Lincolnshire_2024_01.jpg',
  },
  {
    key: 'weathering-shale',
    filename: 'weathering-shale.jpg',
    title: 'File:Chattanooga Shale (Upper Devonian; Burkesville West Rt. 90 roadcut, Kentucky, USA) 25 (40541681100).jpg',
    url: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/0/04/Chattanooga_Shale_%28Upper_Devonian%3B_Burkesville_West_Rt._90_roadcut%2C_Kentucky%2C_USA%29_25_%2840541681100%29.jpg/1920px-Chattanooga_Shale_%28Upper_Devonian%3B_Burkesville_West_Rt._90_roadcut%2C_Kentucky%2C_USA%29_25_%2840541681100%29.jpg',
    desc: 'Weathering: natural geological outcrop of dark weathered, flaking shale rock layers and sediment',
    license: 'CC BY 2.0',
    creator: 'James St. John (Geologist, Wikimedia Commons)',
    sourceUrl: 'https://commons.wikimedia.org/wiki/File:Chattanooga_Shale_(Upper_Devonian;_Burkesville_West_Rt._90_roadcut,_Kentucky,_USA)_25_(40541681100).jpg',
  },
  {
    key: 'lichen-crusts',
    filename: 'lichen-crusts.jpg',
    title: 'File:Xanthoria parietina 02.JPG',
    url: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/d/d6/Xanthoria_parietina_02.JPG/1920px-Xanthoria_parietina_02.JPG',
    desc: 'Lichen Crusts: real grey-green and muted orange lichen growing on bark or rock',
    license: 'CC BY-SA 4.0',
    creator: 'Norbert Nagel (Wikimedia Commons)',
    sourceUrl: 'https://commons.wikimedia.org/wiki/File:Xanthoria_parietina_02.JPG',
  },
  {
    key: 'leaf-veins',
    filename: 'leaf-veins.jpg',
    title: 'File:Taro leaf underside, backlit by sun - edit.jpg',
    url: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/c/c7/Taro_leaf_underside%2C_backlit_by_sun_-_edit.jpg/1920px-Taro_leaf_underside%2C_backlit_by_sun_-_edit.jpg',
    desc: 'Leaf Vein Patterns: macro photograph of a real green leaf with detailed veins and natural backlighting',
    license: 'CC BY-SA 3.0 / GNU FDL',
    creator: 'Muhammad Mahdi Karim (Wikimedia Commons)',
    sourceUrl: 'https://commons.wikimedia.org/wiki/File:Taro_leaf_underside,_backlit_by_sun_-_edit.jpg',
  },
  {
    key: 'ant-trails',
    filename: 'ant-trails.jpg',
    title: 'File:Wood Ants (Formica sp.) - Ålesund, Norway 2022-07-01.jpg',
    url: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/5/50/Wood_Ants_%28Formica_sp.%29_-_%C3%85lesund%2C_Norway_2022-07-01.jpg/1920px-Wood_Ants_%28Formica_sp.%29_-_%C3%85lesund%2C_Norway_2022-07-01.jpg',
    desc: 'Ant Trails: real ants moving across natural surface in macro photography',
    license: 'CC BY-SA 4.0',
    creator: 'Ålesund Norway Contributor (Wikimedia Commons)',
    sourceUrl: 'https://commons.wikimedia.org/wiki/File:Wood_Ants_(Formica_sp.)_-_%C3%85lesund,_Norway_2022-07-01.jpg',
  },
  {
    key: 'rainwater-flow',
    filename: 'rainwater-flow.jpg',
    title: 'File:A gently flowing stream.jpg',
    url: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/3/36/A_gently_flowing_stream.jpg/1920px-A_gently_flowing_stream.jpg',
    desc: 'Rainwater Flow Patterns: real water flowing over stones or through a rainwater channel',
    license: 'CC BY-SA 4.0',
    creator: 'Wikimedia Commons Contributor',
    sourceUrl: 'https://commons.wikimedia.org/wiki/File:A_gently_flowing_stream.jpg',
  },
  {
    key: 'diurnal-leaves',
    filename: 'diurnal-leaves.jpg',
    title: 'File:(MHNT) Oxalis triangularis - Leaves.jpg',
    url: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/d/d5/%28MHNT%29_Oxalis_triangularis_-_Leaves.jpg/1920px-%28MHNT%29_Oxalis_triangularis_-_Leaves.jpg',
    desc: 'Diurnal Leaf Movements: real plant photograph of Oxalis triangularis leaflets showing diurnal nyctinasty folding',
    license: 'CC BY-SA 4.0',
    creator: 'Didier Descouens (Muséum de Toulouse)',
    sourceUrl: 'https://commons.wikimedia.org/wiki/File:(MHNT)_Oxalis_triangularis_-_Leaves.jpg',
  },
  {
    key: 'community-environment',
    filename: 'community-environment.jpg',
    title: 'File:Cherry trees by the lake, Central Park, NYC.jpg',
    url: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/b/bc/Cherry_trees_by_the_lake%2C_Central_Park%2C_NYC.jpg/1920px-Cherry_trees_by_the_lake%2C_Central_Park%2C_NYC.jpg',
    desc: 'Community & Environment: authentic trees, waterways, soil, or neighborhood nature photography',
    license: 'CC BY-SA 3.0',
    creator: 'Ingfbr (Wikimedia Commons)',
    sourceUrl: 'https://commons.wikimedia.org/wiki/File:Cherry_trees_by_the_lake,_Central_Park,_NYC.jpg',
  },
];

function downloadFile(url, destPath) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(destPath);
    function makeReq(currentUrl) {
      https.get(
        currentUrl,
        {
          headers: {
            'User-Agent': 'FieldnoteNaturalistApp/1.0 (educational nature observation; contact: fieldnote-edu@proton.me)',
          },
        },
        (res) => {
          if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
            return makeReq(res.headers.location);
          }
          if (res.statusCode !== 200) {
            return reject(new Error(`Status ${res.statusCode} for ${currentUrl}`));
          }
          res.pipe(file);
          file.on('finish', () => {
            file.close(() => resolve(destPath));
          });
        }
      ).on('error', (err) => {
        fs.unlink(destPath, () => {});
        reject(err);
      });
    }

    makeReq(url);
  });
}

async function main() {
  console.log(`Downloading photos into: ${TARGET_DIR}`);
  if (!fs.existsSync(TARGET_DIR)) {
    fs.mkdirSync(TARGET_DIR, { recursive: true });
  }

  const manifest = [];

  for (const photo of PHOTOS) {
    const dest = path.join(TARGET_DIR, photo.filename);
    console.log(`\n[${photo.key}] Downloading "${photo.title}"...`);
    try {
      await downloadFile(photo.url, dest);
      const stats = fs.statSync(dest);
      console.log(`✓ Saved ${photo.filename} (${(stats.size / 1024).toFixed(1)} KB)`);
      manifest.push({
        ...photo,
        file: `/images/${photo.filename}`,
        sizeBytes: stats.size,
      });
    } catch (err) {
      console.error(`✗ Failed to download ${photo.filename}:`, err.message);
    }
  }

  const manifestPath = path.join(TARGET_DIR, 'photo-manifest.json');
  fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2), 'utf-8');
  console.log(`\nManifest written to ${manifestPath}`);
}

main().catch(console.error);
