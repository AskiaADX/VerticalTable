(function() {
    var msEdgeMatch = /Edge\/([0-9]+)/i.exec(navigator.userAgent);
    if(msEdgeMatch) document.documentMode = parseInt(msEdgeMatch[1]);
})();
(function () {

    /**
   * Calculate the offsetTop
   *
   * @param {HTMLElements} elem HTMLElement
   */
    function calcOffsetTop(elem) {
        if(!elem) elem = this;
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
    function headerFix(el,opt) {
        if ( !opt.headerFixed) return;

        var offsetHeight = document.getElementById("adc_" + opt.instanceId).offsetHeight || document.getElementById("adc_" + opt.instanceId).height;
        var offsetHeightThead = document.getElementById("adc_" + opt.instanceId +"_thead").offsetHeight || document.getElementById("adc_" + opt.instanceId +"_thead").height;
        var offsetTop = calcOffsetTop(document.getElementById("adc_" + opt.instanceId));
        var scrollTop = (document.documentElement && document.documentElement.scrollTop) || document.body.scrollTop;
        var top = 0;
        if ((scrollTop >= offsetTop) && (scrollTop <= (offsetTop + offsetHeight - (offsetHeightThead + 10))) ) {
            top = scrollTop - (offsetTop + 2);
        } else {
            top = 0;
        }
        var translate = "translateY("+top+"px)";
        for (var i = 0; j = el.length, i < j; i++) {
            if (document.documentMode < 12) {
                el[i].style.msTransform = translate;
            } else {
                el[i].style.WebkitTransform = translate;
                el[i].style.WebkitTransition = "all 0.2s";
                el[i].style.MozTransform = translate;
                el[i].style.MozTransition = "all 0.2s";
                el[i].style.transform = translate;
                el[i].style.transition = "all 0.2s";
            }
        }
    }


    /**
   * Creates a new instance of the SideBySideTable
   *
   * @param {Object} options Options of the SideBySideTable
   * @param {String} options.instanceId=1 Id of the ADC instance
   */
    function SideBySideTable(options) {
        this.options = options;
        this.instanceId = options.instanceId || 1;
        this.nbCol = options.nbCol;
        this.showSum = options.showSum;
        this.stepByStep = options.stepByStep;
        this.maxLimit = options.maxLimit;
        this.blockLimit = options.blockLimit;
        this.rankingBox = options.rankingBox;
        this.headerFixed = options.headerFixed;


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

        var zooms = document.getElementById("adc_" + this.instanceId).querySelectorAll("tbody tr");
        for (var l1 = 0, k1 = zooms.length; l1 < k1; l1++) {
            simplboxConstructorCall(zooms[l1].getAttribute("data-id"));
        }

        var headerszooms = document.getElementById("adc_" + this.instanceId).querySelectorAll(".otherColumn img");
        for (var l2 = 0, k2 = headerszooms.length; l2 < k2; l2++) {
            simplboxConstructorCall(headerszooms[l2].getAttribute("data-id"));
        }

        var elements = document.querySelectorAll("#adc_" + options.instanceId + "_thead th");
        window.addEventListener("scroll",function(){
            headerFix(elements,options);
        });


        function triggerRouting() {
            console.log("trigger Routing");
            var routing_bool = false;
            for(i=0; i<options.questions.length; i++){
                routing_bool = routing_bool || (window.askia 
                && window.arrLiveRoutingShortcut 
                && window.arrLiveRoutingShortcut.length > 0 &&
                window.arrLiveRoutingShortcut.indexOf(options.questions[i]) >= 0);
            }
            if (window.askia 
                && window.arrLiveRoutingShortcut 
                && window.arrLiveRoutingShortcut.length > 0
                && routing_bool) {
                askia.triggerAnswer();
            }
        }

        /**
        * Handle exclusive response in multicoded questions
        */
        function exclusiveChangeEvent(event) {
            var elTarg = event.target || event.srcElement;
            elTarg.checked ? AddClass(elTarg.parentElement,"cell-selected") : RemoveClass(elTarg.parentElement,"cell-selected");
            var el = document.getElementById(elTarg.id);
            if(HasClass(el,'askia-exclusive') && (el.checked == true)){
                var filtered = Array.prototype.filter.call(document.querySelectorAll('[id^="'+ el.id.split("_")[0] +'_"]' ), function (elem) {return elem !== el;});
                filtered.forEach(function(element) {
                    element.checked = false;
                    RemoveClass(element.parentElement,"cell-selected");
                });
                /*document.querySelectorAll('[name^="'+ el.name.split(" ")[0] +'"]' ).filter(function (elem) {return elem !== el;}).forEach(function(element) {
                        element.checked = false;
                    });*/
            } else {
                var element = document.querySelectorAll('[id^="'+ el.id.split("_")[0] +'_"].askia-exclusive' );
                Array.prototype.forEach.call(element, function(element) {
                    element.checked = false;
                    RemoveClass(element.parentElement,"cell-selected");
                });
            }
            triggerRouting();
        }

        /**
        * add the eventlistener to implement exclusive answer inside multi coded question
        */
        var inputElmt = document.querySelectorAll('input');
        for(i = 0; i<inputElmt.length; i++) {
            inputElmt[i].addEventListener("change", exclusiveChangeEvent);    
            inputElmt[i].addEventListener("input", exclusiveChangeEvent);    
        }

        /**
       * addEvent Listener for step by step table
       */
        if(this.stepByStep){
            var inputElt = document.querySelectorAll("[id^='row']");
            for(i = 0; i<inputElt.length; i++) {
                inputElt[i].addEventListener("change", checkResponses);    
                inputElt[i].addEventListener("input", checkResponses);
            }
            for(k = 0; k<inputElt.length; k++) {
                checkResponses(null, inputElt[k].id);
            }
        }

        for(j=0; j<this.nbCol; j++){
            if(this.rankingBox[j]){
                var inputElt = document.querySelectorAll("[class='col"+ (j+1) +"']");
                for(i = 0; i<inputElt.length; i++) {
                    if(inputElt[i].firstElementChild.id.substr(0, 18) == "askia-input-select") {
                        inputElt[i].firstElementChild.addEventListener("change", updateComboBox);    
                        inputElt[i].firstElementChild.addEventListener("input", updateComboBox);
                    }
                }
            }   
        }

        if(this.showSum) {
            var inputNum = document.querySelectorAll("[id^='askia-input-number']");
            for(i = 0; i<inputNum.length; i++) {
                inputNum[i].addEventListener("change", updateSum);    
                inputNum[i].addEventListener("input", updateSum);
                if ("createEvent" in document) {
                    var evt = document.createEvent("HTMLEvents");
                    evt.initEvent("change", false, true);
                    inputNum[i].dispatchEvent(evt);
                } else {
                    inputNum[i].fireEvent("onchange");
                }
            }
        }
        /**
       *	Function that check if every questions of a row are fully completed
       */
        function checkResponses(event, elmtID) {
            /**if(event != null) {
                var tmpStr = event.target.parentNode.parentNode.id;
            }**/
            var el = event.target || event.srcElement;
            if(event != null) {
                var parent = el.parentNode;
                var tmpStr = parent.id;
            
                while (tmpStr == "" || tmpStr == undefined || tmpStr == null || tmpStr.substr(0,3) != "row") {
                    parent = parent.parentNode;
                    tmpStr = parent.id;
                }
            }
            
            if(elmtID != null) {
                tmpStr = elmtID;
            }
            var idRow = tmpStr.replace( /^\D+/g, '');
            var nbCol = options.nbCol;
            var test2 = true;
            for(j=1; j<=nbCol; j++) {
                var elt = document.querySelector("[id='row" + idRow + "']").querySelectorAll(".col"+j);
                var test1 = false
                for(i=0; i<elt.length; i++) {
                    var input = elt[i].firstElementChild;
                    if (HasClass(input,"number-element")) input = elt[i].firstElementChild.firstElementChild;
                    if ((input.id.substring(0, 16) === "askia-input-open") || (input.id.substring(0, 18) === "askia-input-number")) {
                        test1 = test1 || elt[i].firstElementChild.value != "";
                    } else if (input.id.substring(0, 18) === "askia-input-select") {
                        test1 = test1 || elt[i].firstElementChild.value != 0;
                    } else {
                        test1 = test1 || elt[i].firstElementChild.checked;
                    }
                }
                test2 = test2 && test1;
            }
            var achieveLim = true;
            if(options.blockLimit){
                achieveLim = false;
                for(i = 0; i<nbCol; i++) {
                    var inputNum = document.querySelectorAll("[id^='askia-input-number'][id$='" + (i+1) + "']");
                    sum = 0;
                    for(j=0; j<inputNum.length; j++) sum += parseInt(inputNum[j].value) || 0;
                    if(options.maxLimit[i] != null) achieveLim = achieveLim || ( sum < options.maxLimit[i]);
                }
            }
            var newRow = "row" + (parseInt(idRow)+1);
            if(test2 && achieveLim) {
                if(document.querySelector("#"+newRow) != null) {
                    document.querySelector("#"+newRow).removeAttribute("hidden");
                    checkResponses(null, newRow);	
                }
            } else {
                var newIDRow = (parseInt(idRow)+1)
                while (document.querySelector("#"+newRow) != null){
                    document.querySelector("#"+newRow).setAttribute("hidden", true);
                    newIDRow += 1;
                    newRow = "row"+newIDRow;
                }
            }
        }


        function resetComboBox(inputSelect) {
            for(i=0; i<inputSelect.length; i++) {
                var optList = inputSelect[i].getElementsByTagName("option");
                for(j=0; j<optList.length; j++) {
                    optList[j].disabled=false;
                }
            }
        }

        function updateComboBox(event) {
            var el = event.target || event.srcElement;
            var col = el.id.substr(el.id.length-1, 1);
            var inputSelect = document.querySelectorAll("[id^='askia-input-select'][id$='" + col + "']");
            resetComboBox(inputSelect);
            var selectedIndex = 0;
            for(i=0; i<inputSelect.length; i++) {
                selectedIndex = inputSelect[i].selectedIndex;
                if(selectedIndex != 0) {
                    for(j=i+1; j<inputSelect.length; j++) {
                        var optionList = inputSelect[j].getElementsByTagName("option");
                        //inputSelect[j].remove(inputSelect[i].selectedIndex);
                        if (inputSelect[j].selectedIndex == selectedIndex) inputSelect[j].selectedIndex = 0;
                        optionList[selectedIndex].disabled = true;
                    }
                }
            }
        }

        function updateSum(event) {
            var el = event.target || event.srcElement;
            var col = el.id.substr(el.id.length-1, 1);
            var inputNum = document.querySelectorAll("[id^='askia-input-number'][id$='" + col + "']");
            var sum = 0;
            var totalCol = document.querySelector("#totalCol"+options.instanceId+"_"+col);
            for(i = 0; i<inputNum.length; i++) {
                var tmp = inputNum[i];
                sum += parseInt(tmp.value) || 0;
            }
            if(options.maxLimit[col-1] != null) {
                if (sum == options.maxLimit[col-1]) { 
                    RemoveClass(totalCol,"aboveLimit");
                    AddClass(totalCol,"equalLimit");
                } else if (sum > options.maxLimit[col-1]) {
                    RemoveClass(totalCol,"equalLimit");
                    AddClass(totalCol,"aboveLimit");
                } else {
                    RemoveClass(totalCol,"equalLimit");
                    RemoveClass(totalCol,"aboveLimit");
                }
            }
            document.querySelector("#total"+options.instanceId+"_"+col).innerHTML = sum;
        }
    }
    
    function AddClass(el,className) {
        if (el.classList)
            el.classList.add(className);
        else
            el.className += ' ' + className;
    }
    
    function RemoveClass(el,className) {
        if (el.classList)
            el.classList.remove(className);
        else
            el.className = el.className.replace(new RegExp('(^|\\b)' + className.split(' ').join('|') + '(\\b|$)', 'gi'), ' ');
    }
    
    function HasClass(el,className) {
        if (el.classList)
            return el.classList.contains(className);
        else
            return new RegExp('(^| )' + className + '( |$)', 'gi').test(el.className);
    }


    function clickCellEvent(event){
        var el = event.target || event.srcElement;
        if (el.firstElementChild != null) {
            el.firstElementChild.checked = !el.firstElementChild.checked;
            el.firstElementChild.checked ? AddClass(el,"cell-selected") : RemoveClass(el,"cell-selected");
            // Create the event
            if ("createEvent" in document) {
                var evt = document.createEvent("HTMLEvents");
                evt.initEvent("change", false, true);
                el.firstElementChild.dispatchEvent(evt);
            } else {
                el.firstElementChild.fireEvent("onchange");
            }
        }
    }

    /**
    * add the eventlistener to implement exclusive answer inside multi coded question
    */
    var inputElmt = document.querySelectorAll('.response');
    for(i = 0; i<inputElmt.length; i++) {
        inputElmt[i].addEventListener("click", clickCellEvent);    
    }
    
    function clickImgEvent(event){
        var el = event.target || event.srcElement;
        el.parentElement.firstElementChild.checked = !el.parentElement.firstElementChild.checked;
        el.parentElement.firstElementChild.checked ? AddClass(el.parentElement,"cell-selected") : RemoveClass(el.parentElement,"cell-selected");
        // Create the event
        if ("createEvent" in document) {
            var evt = document.createEvent("HTMLEvents");
            evt.initEvent("change", false, true);
            el.parentElement.firstElementChild.dispatchEvent(evt);
        } else {
            el.parentElement.firstElementChild.fireEvent("onchange");
        }
    }

    /**
    * add the eventlistener to implement exclusive answer inside multi coded question
    */
    var imgElmt = document.querySelectorAll('td.response img');
    for(i = 0; i<imgElmt.length; i++) {
        imgElmt[i].addEventListener("click", clickImgEvent);    
    }


    /**
   * Attach the SideBySideTable to the window object
   */
    window.SideBySideTable = SideBySideTable;

}());
