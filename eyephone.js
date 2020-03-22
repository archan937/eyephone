var

// *
// * eyephone.js
// * Use your phone as a full screen camera input device for your computer (e.g. using OBS)
// *
// * Paul Engel
// * eyephone.js is licensed under MIT license
// *

EyePhone = (function() {
  'use strict';

  var
    facingModes = [
      'environment',
      'user'
    ],
    index = 0,
    video,
    stream,

  init = function() {
    addStyle();
    addVideo();
    captureVideo();
  },

  addStyle = function() {
    var
      style = document.createElement('style'),
      css = `
        html, body {
          margin: 0;
          padding: 0;
        }

        video {
          top: 0;
          left: 0;
          bottom: 0;
          right: 0;
          min-width: 100%;
          max-height: 100%;
          position: fixed;
          object-fit: cover;
        }`;

    style.innerHTML = css;
    document.head.appendChild(style);
  },

  addVideo = function() {
    video = document.createElement('video');
    video.autoplay = true;
    video.playsInline = true;
    document.body.appendChild(video);

    if (facingModes.length > 1) {
      document.addEventListener('dblclick', captureVideo);
    }
  },

  captureVideo = function() {
    var mode = facingModes[index];

    if (stream) {
      stream.getTracks().forEach(function(track) {
        track.stop();
      });
      console.log('Stopping ' + stream);
      stream = null;
      video.srcObject = null;
    }

    navigator.mediaDevices.getUserMedia({
      video: {
        facingMode: {
          exact: mode
        }
      }
    }).then(function(deviceStream) {
      stream = deviceStream;
      video.srcObject = stream;
      video.play();
      console.log('Streaming ' + stream);
    }).catch(window.alert);

    index++;

    if (index == facingModes.length) {
      index = 0;
    }
  },

  ready = function(fn) {
    if ((document.readyState == 'interactive') || (document.readyState == 'complete')) {
      fn();
    } else {
      document.addEventListener('DOMContentLoaded', fn);
    }
  };

  ready(init);

}());
