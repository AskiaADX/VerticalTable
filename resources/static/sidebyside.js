(function () {
    var msEdgeMatch = /Edge\/([0-9]+)/i.exec(navigator.userAgent);
    if (msEdgeMatch) document.documentMode = parseInt(msEdgeMatch[1]);
})();
(function () {

    /**
   * Add event listener in DOMElement
   *
   * @param {HTMLElement} obj HTMLElement which should be listen
   * @param {String} type Type of the event to listen
   * @param {Function} fn Callback function
   */
    function addEvent (obj, type, fn) {
        if (typeof obj.addEventListener === 'function') {
            obj.addEventListener(type, fn, true);
        } else if (obj.attachEvent) {
            obj['e' + type + fn] = fn;
            obj[type + fn] = function () {
                obj['e' + type + fn].call(obj, window.event);
            }
            obj.attachEvent('on' + type, obj[type + fn]);
        }
    }

    /**
   * Add class in DOMElement
   *
   * @param {HTMLElement} obj HTMLElement where the class should be added
   * @param {String} clsName Name of the class to add
   */
    function addClass (obj, clsName) {
        if (obj.classList)      {
            obj.classList.add(clsName); 
        }    else            {
            obj.className += ' ' + clsName; 
        }
    }

    /**
   * Remove class in DOMElement
   *
   * @param {HTMLElement} obj HTMLElement where the class should be removed
   * @param {String} clsName Name of the class to remove
   */
    function removeClass (obj, clsName) {
        if (obj.classList)      {
            obj.classList.remove(clsName);
        }    else            {
            obj.className = obj.className.replace(new RegExp('(^|\\b)' + clsName.split(' ').join('|') + '(\\b|$)', 'gi'), ' ');
        }
    }
    
     /**
   * Verify the element has a class in DOMElement
   *
   * @param {HTMLElement} obj HTMLElement where the class should be present
   * @param {String} clsName Name of the class to verify
   */
    function hasClass(obj,className) {
        if (obj.classList)
            return obj.classList.contains(className);
        else
            return new RegExp('(^| )' + className + '( |$)', 'gi').test(obj.className);
    }

    /**
   * Trigger the ajax request for live routings
   *
   * @param {String} shortcut Shortcut of the question
   */
    function triggerRouting(shortcut) {
        if (window.askia 
            && window.arrLiveRoutingShortcut 
            && window.arrLiveRoutingShortcut.length > 0
            && window.arrLiveRoutingShortcut.indexOf(shortcut) >= 0) {
            askia.triggerAnswer();
        }
    }

    /**
   * Manage the exclusive responses or single question
   *
   * @param {HTMLElement} obj HTMLElement (input) changed
   */
    function manageExclusive (obj) {
        var responsesContainer = obj.parentNode.parentNode;
        for (var i = 0; j = responsesContainer.children.length, i < j; i++) {
            if ((responsesContainer.children[i].children[0] !== obj) &&
                (responsesContainer.children[i].className.indexOf('selected') >= 0) &&
                (obj.className.indexOf('askia-exclusive') >= 0 ||
                 obj.type === 'radio' ||
                 responsesContainer.children[i].children[0].className.indexOf('askia-exclusive') >= 0)) {
                removeClass(responsesContainer.children[i], 'selected');
                if (obj.type === 'checkbox') {
                    document.getElementById(responsesContainer.children[i].children[0].attributes.id.value).checked = false;
                }
            }
        }

    }

    /**
   * Manage the change event on input radio and checkbox
   *
   * @param {Object} event Change event of the input radio and checkbox
   * @param {Object} that SideBySide object, same as options
   */
    function onChange (event, that) {
        var el = event.target || event.srcElement;
        if (el.nodeName === 'INPUT' && (el.type === 'radio' || el.type === 'checkbox')) {
            if (el.checked) {
                addClass(el.parentNode, 'selected');
            } else if (!el.checked) {
                removeClass(el.parentNode, 'selected');
            }
            manageExclusive(el);
             if (el.className !== 'dkbutton') {
                var shortcut = that.questions[parseInt(el.getAttribute('data-class').split('_')[1], 10) - 1] || '';
             	triggerRouting(shortcut);   
             }
        }
    }

    /**
   * Manage the change event on input DK for numeric
   *
   * @param {Object} event Change event of the input DK for numeric
   * @param {Object} that SideBySide object, same as options
   */
    function onNumericInputDK (event, that) {
        var el = event.target || event.srcElement;
        var inputValue = el.id.split('_')[1];
        var inputNumber = document.getElementById('askia-input-number' + inputValue);
        var inputRange = document.getElementById('askia-input-range_' + inputValue);
        var inputCurrency = document.getElementById('askia-input-currency' + inputValue);
        if (el.nodeName === 'INPUT' && (el.type === 'checkbox')) {
            if (el.checked) {
                inputNumber.value = '';
                inputNumber.setAttribute('readonly', 'readonly');
                // If use slider
                if (that.useSlider === 1) {
                    var suffix = that.suffixes[parseInt(inputRange.className.split('_')[2], 10) - 1];
                    inputRange.value = '';
                    inputRange.setAttribute('disabled', 'disabled');
                    removeClass(inputRange,'selected');
                    inputRange.parentElement.nextElementSibling.innerHTML = suffix;
                }
                // If use currency
                if (that.useSlider === 2) {
                    inputCurrency.value = '';
                    inputCurrency.setAttribute('readonly', 'readonly');
                }
            } else if (!el.checked) {
                inputNumber.removeAttribute('readonly');
                // If use slider
                if (that.useSlider === 1) {
                    inputRange.removeAttribute('disabled');
                }
                // If use currency
                if (that.useSlider === 2) {
                    inputCurrency.removeAttribute('readonly');
                }
            }
            if ('createEvent' in document) {
                var evt = document.createEvent('HTMLEvents');
                evt.initEvent('input', false, true);
                inputNumber.dispatchEvent(evt);
            } else {
                inputNumber.fireEvent('oninput');
            }
        }
    }

    /**
   * Manage the change event on input DK for open
   *
   * @param {Object} event Change event of the input DK for open
   * @param {Object} that SideBySide object, same as options
   */
    function onOpenInputDK (event, that) {
        var el = event.target || event.srcElement;
        var inputValue = el.id.split('_')[1];
        var inputOpen = document.getElementById('askia-input-open' + inputValue);
        if (el.nodeName === 'INPUT' && (el.type === 'checkbox')) {
            if (el.checked) {
                inputOpen.value = '';
                inputOpen.setAttribute('readonly', 'readonly');
            } else if (!el.checked) {
                inputOpen.removeAttribute('readonly');
            }
            if ('createEvent' in document) {
                var evt = document.createEvent('HTMLEvents');
                evt.initEvent('input', false, true);
                inputOpen.dispatchEvent(evt);
            } else {
                inputOpen.fireEvent('oninput');
            }
        }
    }
    
    /**
   * Manage the change event on input DK for date
   *
   * @param {Object} event Change event of the input DK for date
   * @param {Object} that SideBySide object, same as options
   */
    function onDateInputDK (event, that) {
        var el = event.target || event.srcElement;
        var inputValue = el.id.split('_')[1];
        var inputDate = document.getElementById('askia-input-date' + inputValue);
        var inputTime = document.getElementById('askia-input-time' + inputValue);
        var selectHour = document.getElementById('hour_' + inputValue);
        var selectMinutes = document.getElementById('minutes_' + inputValue);
        var selectSeconds = document.getElementById('seconds_' + inputValue);
        if (el.nodeName === 'INPUT' && (el.type === 'checkbox')) {
            if (el.checked) {
                if (inputDate) {
                	inputDate.value = '';
                	inputDate.setAttribute('readonly', 'readonly');   
                    inputDate.setAttribute('disabled', 'disabled');   
                }
                if (selectHour) {
                    selectHour.selectedIndex =0;
                	selectHour.setAttribute('disabled', 'disabled');   
                }
                if (selectMinutes) {
                    selectMinutes.selectedIndex =0;
                	selectMinutes.setAttribute('disabled', 'disabled');   
                }
                if (selectSeconds) {
                    selectSeconds.selectedIndex =0;
                	selectSeconds.setAttribute('disabled', 'disabled');   
                }
                if (inputTime) {
                	inputTime.value = '';
                	inputTime.setAttribute('readonly', 'readonly');
                }
            } else if (!el.checked) {
                if (inputDate) {
                	inputDate.setAttribute('readonly', 'true');
                    inputDate.removeAttribute('disabled');
                }
                if (selectHour) {
                	selectHour.removeAttribute('disabled');
                }
                if (selectMinutes) {
                	selectMinutes.removeAttribute('disabled');
                }
                if (selectSeconds) {
                	selectSeconds.removeAttribute('disabled');
                }
                if (inputTime) {
                	inputTime.removeAttribute('readonly');
                }
            }
            if ('createEvent' in document) {
                var evt = document.createEvent('HTMLEvents');
                evt.initEvent('input', false, true);
                if (inputDate) {
                	inputDate.dispatchEvent(evt);
                }
                if (inputTime) {
                	inputTime.dispatchEvent(evt);
                }
            } else {
                if (inputDate) {
                	inputDate.fireEvent('oninput');
                }
                if (inputTime) {
                	inputTime.fireEvent('oninput');
                }
            }
        }
    }

    /**
   * Manage the input event on input numbers - live sum
   *
   * @param {Object} event Input event of the input numbers
   * @param {Object} that SideBySide object, same as options
   */
    function onInputNumbers (event, that) {
        var el = event.target || event.srcElement;
        var split = el.className.split('_')
        var maxLimit = that.maxLimit[parseInt(split[2], 10) - 1];
        var decimals = that.decimals[parseInt(split[2], 10) - 1] || 0;
        var shortcut = that.questions[parseInt(el.getAttribute('data-class').split('_')[1], 10) - 1] || '';
        var sum = 0;
        var inputNumbers = document.querySelectorAll('#adc_' + that.instanceId + ' .' + el.className);
        for (var i = 0; i < inputNumbers.length; i++) {
            sum += parseFloat(inputNumbers[i].value) || 0;
        }
        var results = document.querySelectorAll('#adc_' + that.instanceId + ' .result_' + split[1] + '_' + split[2]);
        var resultSum = document.querySelectorAll('#adc_' + that.instanceId + ' .sum_' + split[1] + '_' + split[2]);
        for (var j = 0; j < results.length; j++) {
            // Update the live sum result
            if (that.showTotal === 1) {
                results[j].innerHTML = sum.toLocaleString(undefined, {minimumFractionDigits: decimals,maximumFractionDigits: decimals});
            } else if (that.showTotal === 2) {
                if (isNaN(maxLimit) === false) {
                    results[j].innerHTML = (maxLimit  - sum).toLocaleString(undefined, {minimumFractionDigits: decimals,maximumFractionDigits: decimals});  
                } else {
                    results[j].innerHTML = (sum).toLocaleString(undefined, {minimumFractionDigits: decimals,maximumFractionDigits: decimals});
                }
            }
            // Update the class if equal or above limit
            if (isNaN(maxLimit) === false && (that.showTotal === 1 || that.showTotal === 2)) {
                if (sum === maxLimit) {
                    removeClass(resultSum[j], 'aboveLimit');
                    addClass(resultSum[j], 'equalLimit');
                } else if (sum > maxLimit) {
                    removeClass(resultSum[j], 'equalLimit');
                    addClass(resultSum[j], 'aboveLimit');
                } else {
                    removeClass(resultSum[j], 'equalLimit');
                    removeClass(resultSum[j], 'aboveLimit');
                }
            }
        }
        triggerRouting(shortcut);
    }
    
    /**
   * Manage the input event on open ended (input text, email, url and textarea)
   *
   * @param {Object} event Input event of the open ended
   * @param {Object} that SideBySide object, same as options
   */
    function onInputOpens (event, that) {
        var el = event.target || event.srcElement;
        var split = el.className.split('_')
        var shortcut = that.questions[parseInt(el.getAttribute('data-class').split('_')[1], 10) - 1] || '';
        triggerRouting(shortcut);
    }
    
    /**
   * Manage the input event on date time
   *
   * @param {Object} event Input event of the date time
   * @param {Object} that SideBySide object, same as options
   */
    function onInputDates (event, that) {
        var el = event.target || event.srcElement;
        var split = el.className.split('_')
        var shortcut = that.questions[parseInt(el.getAttribute('data-class').split('_')[1], 10) - 1] || '';
        triggerRouting(shortcut);
    }

    /**
   * Manage the input event on input ranges - live sum
   *
   * @param {Object} event Input event of the input ranges
   * @param {Object} that SideBySide object, same as options
   */
    function onInputRanges (event, that) {
        var el = event.target || event.srcElement;
        var split = el.className.split('_')
        var suffix = that.suffixes[parseInt(split[2], 10) - 1];
        var decimals = that.decimals[parseInt(split[2], 10) - 1] || 0;
        var inputNumber = document.querySelector('#adc_' + that.instanceId + ' #askia-input-number' + el.id.split('_')[1]);
        inputNumber.value = el.value;
        el.parentElement.nextElementSibling.innerHTML = parseFloat(el.value).toLocaleString(undefined, {minimumFractionDigits: decimals,maximumFractionDigits: decimals}) + suffix;
        addClass(el,'selected');
        document.querySelector('#adc_' + that.instanceId + ' #' + el.id + ' + .preBar').style.width = widthRange(el) + 'px';
        if ('createEvent' in document) {
            var evt = document.createEvent('HTMLEvents');
            evt.initEvent('input', false, true);
            inputNumber.dispatchEvent(evt);
        } else {
            inputNumber.fireEvent('oninput');
        }
    }

    /**
   * Return width of the left side of the input range
   *
   * @param {Object} inputRange input range
   */
    function widthRange (inputRange) {
        var min = (inputRange.min) ? parseInt(inputRange.min, 10) : 0;
        var max = (inputRange.max) ? parseInt(inputRange.max, 10) : 100;
        var range = max - min;
        var w = parseInt(inputRange.clientWidth, 10);
        var t = ~~(w * (parseInt(inputRange.value, 10) - min) / range);

        return (((t / w) * 100) < 16 && ((t / w) * 100) > 0) ? t + 4 : t;
    }


    /**
  * Calculate the offsetTop
  *
  * @param {HTMLElements} elem HTMLElement
  */
    function calcOffsetTop (elem) {
        if (!elem) elem = this;
        var y = elem.offsetTop;
        while (elem = elem.offsetParent) {
            y += elem.offsetTop;
        }
        return y;
    }

    /**
   * Make the header always visible and fixed when scrolling
   *
   * @param {HTMLElements} el HTMLElement which should be always visible - the header
   * @param {Object} options Options of the ResponsiveTable
   */
    function headerFix (el, opt) {
        if (!opt.headerFixed) return;

        var offsetHeight = document.getElementById('adc_' + opt.instanceId).offsetHeight || document.getElementById('adc_' + opt.instanceId).height;
        var offsetHeightThead = document.querySelector('#adc_' + opt.instanceId + ' thead').offsetHeight || document.querySelector('#adc_' + opt.instanceId + ' thead').height;
        var offsetTop = calcOffsetTop(document.getElementById('adc_' + opt.instanceId));
        var scrollTop = (document.documentElement && document.documentElement.scrollTop) || document.body.scrollTop;
        var top = 0;
        if ((scrollTop >= offsetTop) && (scrollTop <= (offsetTop + offsetHeight - (offsetHeightThead + 10)))) {
            top = scrollTop - (offsetTop + 2);
        } else {
            top = 0;
        }

        var translate = 'translateY(' + top + 'px)';
        for (var i = 0; j = el.length, i < j; i++) {
            if (document.documentMode < 12) {
                el[i].style.msTransform = translate;
            } else {
                el[i].style.WebkitTransform = translate;
                el[i].style.WebkitTransition = 'all 0.2s';
                el[i].style.MozTransform = translate;
                el[i].style.MozTransition = 'all 0.2s';
                el[i].style.transform = translate;
                el[i].style.transition = 'all 0.2s';
            }
        }
    }

    /**
   * Add zoom to images present in the loop responses
   *
   * @param {string} strId Id of the zoom
   */
    function simplboxConstructorCall(strId) {
        var preLoadIconOn = function () {
            var newE = document.createElement("div"),
                newB = document.createElement("div");
            newE.setAttribute("id", "simplbox-loading");
            newE.appendChild(newB);
            document.body.appendChild(newE);
        },
            preLoadIconOff = function () {
                var elE = document.getElementById("simplbox-loading");
                elE.parentNode.removeChild(elE);
            },
            overlayOn = function () {
                var newA = document.createElement("div");
                newA.setAttribute("id", "simplbox-overlay");
                document.body.appendChild(newA);
            },
            overlayOff = function () {
                var elA = document.getElementById("simplbox-overlay");
                elA.parentNode.removeChild(elA);
            };
        var img = new SimplBox(document.querySelectorAll("[data-simplbox='" + strId + "']"), {
            quitOnImageClick: true,
            quitOnDocumentClick: false,
            onStart: overlayOn,
            onEnd: overlayOff,
            onImageLoadStart: preLoadIconOn,
            onImageLoadEnd: preLoadIconOff
        });
        img.init();
    }

    /**
   * Reset the combo box when using ranking
   *
   * @param {HTMLElements} inputSelect Select to reset
   */
    function resetComboBox(inputSelects) {
        for(var i = 0; i < inputSelects.length; i++) {
            var optList = inputSelects[i].getElementsByTagName("option");
            for( var j = 0; j < optList.length; j++) {
                optList[j].disabled = false;
            }
        }
    }

    /**
   * Update the combo box when using ranking
   *
   * @param {Object} event Change event of the select
   * @param {Object} that SideBySide object, same as options
   */
    function updateComboBox(event, that) {
        var el = event.target || event.srcElement;
        var shortcut = that.questions[parseInt(el.getAttribute('data-class').split('_')[1], 10) - 1] || '';
        var inputSelect = document.querySelectorAll("." + el.className);
        resetComboBox(inputSelect);
        var selectedIndex = 0;
        for (i = 0; i < inputSelect.length; i++) {
            selectedIndex = inputSelect[i].selectedIndex;
            if (selectedIndex !== 0) {
                for (j = i + 1; j < inputSelect.length; j++) {
                    var optionList = inputSelect[j].getElementsByTagName("option");
                    if (inputSelect[j].selectedIndex === selectedIndex) inputSelect[j].selectedIndex = 0;
                    optionList[selectedIndex].disabled = true;
                }
            }
        }
        triggerRouting(shortcut);
    }

    /**
   * Get the position of the caret
   *
   * @param {Object} ctrl Input element
   */
    function getCaretPosition (ctrl) {
        // IE < 9 Support
        if (document.selection) {
            ctrl.focus();
            var range = document.selection.createRange();
            var rangelen = range.text.length;
            range.moveStart ('character', -ctrl.value.length);
            var start = range.text.length - rangelen;
            return {'start': start, 'end': start + rangelen };
        }
        // IE >=9 and other browsers
        else if (ctrl.selectionStart || ctrl.selectionStart == '0') {
            return {'start': ctrl.selectionStart, 'end': ctrl.selectionEnd };
        } else {
            return {'start': 0, 'end': 0};
        }
    }

    /**
   * Set the new the position of the caret
   *
   * @param {Object} ctrl Input element
   * @param {Number} start Start position of the caret
   * @param {Number} end End position of the caret
   */
    function setCaretPosition(ctrl, start, end) {
        // IE >= 9 and other browsers
        if(ctrl.setSelectionRange) {
            ctrl.focus();
            ctrl.setSelectionRange(start, end);
        } else if (ctrl.createTextRange) {
            var range = ctrl.createTextRange();
            range.collapse(true);
            range.moveEnd('character', end);
            range.moveStart('character', start);
            range.select();
        }
    }

    /**
   * Add space as thousand separator for numerical variable when using currency
   *
   * @param {Object} x Input element
   */
    function numberWithThousandSeparator(x) {
        var currentPosition = getCaretPosition(x);
        var currentValue = x.value.toString();
        var parts = [];
        var inputNumber = document.querySelector('[name=' + x.name.toString().split("_")[1] + ']');
        parts[0] = x.value.toString();
        parts[1] = "";
        var sep = "";
        if ( x.value.toString().indexOf(".") >= 0 ) {
            parts = x.value.toString().split(".");
            sep = ".";
        }
        parts[1] = parts[1].trim();
        x.value = parts[0].replace(/ /g,"").replace(/\B(?=(\d{3})+(?!\d))/g, " ") + sep + parts[1];
        inputNumber.value = x.value.replace(/ /g,"");
        if (currentValue.length < x.value.length) {
            setTimeout(function(){ setCaretPosition(x, currentPosition.start + 1, currentPosition.end + 1); }, 1);
        } else if (currentValue.length > x.value.length) {
            setTimeout(function(){ setCaretPosition(x, currentPosition.start - 1, currentPosition.end - 1); }, 1);
        } else {
            setCaretPosition(x, currentPosition.start, currentPosition.end);
        }
        if ('createEvent' in document) {
            var evt = document.createEvent('HTMLEvents');
            evt.initEvent('input', true, true);
            inputNumber.dispatchEvent(evt);
        } else {
            inputNumber.fireEvent('oninput');
        }
    }

    /**
   * Check if the key pressed is a number
   *
   * @param {Object} event Press event of the input
   * @param {Object} x Input element
   */
    function isNumberKey(evt, x){
        var charCode = (evt.which) ? evt.which : event.keyCode;
        if (((charCode != 46) && (charCode < 48 || charCode > 57)) || ((x.value.toString().indexOf(".") >= 0) && (charCode === 46  || charCode === 110  || charCode === 190 ))) {
            evt.preventDefault();
            return false;
        }
        return true;
    }
    
    /**
   * Check if the date question has an answer
   *
   * @param {Object} td Date td
   */
    function checkAnswersDates (td) {
        var inputDate = document.querySelector('.RLDatePicker input[type=text]');
        var selectHour = document.querySelector('.RLTimePicker select[id^=hour]');
        var selectMinute = document.querySelector('.RLTimePicker select[id^=minutes]');
        var selectSecond = document.querySelector('.RLTimePicker select[id^=seconds]');
        var inputDk = document.querySelector('.DK input[type=checkbox]');
    }
    
    /**
   * Step by step functionnality (Show or hide next row)
   *
   * @param {Object} that SideBySide object, same as options
   */
    function stepByStep (that) {
        var trs = document.querySelectorAll('#adc_' + that.instanceId + ' tbody > tr');
        var tds;
        var dataFound = false;
        // Iterate tr backwards
    	for (var i = trs.length; i-- > 0; ) {
            tds = trs[i].querySelectorAll('td');
            // Iterate td backwards
    		for (var j = tds.length; j-- > 1; ) {
                if (hasClass(tds[j],'date')) {
                    
                } else if (hasClass(tds[j],'open')) {
                    
                } else if (hasClass(tds[j],'numeric')) {
                    
                } else if (hasClass(tds[j],'select')) {
                    
                } else if (hasClass(tds[j],'closed')) {
                    
                } 
            }
        }   
    }

    /**
   * Creates a new instance of the SideBySide
   *
   * @param {Object} options Options of the SideBySide
   * @param {String} options.instanceId=1 Id of the ADC instance
   */
    function SideBySide (options) {
        this.options = options;
        this.instanceId = options.instanceId || 1;
        this.showTotal = options.showTotal || 0;
        this.questions = options.questions || [];
        this.maxLimit = options.maxLimit || [];
        this.headerFixed = options.headerFixed;
        this.rankingBox = options.rankingBox || [];
        this.suffixes = options.suffixes || [];
        this.decimals = options.decimals || [];
        this.useSlider = options.useSlider || 0;

        var radios = document.querySelectorAll('#adc_' + this.instanceId + ' input[type="radio"]');
        var checkboxes = document.querySelectorAll('#adc_' + this.instanceId + ' input[type="checkbox"]');
        var inputNumbers = document.querySelectorAll('#adc_' + this.instanceId + ' input[type="number"]');
        var inputRanges = document.querySelectorAll('#adc_' + this.instanceId + ' input[type="range"]');
        var numInputDK = document.querySelectorAll('#adc_' + this.instanceId + ' .numeric .DK input[type="checkbox"]');
        var inputOpens = document.querySelectorAll('#adc_' + this.instanceId + ' .open .inputopen');
        var openInputDK = document.querySelectorAll('#adc_' + this.instanceId + ' .open .DK input[type="checkbox"]');
        var inputDates = document.querySelectorAll('#adc_' + this.instanceId + ' .date input[type="text"]');
        var dateInputDK = document.querySelectorAll('#adc_' + this.instanceId + ' .date .DK input[type="checkbox"]');

        // Change event on input radio
        for (var i = 0; i < radios.length; i++) {
            addEvent(radios[i], 'change', 
                     (function (passedInElement) {
                return function (e) {
                    onChange(e, passedInElement); 
                };
            }(this)));
        }

        // Change event on input checkbox
        for (var j = 0; j < checkboxes.length; j++) {
            addEvent(checkboxes[j], 'change', 
                     (function (passedInElement) {
                return function (e) {
                    onChange(e, passedInElement); 
                };
            }(this)));
        }

        // Change event on input DK checkbox for numerical variable
        for (var j1 = 0; j1 < numInputDK.length; j1++) {
            addEvent(numInputDK[j1], 'change', 
                     (function (passedInElement) {
                return function (e) {
                    onNumericInputDK(e, passedInElement); 
                };
            }(this)));
        }

        // Change event on input DK checkbox for open variable
        for (var j2 = 0; j2 < openInputDK.length; j2++) {
            addEvent(openInputDK[j2], 'change', 
                     (function (passedInElement) {
                return function (e) {
                    onOpenInputDK(e, passedInElement); 
                };
            }(this)));
        }
        
        // Change event on input DK checkbox for date variable
        for (var j3 = 0; j3 < dateInputDK.length; j3++) {
            addEvent(dateInputDK[j3], 'change', 
                     (function (passedInElement) {
                return function (e) {
                    onDateInputDK(e, passedInElement); 
                };
            }(this)));
        }

        // Input event (live sum) on input number
        for (var k = 0; k < inputNumbers.length; k++) {
            addEvent(inputNumbers[k], 'input', 
                     (function (passedInElement) {
                return function (e) {
                    onInputNumbers(e, passedInElement); 
                };
            }(this)));
            if ('createEvent' in document) {
                var evt = document.createEvent('HTMLEvents');
                evt.initEvent('input', false, true);
                inputNumbers[k].dispatchEvent(evt);
            } else {
                inputNumbers[k].fireEvent('oninput');
            }
        }

        // Change event (live sum) on input range
        for (var l = 0; l < inputRanges.length; l++) {
            addEvent(inputRanges[l], 'change', 
                     (function (passedInElement) {
                return function (e) {
                    onInputRanges(e, passedInElement); 
                };
            }(this)));
            document.querySelector('#adc_' + this.instanceId + ' #' + inputRanges[l].id + ' + .preBar').style.width = widthRange(inputRanges[l]) + 'px';
        }

        // Input event (live sum) on input range
        for (var l1 = 0; l1 < inputRanges.length; l1++) {
            addEvent(inputRanges[l1], 'input', 
                     (function (passedInElement) {
                return function (e) {
                    onInputRanges(e, passedInElement); 
                };
            }(this)));
        }

        // Resize event on input range
        window.addEventListener("resize", function() {
            for (var l2 = 0; l2 < inputRanges.length; l2++) {
                document.querySelector('#adc_' + options.instanceId + ' #' + inputRanges[l2].id + ' + .preBar').style.width = widthRange(inputRanges[l2]) + 'px';
            }
        });
        
        // Input event on open ended
        for (var k1 = 0; k1 < inputOpens.length; k1++) {
            addEvent(inputOpens[k1], 'input', 
                     (function (passedInElement) {
                return function (e) {
                    onInputOpens(e, passedInElement); 
                };
            }(this)));
            if ('createEvent' in document) {
                var evt = document.createEvent('HTMLEvents');
                evt.initEvent('input', false, true);
                inputOpens[k1].dispatchEvent(evt);
            } else {
                inputOpens[k1].fireEvent('oninput');
            }
        }
        
        // Input event on date time
        for (var k2 = 0; k2 < inputDates.length; k2++) {
            addEvent(inputDates[k2], 'input', 
                     (function (passedInElement) {
                return function (e) {
                    onInputDates(e, passedInElement); 
                };
            }(this)));
            if ('createEvent' in document) {
                var evt = document.createEvent('HTMLEvents');
                evt.initEvent('input', false, true);
                inputDates[k2].dispatchEvent(evt);
            } else {
                inputDates[k2].fireEvent('oninput');
            }
        }

        // Manage ranking combo box
        for(var i1 = 0; i1 < this.rankingBox.length ; i1++){
            if (this.rankingBox[i1]) {
                var inputElt = document.querySelectorAll(".select_"+ this.instanceId + "_" + (i1+1));
                for(var j1 = 0; j1 < inputElt.length; j1++) {
                    addEvent(inputElt[j1], 'change', 
                             (function (passedInElement) {
                        return function (e) {
                            updateComboBox(e, passedInElement); 
                        };
                    }(this)));
                    if ('createEvent' in document) {
                        var evt = document.createEvent('HTMLEvents');
                        evt.initEvent('change', false, true);
                        inputElt[j1].dispatchEvent(evt);
                    } else {
                        inputElt[j1].fireEvent('onchange');
                    }
                }
            }   
        }

        // If currency used for numerical variable
        if (this.useSlider === 2) {
            // Keypress event on input text currency
            document.addEventListener("keypress", function(event){
                var el = event.target || event.srcElement;
                if (el.nodeName === "INPUT" && el.className.indexOf("thousand") >= 0) {
                    isNumberKey(event, el);
                }
            });
            // Input event on input text currency
            document.addEventListener("input", function(event){
                var el = event.target || event.srcElement;
                if (el.nodeName === "INPUT" && el.className.indexOf("thousand") >= 0) {
                    numberWithThousandSeparator(el);
                }
            },false);
        }

        // Manage header fix
        var ths = document.querySelectorAll('#adc_' + options.instanceId + ' thead th');
        window.addEventListener('scroll', function () {
            headerFix(ths, options);
        });

        // Manage zoom
        var zooms = document.getElementById('adc_' + this.instanceId).querySelectorAll('tbody tr');
        for (var l1 = 0, k1 = zooms.length; l1 < k1; l1++) {
            simplboxConstructorCall(zooms[l1].getAttribute('data-id'));
        }
    }

    /**
   * Attach the SideBySide to the window object
   */
    window.SideBySide = SideBySide;

}());
