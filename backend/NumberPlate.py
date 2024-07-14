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
    exit()

# Convert the image to grayscale
gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)

# Apply some preprocessing techniques
gray = cv2.bilateralFilter(gray, 11, 17, 17)  # Noise reduction
edged = cv2.Canny(gray, 30, 200)  # Edge detection

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
    exit()

# Create a mask for the number plate area
mask = np.zeros(gray.shape, dtype=np.uint8)
cv2.fillPoly(mask, [number_plate_contour], 255)
masked_image = cv2.bitwise_and(gray, gray, mask=mask)

# Crop the number plate area
x, y, w, h = cv2.boundingRect(number_plate_contour)
number_plate = gray[y:y+h, x:x+w]

# Apply some more preprocessing if needed
number_plate = cv2.threshold(number_plate, 0, 255, cv2.THRESH_BINARY + cv2.THRESH_OTSU)[1]

# Configure Tesseract to use the English language
custom_config = r'--oem 3 --psm 6'
text = pytesseract.image_to_string(number_plate, config=custom_config)

# Save the output text to a file
with open('output.txt', 'w') as f:
    f.write(text)

print("Number Plate Text:", text)