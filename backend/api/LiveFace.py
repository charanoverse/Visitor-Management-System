import cv2
import base64
from flask import Flask, jsonify, request
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

face_cascade = cv2.CascadeClassifier(cv2.data.haarcascades + 'haarcascade_frontalface_default.xml')

@app.route('/api/face-recognition', methods=['POST'])
def face_recognition():
    video_capture = cv2.VideoCapture(0)
    face_detected = False
    frame_base64 = None

    while True:
        ret, frame = video_capture.read()
        gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
        faces = face_cascade.detectMultiScale(
            gray,
            scaleFactor=1.1,
            minNeighbors=5,
            minSize=(30, 30),
            flags=cv2.CASCADE_SCALE_IMAGE
        )
        for (x, y, w, h) in faces:
            cv2.rectangle(frame, (x, y), (x+w, y+h), (0, 255, 0), 2)
            face_detected = True

        # Convert the frame to base64
        _, buffer = cv2.imencode('.jpg', frame)
        frame_base64 = base64.b64encode(buffer).decode('utf-8')

        # Display the frame with detected faces
        cv2.imshow('Video', frame)

        # Check for the 'a' key press to exit the loop
        if face_detected or cv2.waitKey(1) & 0xFF == ord('a'):
            break

    # Release the video capture object
    video_capture.release()
    cv2.destroyAllWindows()

    if face_detected:
        return jsonify({'success': True, 'image': frame_base64})
    else:
        return jsonify({'success': False, 'message': 'No face detected'})

if __name__ == '__main__':
    app.run(port=5001, debug=True)
