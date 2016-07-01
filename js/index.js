/**
 * Created by Johan on 2016-06-29.
 */


document.addEventListener('DOMContentLoaded', function() {

    /*
    * RangeSlider
    * */

    function _rangeSlider(element, handler) {
        this.element = element;
        this.handler = handler;
        this.value = null;
    }
    _rangeSlider.prototype.run = function() {
        var self = this;

        // Track mousemovement and call this.handler() if value changes
        self.element.addEventListener('mousedown', onMouseDown);
        function onMouseDown() {
            self.element.addEventListener('mousemove', onMouseMove);
            self.element.addEventListener('mouseup', onMouseUp);
        }
        function onMouseMove() {
            if(self.value !== self.element.value) {
                self.handler();
                self.value = self.element.value;
            }
        }
        function onMouseUp() {
            self.element.removeEventListener('mousemove', onMouseMove);
            self.element.removeEventListener('mouseup', onMouseUp);
        }
    };

    /*
    * Calculation
    * */

    // Controls
    var amountSlider = document.getElementById('amountSlider'),
        periodSlider = document.getElementById('periodSlider'),

    // Progress
        amountProgress = document.getElementById('amountProgress'),
        periodProgress = document.getElementById('periodProgress'),

    // resentation of data
        amountPres = document.getElementById('amountPres'),
        periodPres = document.getElementById('periodPres'),
        costPres = document.getElementById('costPres'),
        redirect = document.getElementById('redirect');

    function presentResult() {
        var loanAmount = amountSlider.value,
            period = periodSlider.value,
            periodInMonths = period * 12,
            rate = 9.9,
            cost = calcMonthlyFee(rate, periodInMonths, loanAmount);

        // Set progressbar
        amountProgress.value = loanAmount - 20000;
        periodProgress.value = period - 2;

        // Present data
        amountPres.innerHTML = loanAmount;
        periodPres.innerHTML = period;
        costPres.innerHTML = cost;

        redirect.href = 'https://www.collector.se/privat/lana-pengar/ansok/?amount='+loanAmount+'&months='+periodInMonths;
    }
    function calcMonthlyFee(rate, nrOfPayments, loanAmount) {
        // Get percentage of loan to pay each month
        var interest  = rate / 1200,
            percentageRate = ((1 - Math.pow((1 + interest),(0 - nrOfPayments))) / interest);
        // Return monthly fee for loan
        return Math.round(loanAmount / percentageRate);
    }

    // Start listening to events on rangeSliders
    new _rangeSlider(amountSlider, presentResult).run();
    new _rangeSlider(periodSlider, presentResult).run();
    // Present an example loan initially
    presentResult();
});