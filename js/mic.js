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
	audioContext: null,
	analyser: null,
	buf: null,
	coef: 44000 / 2048,

	startAudition: function() {
		navigator.getMedia({audio: true}, function(stream) {
			app.mic.audioContext = new AudioContext();
			var mediaStreamSource = app.mic.audioContext.createMediaStreamSource(stream);

			app.mic.analyser = app.mic.audioContext.createAnalyser();
			app.mic.analyser.fftSize = 2048;
			mediaStreamSource.connect(app.mic.analyser);

			app.mic.buf = new Uint8Array(app.mic.analyser.frequencyBinCount);

		}, function(error) {
			alert("getMedia Error: ", error);
		});
	},
	
	getFrequency: function() {
		this.analyser.getByteFrequencyData(this.buf);
		var maxI = this.buf[0];
		var bufLen = this.buf.length;
		for(var i = 1; i < bufLen; i++) {
			if (this.buf[maxI] < this.buf[i]) {
				maxI = i;
			}
		}
		return maxI * this.coef;
	}
};


$(function() {
	
});