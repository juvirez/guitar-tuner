$(function() {
	var Tuner = Backbone.View.extend({
		el: '#tuner',
		initialize: function() {
			this.$note = $('#note');
			this.$frequency = $('#frequency');
			this.$arrow = $('#arrow');
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
			this.$frequency.html(Math.round(frequency));

			var degree = cents * 2.4,
				arrow = this.$arrow,
				circle = $('#circle');
			this.$arrow.stop(true, true);
			this.$arrow.animate({
					'text-ident': degree
				}, {
					step: function(now) {
						(Math.abs(now / 2.4) <= 5) ? circle.addClass('green') : circle.removeClass('green');
						var rotateDegree = 'rotate(' + now + 'deg)';
						arrow.css({
							'-webkit-transform': rotateDegree,
							'-moz-transform': rotateDegree,
							'-o-transform': rotateDegree,
							'-ms-transform': rotateDegree,
							'transform': rotateDegree
						});
					},
					duration: app.mic.getTickPeriod()
				});
		},
		noteFormat: function(note) {
			var res = /^[a-g](\d)/.exec(note);
			if (res) {
				return note[0] + '<sup>' + res[1] + '</sup>' + (note[2] || '');
			}
			res = /^[A-G](\d)/.exec(note);
			if (res) {
				return note[0] + '<sub>' + res[1] + '</sub>' + (note[2] || '');
			}
			return note;
		}
	});
	app.tunerView = new Tuner();
});