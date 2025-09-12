#!/usr/bin/env python3

import sys
import json
import os
from PIL import Image, ImageDraw, ImageFont

def load_font(font_name, size, fallback_size=None):
    """Load font with multiple fallbacks"""
    font_paths = [
        f"/usr/share/fonts/truetype/dejavu/{font_name}",
        f"/usr/share/fonts/TTF/{font_name}",
        f"/usr/share/fonts/{font_name}",
        f"/System/Library/Fonts/{font_name}",
        f"C:\\Windows\\Fonts\\{font_name}",
        font_name  # Direct path or system font name
    ]
    
    for font_path in font_paths:
        try:
            return ImageFont.truetype(font_path, size)
        except (OSError, IOError):
            continue
    
    # Try system default fonts
    try:
        # Try common Linux system fonts
        return ImageFont.truetype("/usr/share/fonts/truetype/noto/NotoSans-Regular.ttf", size)
    except (OSError, IOError):
        try:
            return ImageFont.truetype("/usr/share/fonts/truetype/noto/NotoSans-Bold.ttf", size)
        except (OSError, IOError):
            # Final fallback to default font
            return ImageFont.load_default()

def generate_aadhaar_card(data, output_path):
    """Generate Aadhaar card image with provided data"""
    try:
        # Create a blank white image
        width, height = 600, 350
        image = Image.new('RGB', (width, height), 'white')
        draw = ImageDraw.Draw(image)

        # Load fonts with fallbacks
        font_bold = load_font("DejaVuSans-Bold.ttf", 24)
        font_regular = load_font("DejaVuSans.ttf", 18)
        font_small = load_font("DejaVuSans.ttf", 14)

        # Draw header with government styling
        draw.text((20, 20), "Unique Identification Authority of India", fill='#0066CC', font=font_bold)
        draw.text((20, 50), "Government of India", fill='#0066CC', font=font_regular)

        # Draw separator line
        draw.line((20, 80, width - 20, 80), fill='#0066CC', width=2)

        # Extract data from JSON
        name = data.get('name', 'N/A')
        aadhaar_no = data.get('aadhaar_no', 'N/A')
        dob = data.get('dob', 'N/A')
        gender = data.get('gender', 'N/A')
        address = data.get('address', 'N/A')

        # Draw details with proper spacing
        y_start = 100
        line_height = 25

        # Name
        draw.text((20, y_start), "Name:", fill='#333333', font=font_regular)
        draw.text((150, y_start), name, fill='black', font=font_regular)

        # Aadhaar Number
        draw.text((20, y_start + line_height), "Aadhaar No:", fill='#333333', font=font_regular)
        draw.text((150, y_start + line_height), aadhaar_no, fill='black', font=font_regular)

        # Date of Birth
        draw.text((20, y_start + line_height * 2), "DOB:", fill='#333333', font=font_regular)
        draw.text((150, y_start + line_height * 2), dob, fill='black', font=font_regular)

        # Gender
        draw.text((20, y_start + line_height * 3), "Gender:", fill='#333333', font=font_regular)
        draw.text((150, y_start + line_height * 3), gender, fill='black', font=font_regular)

        # Address (with text wrapping for long addresses)
        draw.text((20, y_start + line_height * 4), "Address:", fill='#333333', font=font_regular)
        
        # Simple text wrapping for address
        max_width = 400
        words = address.split(' ')
        lines = []
        current_line = []
        
        for word in words:
            test_line = ' '.join(current_line + [word])
            bbox = draw.textbbox((0, 0), test_line, font=font_regular)
            if bbox[2] <= max_width:
                current_line.append(word)
            else:
                if current_line:
                    lines.append(' '.join(current_line))
                    current_line = [word]
                else:
                    lines.append(word)
        
        if current_line:
            lines.append(' '.join(current_line))
        
        # Draw address lines
        for i, line in enumerate(lines[:3]):  # Limit to 3 lines
            draw.text((150, y_start + line_height * 4 + i * 18), line, fill='black', font=font_small)

        # Draw border
        draw.rectangle([(10, 10), (width - 10, height - 10)], outline='#0066CC', width=2)

        # Footer note
        draw.text((20, height - 40), "This is a sample Aadhaar card for educational purposes only.", 
                 fill='#666666', font=font_small)
        
        # Add sample watermark
        draw.text((width - 120, height - 25), "SAMPLE", fill='#CCCCCC', font=font_regular)

        # Save the image
        image.save(output_path, 'PNG', quality=95)
        return True

    except Exception as e:
        print(f"Error generating Aadhaar card: {str(e)}", file=sys.stderr)
        return False

def main():
    if len(sys.argv) != 3:
        print("Usage: python3 generate_aadhaar.py <json_data> <output_path>", file=sys.stderr)
        sys.exit(1)

    try:
        # Parse JSON data from command line argument
        json_data = sys.argv[1]
        output_path = sys.argv[2]
        
        # Parse the JSON data
        data = json.loads(json_data)
        
        # Create output directory if it doesn't exist
        os.makedirs(os.path.dirname(output_path), exist_ok=True)
        
        # Generate the Aadhaar card
        success = generate_aadhaar_card(data, output_path)
        
        if success:
            print(f"Aadhaar card generated successfully: {output_path}")
            sys.exit(0)
        else:
            print("Failed to generate Aadhaar card", file=sys.stderr)
            sys.exit(1)
            
    except json.JSONDecodeError as e:
        print(f"Invalid JSON data: {str(e)}", file=sys.stderr)
        sys.exit(1)
    except Exception as e:
        print(f"Error: {str(e)}", file=sys.stderr)
        sys.exit(1)

if __name__ == "__main__":
    main()