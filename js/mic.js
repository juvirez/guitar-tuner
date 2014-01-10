var app = app || {};

navigator.getMedia = (
	navigator.getUserMedia ||
	navigator.webkitGetUserMedia ||
	navigator.mozGetUserMedia ||
	navigator.msGetUserMedia);

window.AudioContext = window.AudioContext || window.webkitAudioContext;

if (navigator.getMedia === undefined || window.AudioContext === undefined) {
	location.href = "browser_not_support.html";
}

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
			callbacks = [];

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
			_.each(callbacks, function(callback) { callback(maxI * coef); });
		}

		this.startAudition = function(callback) {
			if (!_.isFunction(callback)) {
				return false;
			}
			callbacks.push(callback);
			if (audioSource) {
				return true;
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
			return true;
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

		var tickPeriod = (bufferSizeScriptProcessor / audioContext.sampleRate) * 1000;
		this.getTickPeriod = function() {
			return tickPeriod;
		};
	}
	app.mic = new Mic();
})();