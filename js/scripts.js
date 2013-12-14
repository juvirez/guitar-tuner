$(function() {
    var app = app || {};

    app.getAngleForCent = function(cent) {
        return cent + 90;
    }

    app.Arrow = {
        id: '#arrow',

        setCent: function(cent) {
            var angle = app.getAngleForCent(cent);
            $(this.id).css('-webkit-transform', 'rotate(' + angle + 'deg)');
        }
    }

    app.ScaleZeroMark = {
        id: '#zero',

        isPositive: function(cent)
        {
            if (cent >= -5 && cent <= 5) {
                return true;
            }

            return false;
        },

        setCent: function(cent) {
            if (this.isPositive(cent)) {
                $(this.id).addClass('active');
            } else {
                $(this.id).removeClass('active');
            }
        }
    }

    var i = -50;
    var to = 'right';
    setInterval(function() {
        if (to == 'right') {
            i++;
        } else if (to == 'left') {
            i--;
        }
        if (i < -50) {
            to = 'right';
        }
        if (i > 50) {
            to = 'left';
        }
        app.Arrow.setCent(i);
        app.ScaleZeroMark.setCent(i);
    }, 50);
});