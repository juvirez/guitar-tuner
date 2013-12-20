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
	var sampleRate = 44100,
		bufferSize = 32768,
		coef = sampleRate / bufferSize,
		bufferSizeScriptProcessor = bufferSize / 2,

		fft = new FFT(bufferSize, sampleRate),
		buffer = new Float32Array(bufferSize),
		audioContext = new AudioContext(),
		audioSource = null;

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
			maxI = 0,
			maxVal = spectrum[maxI];
		for (var i = 1; i < spectrum.length; i++) {
			if (maxVal < spectrum[i]) {
				maxVal = spectrum[i];
				maxI = i;
			}
		}
		console.log(maxI * coef);
	}

	function Mic() {
		var mute = true;

		this.startAudition = function() {
			navigator.getMedia({audio: true}, function(stream) {
				audioSource = audioContext.createMediaStreamSource(stream);
				var tuner = audioContext.createScriptProcessor(bufferSizeScriptProcessor, 1, 1);
				tuner.onaudioprocess = audioProcess;
				audioSource.connect(tuner);
				tuner.connect(audioContext.destination);
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

$(function() {
	app.mic.startAudition();
});
