import subprocess, sys, os
try:
    from PIL import Image, ImageDraw
except ImportError:
    subprocess.check_call([sys.executable, "-m", "pip", "install", "Pillow"])
    from PIL import Image, ImageDraw

os.makedirs("assets", exist_ok=True)
img = Image.new("RGB", (800, 400), color="white")
d = ImageDraw.Draw(img)
d.rectangle([50,50,300,150], fill="#e0e0e0", outline="#333", width=3)
d.text((70,90), "Agent", fill="black")
d.rectangle([400,50,700,150], fill="#e0e0e0", outline="#333", width=3)
d.text((420,90), "Terminal", fill="black")
d.line((300,100,400,100), fill="#333", width=4)
d.polygon([(400,100),(380,85),(380,115)], fill="#333")
img.save("assets/agent_flow.png")
print("saved assets/agent_flow.png")
