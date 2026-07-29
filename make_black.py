import sys
from PIL import Image

def make_black(input_path, output_path):
    img = Image.open(input_path).convert("RGBA")
    data = img.getdata()
    
    new_data = []
    for item in data:
        # If the pixel is not completely transparent
        if item[3] > 0:
            # make it black but keep original alpha
            new_data.append((15, 23, 42, item[3])) # #0f172a (dark blue/black) to match the brand color
        else:
            new_data.append(item)
            
    img.putdata(new_data)
    img.save(output_path, "PNG")

if __name__ == "__main__":
    make_black(sys.argv[1], sys.argv[2])
