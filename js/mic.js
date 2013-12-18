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
	coef: 44100 / (16384*2),
	fft: null,
	callback: null,
	lastBuf: null,

	startAudition: function(callback) {
		var that = app.mic;
		that.lastBuff = new Float32Array(that.bufferSize);
		that.callback = callback;
		navigator.getMedia({audio: true}, function(stream) {
			that.fft = new FFT(2 * that.bufferSize, that.sampleRate);
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
		var data = e.inputBuffer.getChannelData(0);
		that.fft.forward(Float32Concat(that.lastBuff, data));
		var freqs = that.fft.spectrum;
		var maxI = 0, maxVal = freqs[maxI];
		for (var i = 1; i < freqs.length; i++) {
			if (maxVal < freqs[i]) {
				maxVal = freqs[i];
				maxI = i;
			}
		}
		that.lastBuff = data;
		console.log(maxI * that.coef, maxVal);
	}
};

function Float32Concat(first, second) {
    var firstLength = first.length;
    var result = new Float32Array(firstLength + second.length);
    result.set(first);
    result.set(second, firstLength);
    return result;
}

$(function() {
	app.mic.startAudition();
});