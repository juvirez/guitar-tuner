var app = app || {};

(function() {
	seminotes = [
		[73.91, 'D'],	[77.78, 'D#'],	[82.41, 'E'],	[87.31, 'F'],
		[92.50, 'F#'],	[98.00, 'G'],	[103.80, 'G#'],	[110.00, 'A'],
		[116.54, 'A#'],	[123.48, 'B'],	[130.82, 'c'],	[138.59, 'c#'],
		[147.83, 'd'],	[155.56, 'd#'],	[164.81, 'e'],	[174.62, 'f'],
		[185.00, 'f#'],	[196.00, 'g'],	[207.00, 'g#'],	[220.00, 'a'],
		[233.08, 'a#'],	[246.96, 'b'],	[261.63, 'c1'],	[277.18, 'c1#'],
		[293.66, 'd1'],	[311.13, 'd1#'],[329.63, 'e1'],	[349.23, 'f1'],
		[369.99, 'f1#'],[392.00, 'g1'],	[415.30, 'g1#'],[440.00, 'a1']
	];

	var Tuner = Backbone.Model.extend({
		defaults: {
			frequency: 0,
			note: '',
			cents: 0
		},
		initialize: function() {
			var that = this;
			app.mic.startAudition(function() {
				that.frequencyProcess.apply(that, arguments);
			});
		},
		frequencyProcess: function(frequency) {
			//console.log(frequency);
			this.set('frequency', frequency);
			var minDiffI = 0,
				minDiff = Math.abs(frequency - seminotes[0][0]);
			for (var i = 1; i < seminotes.length; i++) {
				var diff = Math.abs(frequency - seminotes[i][0]);
				if (minDiff > diff) {
					minDiffI = i;
					minDiff = diff;
				} else {
					break;
				}
			}
			var note = seminotes[minDiffI][1];
			this.set('note', note);

			var cents = Math.round(1200 * Math.log(frequency / seminotes[minDiffI][0]));
			this.set('cents', cents);

			if (Math.abs(cents) > 50) {
				//TODO: smth
				return;
			}
			this.trigger('tick', frequency, note, cents);
		}
	});

	app.tuner = new Tuner();

})();