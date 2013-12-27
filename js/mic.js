var app = app || {};

navigator.getMedia = (
	navigator.getUserMedia ||
    navigator.webkitGetUserMedia ||
    navigator.mozGetUserMedia ||
    navigator.msGetUserMedia);

if (navigator.getMedia === undefined) {
	location.href = "browser_not_support.html";
}

window.AudioContext = window.AudioContext || window.webkitAudioContext;

(function() {
	function Mic() {
		var audioContext = new AudioContext(),
			audioSource = null,

			bufferSize = 32768,
			coef = audioContext.sampleRate / bufferSize,
			bufferSizeScriptProcessor = bufferSize / 2,

			fft = new FFT(bufferSize, audioContext.sampleRate),
			buffer = new Float32Array(bufferSize),

			mute = true,
			callback = function(hz) {
				console.log(hz);
			};

		audioContext.createScriptProcessor = (
			audioContext.createJavaScriptNode ||
			audioContext.createScriptProcessor);

		function audioProcess(e) {
			var data = e.inputBuffer.getChannelData(0);
			for (var i = 0; i < bufferSizeScriptProcessor; i++) {
				buffer[i] = buffer[i + bufferSizeScriptProcessor];
				buffer[i + bufferSizeScriptProcessor] = data[i];
			}
			fft.forward(buffer);
			var spectrum = fft.spectrum,
				maxI = spectrum.length - 1,
				maxVal = spectrum[maxI];
			for (var i = maxI; i >= 0; i--) {
				if (maxVal < spectrum[i]) {
					maxVal = spectrum[i];
					maxI = i;
				}
			}
			callback(maxI * coef);
		}

		this.startAudition = function(_callback) {
			if (_callback !== undefined) {
				callback = _callback;
			}
			navigator.getMedia({audio: true}, function(stream) {
				audioSource = audioContext.createMediaStreamSource(stream);
				var frequencyDetector = audioContext.createScriptProcessor(bufferSizeScriptProcessor, 1, 1);
				frequencyDetector.onaudioprocess = audioProcess;
				audioSource.connect(frequencyDetector);
				frequencyDetector.connect(audioContext.destination);
			}, function(error) {
				alert("getMedia error: ", error);
			});
		};
		this.muteToggle = function() {
			mute = !mute;
			if (mute) {
				audioSource.disconnect(audioContext.destination);
			} else {
				audioSource.connect(audioContext.destination);
			}
			return mute;
		};
	}
	app.mic = new Mic();
})();