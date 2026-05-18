# 📁 Assets Folder — Drop Your Files Here

This is where all your villa images, logo and icons go.
No database needed — Next.js serves everything in `/public` automatically.

---

## How to Add Your Photos

### Hero image (main background)
Drop your best villa exterior photo here:
```
/public/assets/images/hero.jpg
```

### Gallery images (9 photos)
Name them exactly:
```
/public/assets/images/gallery-1.jpg   ← Villa exterior (featured, larger)
/public/assets/images/gallery-2.jpg   ← Jacuzzi
/public/assets/images/gallery-3.jpg   ← Garden
/public/assets/images/gallery-4.jpg   ← Living room
/public/assets/images/gallery-5.jpg   ← Master bedroom
/public/assets/images/gallery-6.jpg   ← Kitchen
/public/assets/images/gallery-7.jpg   ← Second bedroom
/public/assets/images/gallery-8.jpg   ← Outdoor/terrace
/public/assets/images/gallery-9.jpg   ← View / neighborhood
```

### CTA section background (optional)
```
/public/assets/images/cta-bg.jpg     ← A nice atmospheric shot
```

### Logo (your Rashi6 logo)
```
/public/assets/logo/logo.svg   ← SVG preferred
/public/assets/logo/logo.png   ← PNG fallback
```

---

## Tips
- **Format**: JPG or WebP recommended for photos
- **Size**: Aim for 1920×1080px for hero, 1200×800px for gallery
- **Quality**: 80–85% JPEG quality is ideal (good quality, small file)
- You can add more gallery images by editing `src/components/Gallery.tsx` and expanding the `GALLERY_IMAGES` array

---

## Folder Structure
```
public/
  assets/
    images/
      hero.jpg
      gallery-1.jpg ... gallery-9.jpg
      cta-bg.jpg
    logo/
      logo.svg
      logo.png
```
