import cv2
import pytesseract
import numpy as np
import sys

if len(sys.argv) != 2:
    print("Usage: python NumberPlate.py <path_to_image>")
    exit(1)

image_path = sys.argv[1]

# Load the image
image = cv2.imread(image_path)
if image is None:
    print("Error: Image not found.")
    exit(1)

# Resize the image to a higher resolution
image = cv2.resize(image, None, fx=2, fy=2, interpolation=cv2.INTER_CUBIC)

# Convert the image to grayscale
gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)

# Apply GaussianBlur to reduce noise and improve contour detection
gray = cv2.GaussianBlur(gray, (5, 5), 0)

# Use Canny edge detection
edged = cv2.Canny(gray, 50, 200)

# Find contours in the edged image
contours, _ = cv2.findContours(edged, cv2.RETR_TREE, cv2.CHAIN_APPROX_SIMPLE)
contours = sorted(contours, key=cv2.contourArea, reverse=True)[:10]

# Loop over the contours to find the number plate
number_plate_contour = None
for contour in contours:
    # Approximate the contour
    peri = cv2.arcLength(contour, True)
    approx = cv2.approxPolyDP(contour, 0.018 * peri, True)

    # If the contour has four vertices, it is likely to be the number plate
    if len(approx) == 4:
        number_plate_contour = approx
        break

if number_plate_contour is None:
    print("Number plate not found")
    exit(1)

# Create a mask for the number plate area
mask = np.zeros(gray.shape, dtype=np.uint8)
cv2.fillPoly(mask, [number_plate_contour], 255)
masked_image = cv2.bitwise_and(gray, gray, mask=mask)

# Crop the number plate area
x, y, w, h = cv2.boundingRect(number_plate_contour)
number_plate = gray[y:y+h, x:x+w]

# Apply more preprocessing to enhance the number plate
number_plate = cv2.bilateralFilter(number_plate, 11, 17, 17)  # Noise reduction
number_plate = cv2.threshold(number_plate, 0, 255, cv2.THRESH_BINARY + cv2.THRESH_OTSU)[1]

# Optionally, you can resize the number plate image to improve OCR accuracy
number_plate = cv2.resize(number_plate, None, fx=2, fy=2, interpolation=cv2.INTER_CUBIC)

# Configure Tesseract to use the English language and specify the OCR Engine Mode (OEM) and Page Segmentation Mode (PSM)
custom_config = r'--oem 3 --psm 6'
text = pytesseract.image_to_string(number_plate, config=custom_config)

# Save the output text to a file
with open('output.txt', 'w') as f:
    f.write(text)

print("Number Plate Text:", text)
