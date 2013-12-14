app = app || {};

app.tones = {

	semitones: [
			[73.91, 'D'],
			[77.78, 'D#'],
			[82.41, 'E'],	
			[87.31, 'F'],	
			[92.50, 'F#'],	
			[98.00, 'G'],	
			[103.80, 'G#'],
			[110.00, 'A'],	
			[116.54, 'A#'],	
			[123.48, 'H'],	
			[130.82, 'C'],	
			[138.59, 'C#'],	
			[147.83, 'D'],
			[155.56, 'D#'],
			[164.81, 'E'],	
			[174.62, 'F'],	
			[185.00, 'F#'],
			[196.00, 'G'],	
			[207.00, 'G#'],
			[220.00, 'A'],	
			[233.08, 'A#'],
			[246.96, 'H'],
			[261.63, 'C'],
			[277.18, 'C#'],
			[293.66, 'D'],
			[311.13, 'D#'],
			[329.63, 'E'],
			[349.23, 'F'],
			[369.99, 'F#'],
			[392.00, 'G'],
			[415.30, 'G#'],
			[440.00, 'A']
		],

	getCurTone: function() {

		var curFreq = app.mic.getFrequency();

		var minDiffI = 0;
		var diff = 22000;
		for (var i = 1; i < this.semitones.length; i++) {
			var curDiff = Math.abs(this.semitones[i][0] - curFreq);
			if (diff > curDiff) {
				minDiffI = i;
				diff = curDiff;
			}
		}

		// calc cents:
		var originalFreq = this.semitones[minDiffI][0];
		var full = 0;
		var path = 0;
		if (curFreq <= originalFreq) {
			full = this.semitones[minDiffI - 1][0] - originalFreq;
			path = originalFreq - curFreq;
		} else {
			full = this.semitones[minDiffI + 1][0] - originalFreq;
			path = curFreq - originalFreq;
		}
		var cents = Math.round(path * 50 / full);

		return [cents, curFreq, this.semitones[minDiffI][0], this.semitones[minDiffI][1]];
	},

	getFretboardTunes: function(startHz) {
		var fletboard = [];
		for (var i = 0; i < this.semitones.length; i++) {
			if (this.semitones[i] >= startHz) {
				fletboard.push(this.semitones[i]);
			}
			if (fletboard.length == 4) {
				break;
			}
		}
		return fletboard;
	}
};