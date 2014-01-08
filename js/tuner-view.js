$(function() {
	var tuner = Backbone.View.extend({
		el: '#tuner',
		initialize: function() {
			this.$note = $('#note');
			this.$frequency = $('#frequency');
			this.listenTo(app.tuner, 'tick', this.tick);
			this.render();
		},
		render: function() {
			var rotate = function(degree) {
				return ['transform: rotate(' + degree + 'deg);',
					'-webkit-transform: rotate(' + degree + 'deg);',
					'-moz-transform: rotate(' + degree + 'deg);',
					'-o-transform: rotate(' + degree + 'deg);',
					'-ms-transform: rotate(' + degree + 'deg);'].join('');
			};
			var degree = -120;
			for (var i = -50; i <= 50; i += 2) {
				var el;
				if (i % 10) {
					el = '<div class="mark" style="' + rotate(degree) + '"></div>';
				} else {
					el = '<div class="ten-mark" style="' + rotate(degree) + '"></div>';
				}
				this.$el.prepend(el);
				degree = parseFloat((degree + 4.8).toFixed(1));
			}
			return this;
		},
		tick: function(frequency, note, cents) {
			this.$note.html(this.noteFormat(note));
			this.$cents.html(cents);
		},
		noteFormat: function(note) {
			if (/^[a-g]{1}1/.test(note)) {
				return note[0] + "<sup>1</sup>" + (note[2] || "");
			}
			return note;
		}
	});
	app.tunerView = new tuner();
});