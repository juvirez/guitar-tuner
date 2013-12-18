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

app.mic = {
	bufferSize: 16384,
	sampleRate: 44100,
	coef: 44100 / 16384,
	fft: null,

	startAudition: function(callback) {
		navigator.getMedia({audio: true}, function(stream) {
			var that = app.mic;
			that.fft = new FFT(that.bufferSize, that.sampleRate);
			var audioContext = new AudioContext();
			var audioSource = audioContext.createMediaStreamSource(stream);
			var tuner = audioContext.createJavaScriptNode(that.bufferSize, 1, 1);
			tuner.onaudioprocess = that.audioProcess;
			audioSource.connect(tuner);
			tuner.connect(audioContext.destination);
		}, function(error) {
			alert("getMedia Error: ", error);
		});
	},

	audioProcess: function(e) {
		var that = app.mic;
		that.fft.forward(e.inputBuffer.getChannelData(0));
		var freqs = that.fft.spectrum;
		var maxI = 0, maxVal = -100;
		for (var i = 0; i < freqs.length; i++) {
			if (maxVal < freqs[i]) {
				maxVal = freqs[i];
				maxI = i;
			}
		}
		console.log(maxI * that.coef, maxVal);
	}
};


$(function() {
	app.mic.startAudition();
});