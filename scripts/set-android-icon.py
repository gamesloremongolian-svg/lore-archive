from pathlib import Path
import subprocess
from PIL import Image

root = Path("android/app/src/main/res")
source = Path("assets/loreverse-app-icon.svg")
tmp = Path("/tmp/loreverse-icon.png")
subprocess.run(["rsvg-convert", "-w", "512", "-h", "512", str(source), "-o", str(tmp)], check=True)
image = Image.open(tmp).convert("RGBA")
sizes = {"mipmap-mdpi":48,"mipmap-hdpi":72,"mipmap-xhdpi":96,"mipmap-xxhdpi":144,"mipmap-xxxhdpi":192}
for folder, size in sizes.items():
    target = root / folder
    target.mkdir(parents=True, exist_ok=True)
    icon = image.resize((size,size), Image.Resampling.LANCZOS)
    icon.save(target / "ic_launcher.png", optimize=True)
    icon.save(target / "ic_launcher_round.png", optimize=True)
# Use the same new art on Android 8+ instead of Capacitor's generated placeholder adaptive icon.
adaptive = root / "mipmap-anydpi-v26"
adaptive.mkdir(parents=True, exist_ok=True)
(adaptive / "ic_launcher.xml").write_text('''<adaptive-icon xmlns:android="http://schemas.android.com/apk/res/android"><background android:drawable="@color/ic_launcher_background"/><foreground android:drawable="@mipmap/ic_launcher_foreground"/></adaptive-icon>''')
(adaptive / "ic_launcher_round.xml").write_text('''<adaptive-icon xmlns:android="http://schemas.android.com/apk/res/android"><background android:drawable="@color/ic_launcher_background"/><foreground android:drawable="@mipmap/ic_launcher_foreground"/></adaptive-icon>''')
fg = image.resize((432,432), Image.Resampling.LANCZOS)
for folder in sizes:
    target = root / folder
    fg.save(target / "ic_launcher_foreground.png", optimize=True)
colors = root / "values"
colors.mkdir(parents=True, exist_ok=True)
(colors / "ic_launcher_background.xml").write_text('''<resources><color name="ic_launcher_background">#091426</color></resources>''')
print("Updated legacy and adaptive launcher icons for all Android densities.")
