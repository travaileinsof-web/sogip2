import base64
import os
from PIL import Image

def png_to_svg(png_path, svg_path):
    with open(png_path, 'rb') as f:
        img_data = f.read()
    b64_data = base64.b64encode(img_data).decode('utf-8')
    
    img = Image.open(png_path)
    width, height = img.size
    
    svg_content = f"""<svg xmlns="http://www.w3.org/2000/svg" width="{width}" height="{height}" viewBox="0 0 {width} {height}">
    <image href="data:image/png;base64,{b64_data}" width="{width}" height="{height}" />
</svg>"""
    
    with open(svg_path, 'w') as f:
        f.write(svg_content)
        
logos_dir = r'C:\Users\GBESSI\Desktop\SOGIP GROUP\sogip-frontend\public\images\logos'
png_to_svg(os.path.join(logos_dir, 'sogip_group_transparent.png'), os.path.join(logos_dir, 'sogip_group.svg'))
png_to_svg(os.path.join(logos_dir, 'sogip_btp_transparent.png'), os.path.join(logos_dir, 'sogip_btp.svg'))
png_to_svg(os.path.join(logos_dir, 'soleil_guinee_transparent.png'), os.path.join(logos_dir, 'soleil_guinee.svg'))
png_to_svg(os.path.join(logos_dir, 'cef_conseil_transparent.png'), os.path.join(logos_dir, 'cef_conseil.svg'))
print('SVG created successfully')
