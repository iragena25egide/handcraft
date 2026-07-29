import sys
from PIL import Image

def process_logo(input_path, output_mark, output_favicon):
    img = Image.open(input_path).convert("RGBA")
    width, height = img.size
    
    # We assume the map is in the upper 70% and the text is in the lower 30%.
    # Let's crop out the bottom 35% just to be safe.
    map_box = (0, 0, width, int(height * 0.70))
    map_img = img.crop(map_box)
    
    # Get bounding box of non-transparent pixels in the cropped image
    bbox = map_img.getbbox()
    if bbox:
        map_img = map_img.crop(bbox)
        
    # Save the pure icon mark
    map_img.save(output_mark, "PNG")
    
    # Create favicon (square, resized)
    # Make it square by pasting into center
    max_dim = max(map_img.size)
    square_img = Image.new("RGBA", (max_dim, max_dim), (255, 255, 255, 0))
    offset = ((max_dim - map_img.size[0]) // 2, (max_dim - map_img.size[1]) // 2)
    square_img.paste(map_img, offset)
    
    favicon = square_img.resize((32, 32), Image.Resampling.LANCZOS)
    favicon.save(output_favicon, format="ICO")

if __name__ == "__main__":
    process_logo(sys.argv[1], sys.argv[2], sys.argv[3])
