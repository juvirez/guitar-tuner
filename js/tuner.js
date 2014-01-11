var app = app || {};

(function() {
	seminotes = [
		[20.61, 'E2'],	[21.82, 'F2'],
		[23.12, 'F2#'],	[24.50, 'G2'],	[25.95, 'G2#'],	[27.50, 'A2'],	[29.13, 'A2#'],	[30.87, 'B2'],
		[32.70, 'C1'],	[34.65, 'C1#'],	[36.95, 'D1'],	[38.88, 'D1#'],	[41.21, 'E1'],	[43.65, 'F1'],
		[46.25, 'F1#'],	[49.00, 'G1'],	[51.90, 'G1#'],	[55.00, 'A1'],	[58.26, 'A1#'],	[61.74, 'B1'],
		[65.41, 'C'],	[69.30, 'C#'],	[73.91, 'D'],	[77.78, 'D#'],	[82.41, 'E'],	[87.31, 'F'],
		[92.50, 'F#'],	[98.00, 'G'],	[103.80, 'G#'],	[110.00, 'A'],	[116.54, 'A#'],	[123.48, 'B'],
		[130.82, 'c'],	[138.59, 'c#'],	[147.83, 'd'],	[155.56, 'd#'],	[164.81, 'e'],	[174.62, 'f'],
		[185.00, 'f#'],	[196.00, 'g'],	[207.00, 'g#'],	[220.00, 'a'],	[233.08, 'a#'],	[246.96, 'b'],
		[261.63, 'c1'],	[277.18, 'c1#'],[293.66, 'd1'],	[311.13, 'd1#'],[329.63, 'e1'],	[349.23, 'f1'],
		[369.99, 'f1#'],[392.00, 'g1'],	[415.30, 'g1#'],[440.00, 'a1'],	[466.16, 'a1#'],[493.88, 'b1'],
		[523.25, 'c2'],	[554.36, 'c2#'],[587.32, 'd2'], [622.26, 'd2#'],[659.26, 'e2'], [698.46, 'f2'],
		[739.98, 'f2#'],[784.00, 'g2'], [830.60, 'g2#'],[880.00, 'a2'], [932.32, 'a2#'],[987.75, 'b2'],
		[1046.50, 'c3'],[1108.70,'c3#'],[1174.60, 'd3'],[1244.50,'d3#'],[1318.50, 'e3'],[1396.90, 'f3'],
		[1480.00,'f3#'],[1568.00, 'g3'],[1661.20,'g3#'],[1720.00, 'a3'],[1864.60,'a3#'],[1975.50, 'b3'],
		[2093.00, 'c4'],[2217.40,'c4#'],[2349.20, 'd4'],[2489.00,'d4#'],[2637.00, 'e4'],[2793.80, 'f4'],
		[2960.00,'f4#'],[3136.00, 'g4'],[3332.40,'g4#'],[3440.00, 'a4'],[3729.20,'a4#'],[3951.00, 'b4'],
		[4186.00, 'c5'],[4434.80,'c5#'],[4698.40, 'd5'],[4978.00,'d5#'],[5274.00, 'e5']
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