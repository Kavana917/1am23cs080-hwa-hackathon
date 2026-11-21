"""Build optimized web assets for the RIME storefront.

- Copies the supplied concept renders into /assets as WebP.
- Removes the small watermark in the bottom-right corner of the renders by
  patching it with nearby background.
- Produces the transparent hero render, favicon and social preview image.
"""

from pathlib import Path

from PIL import Image, ImageDraw, ImageFilter, ImageFont

ROOT = Path(__file__).resolve().parent.parent
SRC = ROOT / "product_images"
OUT = ROOT / "assets"
OUT.mkdir(exist_ok=True)


def patch_watermark(im: Image.Image) -> Image.Image:
    """Cover the small sparkle in the bottom-right corner with nearby pixels."""
    w, h = im.size
    x0, y0, x1, y1 = w - 230, h - 230, w - 30, h - 30
    pad = 26
    patch = im.crop((x0 - 220, y0 - pad, x1 - 220, y1 + pad))
    patch = patch.filter(ImageFilter.GaussianBlur(1.2))
    mask = Image.new("L", (patch.width, patch.height), 0)
    d = ImageDraw.Draw(mask)
    d.rounded_rectangle(
        (pad, pad, patch.width - pad, patch.height - pad), radius=34, fill=255
    )
    mask = mask.filter(ImageFilter.GaussianBlur(12))
    im.paste(patch, (x0, y0 - pad), mask)
    return im


def render(name: str, out_name: str, max_w: int = 1800, quality: int = 84,
           watermark: bool = True) -> None:
    im = Image.open(SRC / name).convert("RGBA")
    if watermark:
        im = patch_watermark(im)
    if im.width > max_w:
        ratio = max_w / im.width
        im = im.resize((max_w, round(im.height * ratio)), Image.LANCZOS)
    if out_name.endswith(".webp"):
        im.save(OUT / out_name, "WEBP", quality=quality, method=6)
    else:
        im.save(OUT / out_name)
    print(f"{out_name:28s} {im.width}x{im.height}")


RENDERS = {
    "dissection.png": ("anatomy.webp", 1800, 86),
    "cross_shot.png": ("cutaway.webp", 1800, 86),
    "sleeve1.png": ("sleeve-frost.webp", 1200, 88),
    "sleeve2.jpg": ("sleeve-load.webp", 1000, 86),
    "sleeve3.jpg": ("sleeve-treats.webp", 1000, 86),
    "sleevepeanutrotation.png": ("sleeve-spin.webp", 1600, 84),
    "sleeveon.png": ("sleeve-on.webp", 1600, 84),
    "freezingrod.png": ("freeze-rod.webp", 1600, 84),
    "rod.png": ("chill-rod.webp", 1400, 86),
    "rodon.png": ("rod-on.webp", 1400, 84),
    "waterbase.png": ("fill-base.webp", 1600, 84),
    "topcap-on.png": ("travel-cap.webp", 1600, 84),
    "doglicking.png": ("dog-licking.webp", 1800, 86),
    "dog_licking.png": ("dog-licking-alt.webp", 1800, 86),
    "Gemini_Generated_Image_li78odli78odli78.png": ("dog-close.webp", 1800, 86),
    "productwithbg.png": ("product-studio.webp", 1800, 86),
}

for src, (dst, width, quality) in RENDERS.items():
    render(src, dst, width, quality)

# Transparent hero render (already has an alpha channel).
render("product.png", "rime-hero.webp", 700, 90, watermark=False)

# Ice cube cut-out.
render("ice_cube.png", "ice-cube.webp", 900, 88, watermark=False)

# Favicon: hexagon with a chill rod and a droplet.
fav = """<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
<rect width="64" height="64" rx="14" fill="#08181C"/>
<path d="M32 7 52.8 19v26L32 57 11.2 45V19Z" fill="none" stroke="#9FE6F2" stroke-width="2.4"/>
<rect x="29.4" y="18" width="5.2" height="24" rx="2.6" fill="#E8F8FB"/>
<path d="M32 46c3.6 4 5.4 6.2 5.4 8.4a5.4 5.4 0 0 1-10.8 0C26.6 52.2 28.4 50 32 46Z" fill="#5FD3E8"/>
</svg>"""
(OUT / "favicon.svg").write_text(fav, encoding="utf-8")


def font(path: str, size: int) -> ImageFont.FreeTypeFont:
    try:
        return ImageFont.truetype(path, size)
    except OSError:
        return ImageFont.load_default()


# Social preview (1200 x 630).
W, H = 1200, 630
og = Image.new("RGB", (W, H), "#08181C")
px = og.load()
for y in range(H):
    for x in range(0, W, 4):
        t = (x / W) * 0.6 + (y / H) * 0.4
        c = (
            round(8 + 10 * t),
            round(24 + 20 * t),
            round(28 + 24 * t),
        )
        for dx in range(4):
            if x + dx < W:
                px[x + dx, y] = c

glow = Image.new("RGBA", (W, H), (0, 0, 0, 0))
gd = ImageDraw.Draw(glow)
for r in range(430, 0, -10):
    alpha = round(38 * (1 - r / 430) ** 2)
    gd.ellipse((820 - r, 315 - r, 820 + r, 315 + r), fill=(130, 220, 236, alpha))
glow = glow.filter(ImageFilter.GaussianBlur(30))
og = Image.alpha_composite(og.convert("RGBA"), glow)

product = Image.open(OUT / "rime-hero.webp").convert("RGBA")
ph = 520
product = product.resize((round(product.width * ph / product.height), ph), Image.LANCZOS)
og.alpha_composite(product, (905 - product.width // 2, 58))

d = ImageDraw.Draw(og)
d.text((72, 66), "R I M E", font=font("C:/Windows/Fonts/segoeuib.ttf", 26), fill="#9FE6F2")
d.text((72, 138), "Hydration in", font=font("C:/Windows/Fonts/georgiai.ttf", 76), fill="#F2F8F8")
d.text((72, 222), "its prime.", font=font("C:/Windows/Fonts/georgiai.ttf", 76), fill="#F2F8F8")
d.line((72, 340, 560, 340), fill=(140, 200, 210, 90), width=1)
d.text(
    (72, 366),
    "A frozen lick & hydration column that keeps your dog",
    font=font("C:/Windows/Fonts/segoeui.ttf", 25),
    fill="#B9CBCE",
)
d.text(
    (72, 400),
    "calmly busy for a 3\u20134 hour session.",
    font=font("C:/Windows/Fonts/segoeui.ttf", 25),
    fill="#B9CBCE",
)
d.text(
    (72, 500),
    "Standard \u20b93,999  \u00b7  XL \u20b94,999  \u00b7  Ships in 1\u20132 days",
    font=font("C:/Windows/Fonts/segoeui.ttf", 22),
    fill="#7FB9C6",
)
og.convert("RGB").save(OUT / "og-image.jpg", quality=88, optimize=True)
print("og-image.jpg               1200x630")
print("favicon.svg")
