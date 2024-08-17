document.addEventListener('DOMContentLoaded', function() {
    const speeds = [0.25, 0.5, 0.75, 1.5, 2, 3, 4, 5, 6];
    const slider = document.getElementById('speedSlider');
    const speedValue = document.getElementById('speedValue');
    
    // Get current video speed and update UI
    getCurrentSpeed();
  
    speeds.forEach(speed => {
      const button = document.getElementById(`speed${speed}x`);
      if (button) {
        button.addEventListener('click', function() {
          setSpeedAndUpdateUI(speed);
        });
      }
    });
  
    document.getElementById('normalSpeed').addEventListener('click', function() {
      setSpeedAndUpdateUI(1);
    });
  
    slider.addEventListener('input', function() {
      const speed = parseFloat(this.value);
      setSpeedAndUpdateUI(speed);
    });
  
    function getCurrentSpeed() {
      chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        chrome.scripting.executeScript({
          target: {tabId: tabs[0].id},
          function: getVideoSpeed,
        }, (results) => {
          if (results && results[0] && typeof results[0].result === 'number') {
            updateSpeedUI(results[0].result);
          }
        });
      });
    }
  
    function updateSpeedUI(speed) {
      slider.value = speed;
      speedValue.textContent = speed.toFixed(2) + 'x';
    }
  
    function setSpeedAndUpdateUI(speed) {
      updateSpeedUI(speed);
      chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        chrome.scripting.executeScript({
          target: {tabId: tabs[0].id},
          function: setVideoSpeed,
          args: [speed]
        }, () => {
          // Get the actual speed after setting and update UI again
          chrome.scripting.executeScript({
            target: {tabId: tabs[0].id},
            function: getVideoSpeed,
          }, (results) => {
            if (results && results[0] && typeof results[0].result === 'number') {
              updateSpeedUI(results[0].result);
            }
          });
        });
      });
    }
  });
  
  function getVideoSpeed() {
    const video = document.querySelector('video');
    return video ? video.playbackRate : 1;
  }
  
  function setVideoSpeed(speed) {
    const video = document.querySelector('video');
    if (video) {
      video.playbackRate = speed;
      return video.playbackRate; // Return the actual set speed
    } else {
      console.log('No video element found');
      return 1;
    }
  }
  