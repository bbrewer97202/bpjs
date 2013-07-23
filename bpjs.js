/*! bpjs.js - v0.0.1 - 2013-06-21
 * https://github.com/bbrewer97202/bpjs
 *
 * Copyright (c) 2013 Ben Brewer <bbrewer97202@yahoo.com>;
 * Licensed under the MIT license */
var BPJS = (function() {

    var _data = {
        width: 0,
        height: 0
    };
    var _mq = {};
    var _callback;
    var _supportedMediaQueries = false;

    //initialization
    function init(queries, callback) {

        _mq = queries || _mq;
        _callback = callback;

        //store initial page dimensions
        var pageDimensions = pageDimensionsUpdate();
        _data.width = pageDimensions.width;
        _data.height = pageDimensions.height;

        evaluateMediaQueries();

        //watch for window resizes
        if (window.addEventListener) {
            window.addEventListener ("resize", onResize, false);
        } else if (window.attachEvent) {
            window.attachEvent ('onresize', onResize); 
        }
    }

    //evaluate media queries on window resize event if the dimensions of window have changed
    function onResize() {    

        var dimensions = pageDimensionsUpdate();

        //do nothing unless width/height values differ from previously saved values
        if ((_data.width !== dimensions.width) || (_data.height !== dimensions.height)) {

            _data.width = dimensions.width;
            _data.height = dimensions.height;

            evaluateMediaQueries();
        }
    }

    //evaluate the specificed media queries and update the current breakpoint
    function evaluateMediaQueries() {

        var currentQuery = _data.breakpoint;
        var matchedCount = 0;

        //evaluate media queries list and save the last match
        //queries assumed to be exclusive
        for (var query in _mq) {
            if (window.matchMedia(_mq[query]).matches) {
                _data.breakpoint = query;
                _supportedMediaQueries = true;
                matchedCount++;
            } 
        }

        //if there is at least one match, at least one media query supported
        if (matchedCount > 0) {
            _supportedMediaQueries = true;
        }

        //if a callback specified, invoke it with the id of the matched breakpoint
        if (typeof(_callback) === "function") { 
            if (currentQuery !== _data.breakpoint) {
                _callback.call(_mq, _data.breakpoint);
            }
        } 
    } 

     //save the current page dimensions
    function pageDimensionsUpdate() {
        return {
            width: (window.innerWidth) ? window.innerWidth : document.body.clientWidth,
            height: (window.innerHeight) ? window.innerHeight : document.body.clientHeight
        };
    }

    return {
        init: init,
        mediaQueries: function() {
            return _supportedMediaQueries;
        }
    };
    
})();

/* https://github.com/paulirish/matchMedia.js */
/*! matchMedia() polyfill - Test a CSS media type/query in JS. Authors & copyright (c) 2012: Scott Jehl, Paul Irish, Nicholas Zakas. Dual MIT/BSD license */
window.matchMedia = window.matchMedia || (function( doc, undefined ) {

  "use strict";

  var bool,
      docElem = doc.documentElement,
      refNode = docElem.firstElementChild || docElem.firstChild,
      // fakeBody required for <FF4 when executed in <head>
      fakeBody = doc.createElement( "body" ),
      div = doc.createElement( "div" );

  div.id = "mq-test-1";
  div.style.cssText = "position:absolute;top:-100em";
  fakeBody.style.background = "none";
  fakeBody.appendChild(div);

  return function(q){

    div.innerHTML = "&shy;<style media=\"" + q + "\"> #mq-test-1 { width: 42px; }</style>";

    docElem.insertBefore( fakeBody, refNode );
    bool = div.offsetWidth === 42;
    docElem.removeChild( fakeBody );

    return {
      matches: bool,
      media: q
    };

  };

}( document ));
