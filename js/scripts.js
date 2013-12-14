$(function() {
    app = app || {};

    app.getAngleForCent = function(cent) {
        return cent + 90;
    }

    app.isPositiveSignal = function(cent) {
        if (cent >= -5 && cent <= 5) {
            return true;
        }

        return false;
    }

    app.Arrow = {
        id: '#arrow',

        setCent: function(cent) {
            var angle = app.getAngleForCent(cent);
            $(this.id).css('-webkit-transform', 'rotate(' + angle + 'deg)');
            $(this.id).css('-moz-transform', 'rotate(' + angle + 'deg)');
            $(this.id).css('-o-transform', 'rotate(' + angle + 'deg)');
        }
    }

    app.ScaleZeroMark = {
        id: '#zero',   

        setCent: function(cent) {
            if (app.isPositiveSignal(cent)) {
                $(this.id).addClass('active');
            } else {
                $(this.id).removeClass('active');
            }
        }
    }

    app.TabloNote = {
        id: '#note',

        setSignalStatus: function(cent) {
            if (app.isPositiveSignal(cent)) {
                $(this.id).addClass('positive').removeClass('negative');
            } else {
                $(this.id).addClass('negative').removeClass('positive');
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
        app.TabloNote.setSignalStatus(i);
    }, 50);
});