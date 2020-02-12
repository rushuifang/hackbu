const video = document.querySelector('#videoElement')
const question1 = document.querySelector('#questionnaire_1')

Promise.all([
  faceapi.nets.tinyFaceDetector.loadFromUri("/static/face/models"),
  faceapi.nets.faceLandmark68Net.loadFromUri("/static/face/models"),
  faceapi.nets.faceRecognitionNet.loadFromUri("/static/face/models"),
  faceapi.nets.faceExpressionNet.loadFromUri("/static/face/models")
]).then(()=>{ 
   console.log("Loading is done!")
})

function startVideo() {
    if (navigator.mediaDevices.getUserMedia) {
      navigator.mediaDevices.getUserMedia({ video: true })
        .then(function (stream) {
          video.srcObject = stream;
        })
        .catch(function (err0r) {
          console.log("Something went wrong!");
        });
    }
  }

function stopVideo() {
    var stream = video.srcObject;
    var tracks = stream.getTracks();
   
    for (var i = 0; i < tracks.length; i++) {
      var track = tracks[i];
      track.stop();
    }
    video.srcObject = null;
}

document.addEventListener('DOMContentLoaded', function () {
    var checkbox = document.querySelector('input[type="checkbox"]');

    if(checkbox){
      checkbox.addEventListener('change', function () {
        if (checkbox.checked) {
          startVideo();
          console.log('Checked');
        } else {
          stopVideo();
          console.log('Not checked');
          window.location.reload;
          window.location.href = "http://127.0.0.1:8000/face/maps";
        }
      })
    }
  })

if(video){
  video.addEventListener('play', () => {
    
    // Creating a canvas element from a video element
    const canvas = faceapi.createCanvasFromMedia(video);
    document.getElementById("container").appendChild(canvas);
    // Preparing display on canvas
    const displaySize = { width: video.width, height: video.height };
    faceapi.matchDimensions(canvas, displaySize);
    const minProbability = 0.05;
    setInterval(async () => {
        // Detecting faces
        const detections = await faceapi.detectAllFaces(video, new faceapi.TinyFaceDetectorOptions()).withFaceLandmarks().withFaceExpressions();
        
        // Resize the detected boxes in case your displayed image has a different size than the original
        const resizedDetections = faceapi.resizeResults(detections, displaySize);
        
        // Clear the canvas
        canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height);

        // Get the dominant emotion on clicking questionnaire button
        if (detections[0]) {
          info = detections[0].expressions;
        } else {
          info = {"Try it again":1}
        }
       question1.onclick = function () {
          localStorage.setItem('q1', Object.keys(info).reduce(function(a, b){ return info[a] > info[b] ? a : b }))
        }
        // suggest_maps.onclick = function(){}
        // Display detection results
        faceapi.draw.drawDetections(canvas, resizedDetections);
        faceapi.draw.drawFaceLandmarks(canvas, resizedDetections);
        faceapi.draw.drawFaceExpressions(canvas, resizedDetections, minProbability);
    }, 100)
  })
}


