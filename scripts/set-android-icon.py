from pathlib import Path
import base64
from PIL import Image

root = Path("android/app/src/main/res")
source = Path("assets/loreverse-app-icon.jpg.base64")
tmp = Path("/tmp/loreverse-icon.jpg")
tmp.write_bytes(base64.b64decode(source.read_text().strip()))
image = Image.open(tmp).convert("RGBA")
sizes = {"mipmap-mdpi":48,"mipmap-hdpi":72,"mipmap-xhdpi":96,"mipmap-xxhdpi":144,"mipmap-xxxhdpi":192}
for folder, size in sizes.items():
    target = root / folder
    target.mkdir(parents=True, exist_ok=True)
    icon = image.resize((size,size), Image.Resampling.LANCZOS)
    icon.save(target / "ic_launcher.png", optimize=True)
    icon.save(target / "ic_launcher_round.png", optimize=True)
    # Adaptive foreground is inset to keep the full artwork inside launcher masks.
    fg_canvas = Image.new("RGBA", (432,432), (0,0,0,0))
    fg = image.resize((360,360), Image.Resampling.LANCZOS)
    fg_canvas.alpha_composite(fg, (36,36))
    fg_canvas.resize((size,size), Image.Resampling.LANCZOS).save(target / "ic_launcher_foreground.png", optimize=True)
adaptive = root / "mipmap-anydpi-v26"
adaptive.mkdir(parents=True, exist_ok=True)
xml = '<adaptive-icon xmlns:android="http://schemas.android.com/apk/res/android"><background android:drawable="@color/ic_launcher_background"/><foreground android:drawable="@mipmap/ic_launcher_foreground"/></adaptive-icon>'
(adaptive / "ic_launcher.xml").write_text(xml)
(adaptive / "ic_launcher_round.xml").write_text(xml)
colors = root / "values"
colors.mkdir(parents=True, exist_ok=True)
(colors / "ic_launcher_background.xml").write_text('<resources><color name="ic_launcher_background">#050b18</color></resources>')
print("Applied the uploaded LOREVERSE artwork to legacy and adaptive launcher icons.")
