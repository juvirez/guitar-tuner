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
	bufferSize: 16384 * 2,
	sampleRate: 44100,
	coef: 44100 / (16384*2),
	fft: null,
	callback: null,
	buffer: null,

	startAudition: function(callback) {
		var that = app.mic;
		that.buffer = new Float32Array(that.bufferSize);
		that.callback = callback;
		navigator.getMedia({audio: true}, function(stream) {
			that.fft = new FFT(that.bufferSize, that.sampleRate);
			var audioContext = new AudioContext();
			var audioSource = audioContext.createMediaStreamSource(stream);

			audioContext.createScriptProcessor = (
				audioContext.createJavaScriptNode ||
				audioContext.createScriptProcessor);
			var tuner = audioContext.createScriptProcessor(that.bufferSize / 2, 1, 1);

			tuner.onaudioprocess = that.audioProcess;
			audioSource.connect(tuner);
			tuner.connect(audioContext.destination);
			//audioSource.connect(audioContext.destination);
		}, function(error) {
			alert("getMedia Error: ", error);
		});
	},

	audioProcess: function(e) {
		var that = app.mic;
		var data = e.inputBuffer.getChannelData(0);
		var halfBufSize = that.bufferSize / 2;
		for (var i = 0; i < halfBufSize; i++) {
			that.buffer[i] = that.buffer[i + halfBufSize];
			that.buffer[i + halfBufSize] = data[i];
		}
		that.fft.forward(that.buffer);
		var freqs = that.fft.spectrum;
		var maxI = 0, maxVal = freqs[maxI];
		for (var i = 1; i < freqs.length; i++) {
			if (maxVal < freqs[i]) {
				maxVal = freqs[i];
				maxI = i;
			}
		}
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