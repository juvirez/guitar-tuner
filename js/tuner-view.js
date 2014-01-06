$(function() {
	var tuner = Backbone.View.extend({
		initialize: function() {
			this.$note = $('#note');
			this.$cents = $('#cents');
			this.listenTo(app.tuner, 'tick', this.tick);
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