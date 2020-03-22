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
    deviceIds = [],
    index = 0,
    video,
    stream,

  init = function() {
    collectDeviceIds(function() {
      addStyle();
      addVideo();
      captureVideo();
    });
  },

  collectDeviceIds = function(fn) {
    if (navigator.mediaDevices && navigator.mediaDevices.enumerateDevices) {
      navigator.mediaDevices.enumerateDevices()
        .then(function(devices) {
          devices.forEach(function(device) {
            if (device.kind == 'videoinput') {
              console.log('Found video device ' + device.deviceId);
              deviceIds.push(device.deviceId);
            }
          });
        })
        .then(fn);
    }
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

    if (deviceIds.length > 1) {
      video.addEventListener('dblclick', captureVideo);
    }
  },

  captureVideo = function() {
    if (stream) {
      stream.getTracks().forEach(function(track) {
        track.stop();
      });
      console.log('Stopping ' + stream);
      stream = null;
      video.srcObject = null;
    }

    navigator.mediaDevices.getUserMedia({
      audio: true,
      video: {
        deviceId: {
          exact: deviceIds[index]
        }
      }
    }).then(function(deviceStream) {
      stream = deviceStream;
      video.srcObject = stream;
      video.play();
      console.log('Streaming ' + stream);
    }).catch(window.alert);

    index++;

    if (index == deviceIds.length) {
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
