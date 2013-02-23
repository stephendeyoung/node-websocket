
(function() {

    'use strict';

    var createSocket = function() {
        var ws = new WebSocket("ws://localhost:8081");

        ws.onmessage = displayData.bind(null, ws);
    };

    var displayData = function(ws, e) {
        var data = JSON.parse(e.data);
        var model = getModel(data.id);
        var value = parseFloat(data.level);

        if (!model) {
            new ClubView(data);
        } else {
            model.club
                .calculateChange(value)
                .checkRange(value)
                .calculateConnChange(value)
                .calculateTimeChange(value);
        }
    };

    var getModel = function(id) {
        var x = 0;
        var ln = models.length;
        for (; x < ln; x += 1) {
            if (models[x].id === id) {
                return models[x];
            }
        }
    };


    if (window.WebSocket) {
        document.addEventListener('DOMContentLoaded', createSocket);
    } else {
        console.log('your browser does not support web sockets');
    }


})();

(function() {

    'use strict';

    var source = document.querySelector('#club-template').innerHTML;
    var template = Handlebars.compile(source);

    var models = [];

    var modifyField = function(el, val) {
        var currentText = el.removeChild(el.firstChild);

        el.appendChild(document.createTextNode(val));
    };

    var ClubView = function(data) {
        this.id = data.id;
        this.club = new Club(data, this);
        this.createRow();
        models.push(this);
    };

    ClubView.prototype.createRow = function() {
        var table = document.querySelector('#stocks').querySelector('tbody');
        var wrapper = document.createElement('table');

        wrapper.innerHTML = template(this.club);
        var el = table.appendChild(wrapper.querySelector('tr'));

        this.el = el;
    };

    ClubView.prototype.showChange = function(change) {
        var value;

        if (change === undefined) {
            this.el.querySelector('.change').classList.remove('up down');
        } else if (change === true) {
            this.el.querySelector('.change').classList.remove('down')
            this.el.querySelector('.change').classList.add('up');
        } else {
            this.el.querySelector('.change').classList.remove('up')
            this.el.querySelector('.change').classList.add('down');
        }

        return this;
    };

    ClubView.prototype.updatePrice = function(newLevel) {
        modifyField(this.el.querySelector('.level').querySelector('.price'), newLevel);
        return this;
    };

    ClubView.prototype.updateRange = function(newRange, isHighest) {
        var el = this.el.querySelector('.range');

        if (isHighest) {
            modifyField(el.querySelector('.highest'), newRange);
        } else {
            modifyField(el.querySelector('.lowest'), newRange);
        }
    };

    ClubView.prototype.updateChange = function(el, change, percChange) {

        modifyField(el.querySelector('.change-num'), change);
        modifyField(el.querySelector('.change-perc'), percChange);
    };

    if (typeof window.ClubView === 'undefined') {
        window.ClubView = ClubView;
    } else {
        console.log('"ClubView" namespace has already been defined');
    }

    if (typeof window.models === 'undefined') {
        window.models = models;
    } else {
        console.log('"models" namespace has already been defined');
    }

})();

(function() {

    'use strict';

    var Club = function(data, view) {
        var value = parseFloat(data.level);

        this.name = data.name;
        this.originalLevel = value;
        this.level = value;
        this.currency = data.currency;
        this.highest = value;
        this.lowest = value;
        this.newTime = new Date().getTime();
        this.count = 0;
        this.totalLevel = 0;
        this.view = view;
    };

    Club.prototype.calculateChange = function(newLevel) {
        var change;

        if (newLevel > this.level) {
            change = true;
        } else if (newLevel < this.level) {
            change = false;
        } else {
            change = undefined;
        }

        this.level = newLevel;

        this.view
            .showChange(change)
            .updatePrice(newLevel);

        return this;
    };

    Club.prototype.checkRange = function(newLevel) {

        if (newLevel > this.highest) {
            this.highest = newLevel;
            this.view.updateRange(newLevel, true);
        } else if (newLevel < this.lowest) {
            this.lowest = newLevel;
            this.view.updateRange(newLevel, false);
        }

        return this;
    };

    Club.prototype.calculateConnChange = function(newLevel) {
        this.calculateVariance(newLevel, this.originalLevel, this.view.el.querySelector('.conn-change'));

        return this;
    };

    Club.prototype.calculateTimeChange = function(newLevel) {
        var time = new Date().getTime();

        this.count += 1;
        this.totalLevel += newLevel;
        if (time >= this.newTime + 60000) {
            var average = this.totalLevel / this.count;

            this.newTime = time;
            this.count = 0;
            this.totalLevel = 0;

            this.calculateVariance(average, this.originalLevel, this.view.el.querySelector('.minute-change'));

        }

        return this;
    };

    Club.prototype.calculateVariance = function(newLevel, oldLevel, el) {
        var change = newLevel - oldLevel;
        var formatChange = change.toFixed(2);
        var percChange = (change / oldLevel) * 100;
        var formatPercChange = percChange.toFixed(2) + '%';

        this.view.updateChange(el, formatChange, formatPercChange);
    };

    if (typeof window.Club === 'undefined') {
        window.Club = Club;
    } else {
        console.log('"Club" namespace already taken');
    }

})();

