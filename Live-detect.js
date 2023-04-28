// declare variable
let video = null;
let detector = null;
let detections = [];
let videoVisibility = true;
let detecting = false;

// HTML element
const videoElements = document.getElementById('videoElements');
const detectElements = document.getElementById('detectElements');

// configure the cursor to wait until the video element loads
document.body.style.cursor = 'wait';

// If it exists, the preload() method is called before the setup() function.
function preload() {
    // make a detector object from the "coco-ssd" model
    detector = ml5.objectDetector('cocossd');
    console.log('detector object is loaded');
}

// When the program starts, the setup() function is called.
function setup() {
    // construct a canvas element in pixels with 640 width and 480 height
    createCanvas(640, 480);
    // Creates a new HTML5 video> element that holds a webcam video feed.
    video = createCapture(VIDEO);
    video.size(640, 480);
    console.log('video element is created');
    video.elt.addEventListener('loadeddata', function() {
        // set cursor back to its default
        if (video.elt.readyState >= 2) {
            document.body.style.cursor = 'default';
            console.log('video element is ready! Click "Start Detecting!');
        }
    });
}

// the draw() function continuously executes
function draw() {
    if (!video || !detecting) return;
    // Draw a video frame on the canvas and place it in the upper left corner.
    image(video, 0, 0);
    // All detected objects should be drawn to the canvas.
    for (let i = 0; i < detections.length; i++) {
        detectionOutput(detections[i]);
    }
}

function detectionOutput(object) {
    createBoundary(object);
    objectMarker(object);
}

// Create box around the detected object
function createBoundary(object) {
    // Sets the color used to draw box to green.
    stroke('green');
    // width of the box perimeter is 4px.
    strokeWeight(4);
    // Disables filling geometry
    noFill();
    // draw an rectangle
    // x and y are the coordinates of upper-left corner, followed by width and height
    rect(object.x, object.y, object.width, object.height);
}

// mark the object detected.
function objectMarker(object) {
    // Disables drawing the stroke
    noStroke();
    // sets the color used to fill shapes
    fill('yellow');
    // set font size
    textSize(24);
    // draw string to canvas
    text(object.label, object.x + 10, object.y + 24);
}

// This function. it is called when object is detected
function onDetected(error, results) {
    if (error) {
        console.error(error);
    }
    detections = results;
    // keep detecting object
    if (detecting) {
        detect();
    }
}

function detect() {
    //"onDetected" function is called when object is detected
    detector.detect(video, onDetected);
}

function dialVideo() {
    if (!video) return;
    if (videoVisibility) {
        video.hide();
        videoElements.innerText = 'Show Video';
    } else {
        video.show();
        videoElements.innerText = 'Hide Video';
    }
    videoVisibility = !videoVisibility;
}

function dialDetection() {
    if (!video || !detector) return;
    if (!detecting) {
        detect();
        detectElements.innerText = 'Stop Detecting';
    } else {
        detectElements.innerText = 'Start Detecting';
    }
    detecting = !detecting;
}