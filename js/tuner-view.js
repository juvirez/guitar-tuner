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
			var rotateTemplate = _.template($('#rotate-template').html());
			var degree = -120;
			for (var i = -50; i <= 50; i += 2) {
				var styleClass;
				if (i % 10) {
					styleClass = 'mark';
				} else {
					styleClass = 'ten-mark';
					var markNumber = rotateTemplate({
						'styleClass': 'mark-number',
						'degree': degree,
						value: i});
					this.$el.prepend(markNumber);
				}
				var mark = rotateTemplate({
					'styleClass': styleClass,
					'degree': degree,
					value: ''});
				this.$el.prepend(mark);
				degree = parseFloat((degree + 4.8).toFixed(1));
			}
			return this;
		},
		tick: function(frequency, note, cents) {
			this.$note.html(this.noteFormat(note));
			this.$frequency.html(frequency);
		},
		noteFormat: function(note) {
			var res = /^[a-g](\d)/.exec(note);
			if (res) {
				return note[0] + '<sup>' + res[0] + '</sup>' + (note[2] || '');
			}
			res = /^[A-G](\d)/.exec(note);
			if (res) {
				return note[0] + '<sub>' + res[0] + '</sub>' + (note[2] || '');
			}
			return note;
		}
	});
	app.tunerView = new tuner();
});