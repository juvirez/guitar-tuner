$(function() {
	var Neck = Backbone.View.extend({
		el: '#tablature',
		initialize: function() {
			this.$pointer = this.$('#pointer');
			this.$more = this.$('#freq-more');
			this.$less = this.$('#freq-less');
			this.listenTo(app.tuner, 'change:note', this.tick);
		},
		tick: function(model, note) {
			var td = this.$('#' + note.replace('#', 's'));
			if (td.length) {
				td.append(this.$pointer);
				return;
			}
			var freq = app.tuner.get('frequency');
			if (freq > 415) {
				this.$more.append(this.$pointer);
			} else {
				this.$less.append(this.$pointer);
			}
		}
	});
	app.neckView = new Neck();
});