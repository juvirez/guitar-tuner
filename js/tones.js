app = app || {Models: {}, Collections: {}};

(function() {
	var SemiTone = Backbone.Model.extend({
		defaults: {
			freq: 0,
			note: '#',
			octave: 0
		},
		diffFreq: function(curFreq) {
			return (this.get('freq') - curFreq);
		},
		constructor: function(params) {
			Backbone.Model.apply(this, {
				'freq': params[0],
				'note': params[1],
				'octave': params[2]});
			return this;
		}
	});

	var SemiTones = Backbone.Collection.extend({
		model: SemiTone,
		getCurSemiTone: function(curFreq) {
			var arr = _.reduce(this, function(mem, cur) {
				var absDiff = Math.abs(cur.diffFreq(curFreq));
				if (absDiff < mem[1]) {
					return [cur, absDiff];
				}
			}, [null, 22000]);
			return arr[0];
		}
	});

	app.SemiTones = new SemiTones();
	app.SemiTones.reset([
		[77.78, 'D#'],	[155.56, 'D#'],	[311.13, 'D#'],
		[82.41, 'E'],	[164.81, 'E'],	[329.63, 'E'],
		[87.31, 'F'],	[174.62, 'F'],	[349.23, 'F'],
		[92.50, 'F#'],	[185.00, 'F#'],	[369.99, 'F#'],
		[98.00, 'G'],	[196.00, 'G'],	[392.00, 'G'],
		[103.80, 'G#'],	[207.00, 'G#'],	[415.30, 'G#'],
		[110.00, 'A'],	[220.00, 'A'],	[440.00, 'A'],
		[116.54, 'A#'],	[233.08, 'A#'],
		[123.48, 'H'],	[246.96, 'H'],
		[130.82, 'C'],	[261.63, 'C'],
		[138.59, 'C#'],	[277.18, 'C#'],
		[147.83, 'D'],	[293.66, 'D']
	]);
})();