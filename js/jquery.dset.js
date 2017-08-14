/* ========================================================================
 * Dset: jQuery.dset.js v1.0.0
 * ========================================================================
 * Copyright 2017 Hetrotech Private Limited.
 * Licensed under MIT
 * ======================================================================== */

//semicolon is used to as a safety guard so that concatenated scripts and/or other plugins that are not closed properly
if (typeof $ !== 'function') {
	throw new Error('D-Set JavaScript requires jQuery\n Please Include jQuery 3.x first')
}

if (typeof htmlTagList === 'undefined') {
	throw new Error('D-Set JavaScript requires htmlTagList.js\n Please Include it')
}
 
+function ($) {
  'use strict';
  var version = $.fn.jquery.split(' ')[0].split('.')
  if ((version[0] < 3 && version[1] < 0) || (version[0] > 3)) {
    throw new Error('D-Set JavaScript requires jQuery version 3.x.x, but lower than version 4')
  }
}(jQuery);	


//Droppable Class 
	
+(function($,window){
	'use strict';
//Droppable Class To Handle Drop Events on Elements
//Using Drag and Drop Functionality
var Droppable = function(options) {
	createControlElements();
	this.keys = $.extend({},$.fn.droppable.defaults,options);
	this.droppableObject;
	this.previous;
	this.$selected = {
		element: 'undefined',
		drop: 'undefined',
		dragLeave: 'undefined',
		dragOver: 'undefined',
		dropActive:'undefined',
		tagName:'undefined'
	};
	$(window).on('click',$.proxy(this.onDropSelect,this)).off('keydown',$.fn.settings.onKeyDown).on('keydown',$.proxy($.fn.settings.onKeyDown,this)).on('keydown',$.proxy($.fn.settings.onDropKeyDown,this));
	$.fn.settings.commands['common']();
	$.fn.settings.commands['drop']();
}

Droppable.VERSION = "1.0.0";
Droppable.pluginName = "DROPPABLE";
Droppable.AUTHOR = "Sagar Dewani";
Droppable.WEBSITE = "http://www.hetrotech.in/";

function reg_droppable(options) {
    new Droppable(options);
}
//defining jQuery namespace droppable
$.fn.droppable = function(options) {
    return reg_droppable(options);
};

window.$.droppable = $.fn.droppable;
var settings = {
	disableSelect: [$("body"), $("#wrapper"), $("html"), $("option")],
	defSetting :{
		droppable: 0
	},
	modalCreated:0,
	commands:{
		'common':function() {
			var keyCode = ['alt+shift+ctrl','ctrl+m','ENTER'];
			var keyUse = ['to go back to normal mode','to check which mode is active','to view the source generated'];
			var i,html;
			for(i=0;i<keyCode.length;i++)
			{
				html = "<li class='d-set'><pre class='d-set'><code class='d-set'><i class='d-set'>"+keyCode[i]+"</i> : "+keyUse[i]+"</code></pre></li>";
				$('#cmdList').append(html);
			}
		},
		'drop':function(){
			var keyCode = ['shift+i'];
			var keyUse = ['to (de)activate droppable mode'];
			var i,html;
			for(i=0;i<keyCode.length;i++)
			{
				html = "<li class='d-set'><pre class='d-set'><code class='d-set'><i class='d-set'>"+keyCode[i]+"</i> : "+keyUse[i]+"</code></pre></li>";
				$('#cmdList').append(html);
			}
		},
		created:0
	},
	onKeyDown: function(e){
		var $that = this;
		if ($that.$selected.element !== 'undefined')
		{
			if (e.shiftKey && e.ctrlKey && e.altKey){
				for (var key in $.fn.settings.defSetting) {
					if ($.fn.settings.defSetting.hasOwnProperty(key))
						$.fn.settings.defSetting[key] = 0;
				}
			}
			if (e.ctrlKey && e.which == $that.keys.modeKey) {
				var mode = "normal";
				for (var key in $.fn.settings.defSetting) {
					if ($.fn.settings.defSetting.hasOwnProperty(key))
						if ($.fn.settings.defSetting[key] == 1) 
						mode = key;
				}
				alert("Activated Mode: " + mode);
			}
			if (e.which == $that.keys.sourceKey) {
				if($.fn.settings.defSetting.transition){
					$(".modal-body>pre").empty();
					var sheet;
					var styleSheets = $("style#d-set-stylesheet")[0].sheet ? $("style#d-set-stylesheet")[0].sheet : $("style#d-set-stylesheet")[0].styleSheet;
					var styleSheetRules = styleSheets.rules ? styleSheets.rules : styleSheets.cssRules;
					var len = styleSheetRules.length ? styleSheetRules.length : styleSheetRules.length;
					var targetClass = $that.$selected.element.attr('class').split(' ');
					var i;
					var selectorText;
					for(i=0;i<len;i++)
					{
						selectorText = styleSheetRules[i].selectorText.replace('.','');
						if(targetClass.indexOf(selectorText) > -1)
							$(".modal-body>pre").append("<code class=d-set style='background-color:#7fdfde;'>"+styleSheetRules[i].cssText+"</code><br/>");
						else
						$(".modal-body>pre").append("<code class=d-set>"+styleSheetRules[i].cssText+"</code><br/>");
					}
					$("#source-container").modal('show');
				}
				else if($.fn.settings.defSetting.colorify || $.fn.settings.defSetting.reposizing){
					$(".modal-body>pre").empty();
					$(".modal-body>pre").append("<code class=d-set>"+$that.$selected.element.attr('style')+"</code><br/>");
					$("#source-container").modal('show');
				}
			}
			//old.apply(this,arguments);
		}
		if(e.altKey && e.which == '72')
		{
			$("#cmdListContainer").toggleClass('hide');
		}
	},
	onDropKeyDown: function(e){
		var $that = this;
		if ($that.$selected.element !== 'undefined')
		{
			if (e.shiftKey && e.which == $that.keys.droppableKey)
			{
				for (var key in $.fn.settings.defSetting) {
					if ($.fn.settings.defSetting.hasOwnProperty(key))
						if ($.fn.settings.defSetting.droppable) continue;
							$.fn.settings.defSetting[key] = 0;
				}
				$.fn.settings.defSetting.droppable = ($.fn.settings.defSetting.droppable == 0) ? 1 : 0;
			}
			if(e.which == $that.keys.sourceKey)
			{
				if($.fn.settings.defSetting.droppable){
					$(".modal-body>pre").empty();
					var rules;
					if($that.keys.background.set)
					{
						rules ="{";
						rules += $that.$selected.element.attr('style');	
						rules += "}";
						
					}
					else
					{
						rules = "Add these elements   <img class='drop-img' src='your-img-path' />";
					}
					$(".modal-body>pre").append("<code class=d-set>"+rules+"</code><br/>");
					$("#source-container").modal('show');
				}
			}		
			//old.apply(this,arguments);
		}
	}
}



$.fn.settings = $.extend(true,{}, $.fn.settings|| {},settings);

$.fn.droppable.defaults = {
	droppableKey:'73',
	sourceKey:'13',
	modeKey:'77',
	dimensions:{
		maxDimensions:{
			width:1920,
			height:1080
		},
		minDimensions:{
			width:1,
			height:1
		},
	},
	customDimensions:false,
	background:{
		set:true,
		position:'initial',
		size:'cover',
		repeat:'no-repeat',
		origin:'content-box'
	}
	
};

Droppable.prototype.onDropSelect = function(e){	
	var $that = this;
	var disable = $.fn.settings.disableSelect;
	var len = disable.length,i;
	for(i=0;i<len;i++)
	{
		if($(e.target).is(disable[i]))return;
	}		
	if($(e.target).is('[class*="d-set"]')) return;
	$that.$selected.element = $(e.target);
    //$that.droppableObject = new Droppable($that.$selected.element);
    $that.$selected.dragOver = $that.$selected.element != 'undefined' ? _dragover.call($that) : 'undefined';
    $that.$selected.dragLeave = $that.$selected.element != 'undefined' ? _dragleave.call($that) : 'undefined';
    $that.$selected.drop = $that.$selected.element != 'undefined' ? _drop.call($that) : 'undefined';
	$that.$selected.tagName = $that.$selected.element != 'undefined' ? $that.$selected.element[0].tagName.toLowerCase() : 'undefined';
	$that.$selected.dropActive = $that.$selected.element != 'undefined' ? $.fn.settings.defSetting.droppable : 'undefined';
    //console.log($that.$selected);
    //if item is selected and stored in object then
    //check if previous element is set then check if previous element has border-blue class
    //then remove border blue class from previous element.

    if ($that.$selected.element) {
        if ($that.previous && $that.previous.hasClass('border-blue')) {
            $that.previous.removeClass('border-blue');
        }
		$that.previous = $that.$selected.element;
        $that.previous.addClass('border-blue');
	}

	function _dragover() {
		var dropActive;
		var selected_element = this.$selected.element;
		return selected_element.off('dragover').on('dragover', function(e) { //guarding against multiple event triggering using .off
        e.preventDefault();
        e.stopPropagation();
		dropActive = $.fn.settings.defSetting.droppable;
		if(dropActive)
        $(this).addClass('dragOver');
		});
	}
	function _dragleave(){
		var dropActive;
		var selected_element = this.$selected.element;
		return selected_element.off('dragleave').on('dragleave', function(e) {
			e.preventDefault();
			e.stopPropagation();
			dropActive = $.fn.settings.defSetting.droppable;
			if(dropActive)
			$(this).removeClass('dragOver');
		});
	}
	function _drop(){
		var that = this;
		var dropActive;
		var selected_element = this.$selected.element;
		return selected_element.off('drop').on('drop', function(e) {
			e.preventDefault();
			e.stopPropagation();
			dropActive = $.fn.settings.defSetting.droppable;
			if(dropActive)
			{
				$(this).removeClass('dragOver');
				triggerCallback.call(that,e);
			}	
		});
	}
	
}

//To call the readURL to read the source of dropped file over element
function callback(files,setDimensions,background) {
    readURL(files, this.$selected.element,setDimensions,background);
}
//To read the source of dropped file over element
function readURL(files, $element,setDimensions,background) {
    if (files) {
		if(background.set)
		{
				var size = background.size,
				origin=background.origin,
				repeat=background.repeat,
				position=background.position;
				$element.css('background-image','url("'+files+'")');
				$element.css('background-origin',origin);
				$element.css('background-position',position);
				$element.css('background-repeat',repeat);
				$element.css('background-size',size);
			}
			else
			{
				if(setDimensions)
				{	
					
					var image = new Image();
					image.onload = function(e){
						image.className = "drop-img";
						$element.append(image);
					}
					image.src = files;
					
				}
				else
				{
					if($element.prop('tagName') == "IMG")
					{
						$element.attr('src',files);
					}
					else
					{
						$element.html('<img class="drop-img" src=' + files + ' />');
					}	
				}
			}	
    }
}
function checkIfImage(url,dimensions,setDimensions,timeouT)
{
	if(window.Promise)
	{
		return new Promise(function (resolve, reject) {
			var timeout = timeouT || 5000;
			var timer, img = new Image();
			img.onerror = img.onabort = function () {
				clearTimeout(timer);
				reject(Error("Image URL is not retrievable\n Please drop image with actual URL(might not in encoded form)"));
			};
			img.onload = function (e) {
				clearTimeout(timer);
				if(setDimensions)
				{
					var maxHeight,maxWidth,minHeight,minWidth;
					maxHeight = dimensions.maxDimensions.height;
					maxWidth = dimensions.maxDimensions.width;
					minHeight = dimensions.minDimensions.height;
					if(img.width > maxWidth || img.width < minWidth)
					{
						reject(Error("The image dimensions doesn't match the specified criteria of\n Max Width: "+maxWidth+"px or Min Width: "+minWidth+"px"));
					}	
					else if(img.height > maxHeight || img.height < minHeight)
					{
						reject(Error("The image dimensions doesn't match the specified criteria of\n Max Height: "+maxHeight+"px or Min Height: "+minHeight+"px"));
					}	
					else
					{
						resolve("success");
					}
				}
				else resolve("success");
			};
			timer = setTimeout(function () {
				// reset .src to invalid URL so it stops previous
				// loading, but doesn't trigger new load
				img.src = "//!!!!/test.jpg";
				reject("timeout");
			}, timeout);
			img.src = url;
		});
	}
	else
	{
		throw new Error("Please upgrade your browser\n This doesn't support the Promises.");
	}
}


function triggerCallback(e) {
    var files =[],type,size;
	var that = this;
	//var rawSize = that.keys.maxSize;
	var dimensions = that.keys.dimensions;
	var setDimensions = that.keys.customDimensions;
	var background = that.keys.background;
	var el = that.$selected.element;
    if (e.originalEvent.dataTransfer) {
        files = e.originalEvent.dataTransfer.items;
    }
	for(var i=0; i< 1;i++)
	{	

		files[i].getAsString(function(url){checkIfImage(url,dimensions,setDimensions).then(function(data){if(data == "success")callback.call(that,url,setDimensions,background); }).catch(function(e){console.log(e);})});
	}
}
function createControlElements()
{
	if($.fn.settings.modalCreated == 0)
	createSourceModal();
}


function createSourceModal()
{
	var modal = '<div id="source-container" class="modal fade d-set" role="dialog">\
		  <div class="modal-dialog d-set">\
			<div class="modal-content d-set">\
			  <div class="modal-header d-set">\
				<button type="button" class="close d-set" data-dismiss="modal">&times;</button>\
				<h4 class="modal-title d-set">CSS Styles</h4>\
			  </div>\
			  <div class="modal-body d-set">\
				<pre class="d-set"></pre>\
			  </div>\
			  <div class="modal-footer d-set">\
				<button type="button" class="btn btn-default d-set" data-dismiss="modal">Close</button>\
			  </div>\
			</div>\
		</div>\
		</div>';
		$('body').append(modal);
	 $.fn.settings.modalCreated = 1;
}

/*function bytesToSize(bytes) {
	var sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
	if (bytes == 0) return '0 Bytes';
	var i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));
	return Math.round(bytes / Math.pow(1024, i), 2) + ' ' + sizes[i];
}*/

})(jQuery,window);
//// Droppable Class End //////////////////////	
/* ========================================================================
 * Dset: jQuery.transition.js v1.0.0
 * ========================================================================
 * Copyright 2017 Hetrotech Private Limited.
 * Licensed under MIT (https://github.com/sagardewani/Hetrotech-Projects/blob/master/LICENSE)
 * ======================================================================== */


 
+(function($,window){
	'use strict';
	var Transitions = {
	'fade':function(element,transitionOb)
		{
			var duration = transitionOb.duration,
			opacity = transitionOb.value/10,
			mode = transitionOb.mode;
			if(typeof opacity === 'undefined')opacity = 0;
			if(typeof duration === 'undefined')duration = 350;
			if(mode === "auto")mode = 'ease-in-out';
			var unit = 'ms';
			var transition = 'opacity'+' '+duration+unit+' '+mode;
			var class_name = getClass(element);
			var property = {
				t_name:['opacity'],
				t_value:[opacity],
				t_property_name:'transition',
				t_property_value:transition
			}
			setNewClass(element.element,class_name,".",property,"fade");
			element.element.addClass(class_name);

		},
	'move':function(element,transitionOb)
		{
			var position = transitionOb.position,
			direction = transitionOb.direction,
			duration = transitionOb.duration,
			distance = transitionOb.value,
			mode = transitionOb.mode;
			if(typeof direction === 'undefined') return alert("direction is not defined");
			if(typeof duration === 'undefined')duration =1350;
			if(typeof distance === 'undefined') return alert("movement must be defined");
			if(mode === "auto")mode = 'ease-in-out';
			var unit = 'ms';
			var transition,property={};
			if(position == "static")
			{
				transition = "margin-"+direction+" "+duration+unit+" "+mode;
				property = {
				t_name:['margin-'+direction],
				t_value:[distance+'px'],
				t_property_name:'transition',
				t_property_value:transition
				};
			}	
			else
			{
				transition = direction+" "+duration+unit+" "+mode;
				property = {
				t_name:[direction],
				t_value:[distance+'px !important'],
				t_property_name:'transition',
				t_property_value:transition
				};
			}
			var class_name = getClass(element);
			setNewClass(element.element,class_name,".",property,"move",direction);
			element.element.addClass(class_name);
			
		},
	'size':function(element,transitionOb)
		{
			var duration = transitionOb.duration,
			size = transitionOb.value,
			sizeType = transitionOb.property,
			mode = transitionOb.mode;
			if(typeof duration === 'undefined')duration = 350;
			if(typeof size === 'undefined')size = 0;
			if(mode === "auto")mode = 'ease-in-out';
			var unit = 'ms';
			var transition = sizeType+" "+duration+unit+" "+mode;
			var	property = {
					t_name:[sizeType],
					t_value:[size+'px !important'],
					t_property_name:'transition',
					t_property_value:transition
				};
			var class_name = getClass(element);
			setNewClass(element.element,class_name,".",property,"size");
			element.element.addClass(class_name);	
		},
	'all':function(element,transitionOb)
		{
			var duration = transitionOb.duration,
			value = transitionOb.value,
			property = transitionOb.property,
			mode = transitionOb.mode;
			if(typeof duration === 'undefined')duration = 350;
			if(typeof size === 'undefined')size = 0;
			if(mode === "auto")mode = 'ease-in-out';
			var unit = 'ms';
			var transition = "all "+duration+unit+" "+mode;
			var	property = {
					t_name:property,
					t_value:value,
					t_property_name:'transition',
					t_property_value:transition
				};
			var class_name = getClass(element);
			setNewClass(element.element,class_name,".",property);
			element.element.addClass(class_name);	
		},
	'none':function(element)
		{
			var class_name = getClass(element);
			removeIfExists(class_name);
			element.element[0].classList.remove(class_name);
		},
	'constructor':function(options){
		createControlElements();
		createNewStyle();
		this.keys = $.extend({},$.fn.transition.defaults,options);
		this.setTransition = {
			type: 'undefined',
			element: 'undefined',
			duration: 'undefined',
			value: 'undefined',
			mode: 'undefined',
			direction: 'undefined',
			position: 'undefined',
			property: 'undefined',
			phase: 0
		};
		//this.selected_element = element;
		this.previous;
		this.$selected = {
			element: 'undefined',
			tagName: 'undefined',
			position: 'undefined',
			inside: 'undefined',
			index: 'undefined',
			class: 'undefined',
		};
		$(window).on('click',$.proxy(this.setTransitions,this)).off('keydown',$.fn.settings.onKeyDown).on('keydown',$.proxy($.fn.settings.onKeyDown,this)).on('keydown',$.proxy($.fn.settings.onTransitionKeyDown,this));
		$('#d-set-next-t_task').on('click',$.proxy(this.nextTask,this));
		$('.d-set-edit-icon').on('click',$.proxy(this.editOptions,this));
		$.fn.settings.commands['common']();
		$.fn.settings.commands['hover']();
	}
};
Transitions.VERSION = "1.0.1";
Transitions.plguinName = "TRANSITION";
Transitions.AUTHOR = "Sagar Dewani";
Transitions.WEBSITE = "http://www.hetrotech.in/"

function reg_transition(options) {
    new Transitions['constructor'](options);
}
//defining jQuery namespace transition
$.fn.transition = function(options) {
    return reg_transition(options);
};

window.$.hoverTransition = $.fn.transition;

var settings = {
	disableSelect: [$("body"), $("#wrapper"), $("html"), $("option")],
	defSetting :{
		transition: 0
	},
	count:0,
	modalCreated:0,
	commands:{
		'common': function(){
			var keyCode = ['alt+shift+ctrl','ctrl+m','ENTER'];
			var keyUse = ['to go back to normal mode','to check which mode is active','to view the source generated'];
			var i,html;
			for(i=0;i<keyCode.length;i++)
			{
				html = "<li class='d-set'><pre class='d-set'><code class='d-set'><i class='d-set'>"+keyCode[i]+"</i> : "+keyUse[i]+"</code></pre></li>";
				$('#cmdList').append(html);
			}
		},
		'hover':function(){
			var keyCode = ['shift+h','esc'];
			var keyUse = ['to (de)activate hover transition mode','to (de)activate hover transition mode'];
			var i,html;
			for(i=0;i<keyCode.length;i++)
			{
				html = "<li class='d-set'><pre class='d-set'><code class='d-set'><i class='d-set'>"+keyCode[i]+"</i> : "+keyUse[i]+"</code></pre></li>";
				$('#cmdList').append(html);
			}
		},
		created:0
	},
	onKeyDown: function(e){
		var $that = this;
		if ($that.$selected.element !== 'undefined')
		{
			if (e.shiftKey && e.ctrlKey && e.altKey){
				for (var key in $.fn.settings.defSetting) {
					if ($.fn.settings.defSetting.hasOwnProperty(key))
						$.fn.settings.defSetting[key] = 0;
				}
			}
			if (e.ctrlKey && e.which == $that.keys.modeKey) {
				var mode = "normal";
				for (var key in $.fn.settings.defSetting) {
					if ($.fn.settings.defSetting.hasOwnProperty(key))
						if ($.fn.settings.defSetting[key] == 1) 
						mode = key;
				}
				alert("Activated Mode: " + mode);
			}
			if (e.which == $that.keys.sourceKey) {
				if($.fn.settings.defSetting.transition){
					$(".modal-body>pre").empty();
					var sheet;
					var styleSheets = $("style#d-set-stylesheet")[0].sheet ? $("style#d-set-stylesheet")[0].sheet : $("style#d-set-stylesheet")[0].styleSheet;
					var styleSheetRules = styleSheets.rules ? styleSheets.rules : styleSheets.cssRules;
					var len = styleSheetRules.length ? styleSheetRules.length : styleSheetRules.length;
					var targetClass = $that.$selected.element.attr('class').split(' ');
					var i;
					var selectorText;
					for(i=0;i<len;i++)
					{
						selectorText = styleSheetRules[i].selectorText.replace('.','');
						if(targetClass.indexOf(selectorText) > -1)
							$(".modal-body>pre").append("<code class=d-set style='background-color:#7fdfde;'>"+styleSheetRules[i].cssText+"</code><br/>");
						else
						$(".modal-body>pre").append("<code class=d-set>"+styleSheetRules[i].cssText+"</code><br/>");
					}
					$("#source-container").modal('show');
				}
				else if($.fn.settings.defSetting.colorify || $.fn.settings.defSetting.reposizing){
					$(".modal-body>pre").empty();
					$(".modal-body>pre").append("<code class=d-set>"+$that.$selected.element.attr('style')+"</code><br/>");
					$("#source-container").modal('show');
				}
			}
		}
		if(e.altKey && e.which == '72')
		{
			$("#cmdListContainer").toggleClass('hide');
		}
	},
	onTransitionKeyDown: function(e){
		var $that = this;
		if ($that.$selected.element !== 'undefined')
		{
			if (e.shiftKey && e.which == $that.keys.transitionKey) {
				for (var key in $.fn.settings.defSetting) {
					if ($.fn.settings.defSetting.hasOwnProperty(key))
						if ($.fn.settings.defSetting.transition) continue;
					$.fn.settings.defSetting[key] = 0;
				}
				$.fn.settings.defSetting.transition = ($.fn.settings.defSetting.transition == 0) ? 1 : 0;
				if ($.fn.settings.defSetting.transition == 1)
					$("#transitions").removeClass("hide");
				else
					$that.setInitial();
			}
			if(e.which == '27')
			{
				$that.setInitial();
			}
			//old.apply(this,arguments);
		}
	}
}



$.fn.settings = $.extend(true,{}, $.fn.settings|| {},settings);

$.fn.transition.defaults = {
	transitionKey:'72',
	sourceKey:'13',
	modeKey:'77'
};

Transitions['constructor'].prototype.setTransitions = function(e){
		var $that = this;
		var disable = $.fn.settings.disableSelect;
		var len = disable.length,i;
		for(i=0;i<len;i++)
		{
			if($(e.target).is(disable[i]))return;
		}		
		if($(e.target).is('[class*="d-set"]')) return;
		$that.$selected.element = $(e.target);
		$that.$selected.position = $that.$selected.element != 'undefined' ? ($that.$selected.element.css('position') == 'static' ? 'static' : $that.$selected.element.css('position')) : 'undefined';
		$that.$selected.tagName = $that.$selected.element != 'undefined' ? $that.$selected.element[0].tagName.toLowerCase() : 'undefined';
		$that.$selected.inside = $that.$selected.element != 'undefined' ? isElementInside($that.$selected.element) : 'undefined';
		$that.$selected.index = $that.$selected.element != 'undefined' ? getElementIndex($that.$selected.element) : 'undefined';
		$that.$selected.class = $that.$selected.element != 'undefined' ? addNewClass($that.$selected) : 'undefined';
		//console.log($that.$selected);

		if ($that.$selected.element) {
        if ($that.previous && $that.previous.hasClass('border-blue')) {
            $that.previous.removeClass('border-blue');
        }
        $that.previous = $that.$selected.element;
        $that.previous.addClass('border-blue');
		
    }	

//Private Functions


	//To check if element is child element of div element or not
	//Argument: element
	function isElementInside(element) {
		if (element.parent().is('div'))
			return true;
		else return false;
	}	
	//To get the element Index data;
	//If not available assign new index data
	//Argument : element
	function getElementIndex(element) {
		if (element.data('e_index') == null)
			element.data('e_index', ++$.fn.settings.count);
		return element.data('e_index');
	}
}         
Transitions['constructor'].prototype.nextTask = function(e) {
    e.preventDefault();
	var $that = this;
    if ($that.setTransition.phase == 0) {
        var t_type = $('#select-transition option:selected').val();
        var element;
        if ($that.$selected.element === 'undefined')
            return alert("select the element on which tranistion\nshould be applied");
        else element = $that.$selected.element;
        if (t_type == "none") return removeTransitions($that.$selected);
        $that.setTransition.element = element;
        $that.setTransition.type = t_type;
        $that.setTransition.position = $that.$selected.position;
        $that.setTransition.phase++;
        $("#t_type").addClass("hide");
        $("#duration").removeClass("hide");
    } else if ($that.setTransition.phase == 1) {
        var duration = $('#duration-transition').val();
        $that.setTransition.duration = duration;
        $("#duration").addClass("hide");
        if ($that.setTransition.type == "fade")
            $("#opacity").removeClass("hide");
        else if ($that.setTransition.type == "move")
            $("#movement").removeClass("hide");
        else if ($that.setTransition.type == "size")
            $("#size").removeClass("hide");
        else if ($that.setTransition.type == "all")
            $("#custom").removeClass("hide");
        $that.setTransition.phase++;
    } else if ($that.setTransition.phase == 2) {
        if ($that.setTransition.type == 'fade') {
            var opacity = $("#opacity-value").val().trim();
            $that.setTransition.value = opacity;
            $that.setTransition.phase++;
            $("#opacity").addClass("hide");
            $("#d-set-next-t_task").attr('src', 'images/circle-checkmark.png');
            $("#mode").removeClass("hide");
        } else if ($that.setTransition.type == 'move') {
            if ($that.setTransition.value == "undefined") {
                var distance = $("#movement-value").val().trim();
                $that.setTransition.value = distance;
                $("#movement").addClass("hide");
                $("#direction").removeClass("hide");
            } else {
                var direction = $("#select-direction option:selected").val();
                $that.setTransition.direction = direction;
                $that.setTransition.phase++;
                $("#direction").addClass("hide");
                $("#d-set-next-t_task").attr('src', 'images/circle-checkmark.png');
                $("#mode").removeClass("hide");
            }

        } else if ($that.setTransition.type == 'size') {
            var size = $("#size-value").val().trim();
            $that.setTransition.value = size;
            $that.setTransition.property = "width";
            $that.setTransition.phase++;
            $("#size").addClass("hide");
            $("#d-set-next-t_task").attr('src', 'images/circle-checkmark.png');
            $("#mode").removeClass("hide");

        } else if ($that.setTransition.type == 'all') {
            if ($that.setTransition.property == "undefined") {
                var custom = $("#custom-name").val().trim().split(',,');
				if(!custom) return alert("please enter property name");
                $that.setTransition.property = custom;
                $("#custom").addClass("hide");
                $("#value").removeClass("hide");
            } else {
                var value = $("#custom-value").val().trim().split(',,');
				if(!value) return alert("please enter property value");
                $that.setTransition.value = value;
                $that.setTransition.phase++;
                $("#value").addClass("hide");
                $("#d-set-next-t_task").attr('src', 'images/circle-checkmark.png');
                $("#mode").removeClass("hide");
            }
        }
    } else if ($that.setTransition.phase == 3) {
        var mode = $("#transition-mode option:selected").val();
        $that.setTransition.mode = mode;
        Transitions[$that.setTransition.type]($that.$selected, $that.setTransition);
        $that.setTransition.phase++;
        $("#mode").addClass("hide");
    }
    if ($that.setTransition.phase == 4) {
        $that.setInitial();
    }
	function removeTransitions(element) {
		Transitions["none"](element);
		$that.setInitial();
		alert("Transitions Removed");
	}	
}

Transitions['constructor'].prototype.editOptions = function(e){
	e.preventDefault();
	var $this = $(e.target);
    var prev = $this.prev();
    prev.prop('disabled', false);
}

Transitions['constructor'].prototype.setInitial = function(){
		var $that = this;
		var setTransition = $that.setTransition;
		for (var key in setTransition) {
			if (setTransition.hasOwnProperty(key)) {
				if (key == "phase") continue;
				setTransition[key] = "undefined";
			}
		}
		setTransition.phase = 0;
		$("#transitions").addClass("hide");
		$("#task-list > li").each(function(){ if(this.id == "t_type") $(this).removeClass("hide"); else $(this).addClass("hide")});
		$("#d-set-next-t_task").attr('src', 'images/arrow-right.png');
		$("#select-transition option:eq(0)").prop('selected', 'selected');
		$(".d-set-edit-icon").prev().prop('disabled', true);
		$("#duration-transition").val(350);
		$("#opacity-value").val(0);
		$("#movement-value").val('');
		$("#size-value").val(0);
		$("#custom-name").val('');
		$("#custom-value").val('');
		$("#direction option:eq(0)").prop('selected', 'selected');
		$("#transition-mode option:eq(0)").prop('selected', 'selected');
}

function createNewStyle()
{
	var style = document.createElement("style");
	style.setAttribute('id','d-set-stylesheet');
	style.appendChild(document.createTextNode(""));
	document.head.appendChild(style);
}
function removeIfExists(class_name)
{
	var styleTag = document.getElementById("d-set-stylesheet");
	var styleRef = styleTag.sheet ? styleTag.sheet : styleTag.styleSheet;
	var len = styleRef.cssRules ? styleRef.cssRules.length : styleRef.rules.length;
	if(styleRef.cssRules){ //all browsers except IE 9-
		for(i=len;i>0;i--)
		{
				if (styleRef.cssRules[i-1].selectorText === "." + class_name+":hover" ||styleRef.cssRules[i-1].selectorText === "." + class_name )
				styleRef.deleteRule(i-1);
		}
	}
	else{
		var i;
		for(i=len;i>0;i--)
		{
				if(styleRef.rules[i-1].selectorText === "."+class_name+":hover" ||styleRef.rules[i-1].selectorText === "."+class_name)
				styleRef.removeRule(i-1);
		}
	}
	return styleRef;	
}

function setNewClass(element,class_name,classSelector,styleObject,type,direction)
{
	if(typeof type === 'undefined') type = "all";
	if(typeof direction === 'undefined') direction = "left";
	var stylesheet = removeIfExists(class_name);
	if(element.data('hover-class') == null)
		element.data('hover-class',class_name);
	var count=0,j,i,k,len= styleObject.t_name.length;
	var browser_prefix = ['-webkit-','-o-','-moz-',''];
	var style= [];
	var property = [{"append":":hover"},{"append":""}];
	for(j=0; j<2;j++)
	{	
		style.push({});
		style[j].sheet = stylesheet;
		style[j].selector = class_name;
		style[j].type = classSelector;
		style[j].property = property[j]["append"];
		style[j].style = "";
	}	
	for(k in styleObject.t_name)
	{
		style[0].style += styleObject.t_name[k]+":";
		style[0].style += styleObject.t_value[k]+";";
	}
	for(i=0;i<browser_prefix.length;i++)
	{	
		style[0].style += browser_prefix[i]+styleObject.t_property_name+":";
		style[0].style += styleObject.t_property_value+";";
		style[1].style += browser_prefix[i]+styleObject.t_property_name+":"+styleObject.t_property_value+";";
	}	
	if(type == "move")
		style[1].style += direction+":0;";
	
	addCSSRule(style);
}

function addCSSRule(styleSheet) {
	var i;
	for(i=0;i<styleSheet.length;i++)
		if(styleSheet[i].sheet.insertRule)
		styleSheet[i].sheet.insertRule(styleSheet[i].type+styleSheet[i].selector+styleSheet[i].property+"{"+styleSheet[i].style+"}",styleSheet[i].sheet.cssRules.length);
		else
		styleSheet[i].sheet.addRule(styleSheet[i].type+styleSheet[i].selector+styleSheet[i].property,styleSheet[i].sheet.style,-1);	
}
function getClass(element)
{
	var e_index = element.index;
	var e_tag = element.tagName;
	if(e_index == "undefined") return;
	var class_name = "e-set-"+e_tag+"-"+e_index;
	return class_name;
}

function getElementClass(element)
{
	var e_index = element.index;
	var e_tag = element.tagName;
	if(e_index == "undefined") return false;
	var class_name = "e-set-"+"element-"+e_tag+"-"+e_index;
	return class_name;
}

function addNewClass(element)
{
	var new_class = getElementClass(element);
	if(new_class && !element.element.hasClass(new_class))
	{
		element.element[0].classList.add(new_class);
	}
	return new_class;
}

function createControlElements()
{
	var html = '<div class="d-set transition-container hide" id="transitions">\
			<ul class="d-set" id="task-list">\
				<li class="d-set" id="t_type">\
					<header class="d-set">Select The Transition Type</header>\
					<select class="d-set form-control" id="select-transition">\
						<option value="none">none</option>\
						<option value="all">All</option>\
						<option value="fade">Fade</option>\
						<option value="move">Move</option>\
						<option value="size">Size</option>\
					</select>\
				</li>\
				<li class="d-set hide" id="duration">\
					<header class="d-set">Enter Transition Duration(in ms)</header>\
					<input type="number" min="0" value="350" placeholder="1second = 1000ms" class="d-set form-control" id="duration-transition" title="do next if you want auto value" disabled/>\
					<i class="d-set fa fa-fw fa-edit d-set-edit-icon"></i>\
				</li>\
				<li class="d-set hide" id="opacity">\
					<header class="d-set" title="enter after transition opacity">Enter Opacity</header>\
					<input type="number" min="0" max="10" class="d-set form-control" value="0" placeholder="ex:7" title="do next if you want auto value" id="opacity-value" disabled/>\
					<i class="d-set fa fa-fw fa-edit d-set-edit-icon"></i>\
				</li>\
				<li class="d-set hide" id="size">\
					<header class="d-set" title="enter after transition width">Enter Width(in px)</header>\
					<input type="number" min="0" class="d-set form-control" placeholder="ex:80" value="0" title="do next if you want auto value" id="size-value" disabled/>\
					<i class="d-set fa fa-fw fa-edit d-set-edit-icon"></i>\
				</li>\
				<li class="d-set hide" id="movement">\
					<header class="d-set" title="enter after transition move distance">Enter Distance(in px)</header>\
					<input type="number" class="d-set form-control" placeholder="ex:200" id="movement-value" required/>\
				</li>\
				<li class="d-set hide" id="custom">\
					<header class="d-set" title="define transition name">Enter Custom Transition</header>\
					<input type="text" placeholder="ex:background-color" class="d-set form-control" title="Enter custom transition property" id="custom-name" required/>\
				</li>\
				<li class="d-set hide" id="value">\
					<header class="d-set" title="define transition value">Enter Custom Transition Value</header>\
					<input type="text" placeholder="ex:red" class="d-set form-control" title="Enter custom transition property value should be in effect after transition applied" id="custom-value" required/>\
				</li>\
				<li class="d-set hide" id="direction">\
					<header class="d-set" title="select after transition direction">Select Direction</header>\
					<select class="d-set form-control" id="select-direction">\
						<option value="left">Left</option>\
						<option value="right">Right</option>\
					</select>\
				</li>\
				<li class="d-set hide" id="mode">\
					<header class="d-set" title="select transition mode">Select Transition Mode</header>\
					<select class="d-set form-control" id="transition-mode">\
						<option value="auto">Auto</option>\
						<option value="linear">Linear</option>\
						<option value="ease">Ease</option>\
					</select>\
				</li>\
			</ul>\
			<div class="d-set button">\
				<img class="d-set circle-img" src="images/arrow-right.png" id="d-set-next-t_task"/>\
			</div>';
			$('body').append(html);
			if($.fn.settings.modalCreated == 0)
			createSourceModal();
}

function createSourceModal()
{
	var modal = '<div id="source-container" class="modal fade d-set" role="dialog">\
		  <div class="modal-dialog d-set">\
			<div class="modal-content d-set">\
			  <div class="modal-header d-set">\
				<button type="button" class="close d-set" data-dismiss="modal">&times;</button>\
				<h4 class="modal-title d-set">CSS Styles</h4>\
			  </div>\
			  <div class="modal-body d-set">\
				<pre class="d-set"></pre>\
			  </div>\
			  <div class="modal-footer d-set">\
				<button type="button" class="btn btn-default d-set" data-dismiss="modal">Close</button>\
			  </div>\
			</div>\
		</div>\
		</div>';
		$('body').append(modal);
	 $.fn.settings.modalCreated = 1;
}

})(jQuery,window);

/* ========================================================================
 * COLORIFY: jQuery.colorify.js v1.0.0
 * ========================================================================
 * Copyright 2017 Hetrotech Private Limited.
 * Licensed under MIT
 * ======================================================================== */


 
+(function($,window){
	'use strict';

var Colorify = function(options) {
	createControlElements();
	this.keys = $.extend({},$.fn.colorify.defaults,options);
	this.previous;
	var $that = this;
	this.$selected = {
		element: 'undefined',
		fontScale: 'px',
		tagName: 'undefined',
		fontWeight: 'normal',
		fontSize: 'inherit',
		font: {
			'37': function() {
				var spacing = parseInt($that.$selected.element.css('letter-spacing'));
				if (spacing > 0)
					$that.$selected.element.css('letter-spacing', spacing - 1 + $that.$selected.fontScale);
				else return alert("Min range 0 reached");
			},
			'39': function() {
				var spacing = parseInt($that.$selected.element.css('letter-spacing'));
				if (spacing < 100)
					$that.$selected.element.css('letter-spacing', spacing + 1 + $that.$selected.fontScale);
				else return alert("Max range 100 reached");
			},
			'38': function() {
				$that.$selected.fontSize = parseInt($that.$selected.element.css('font-size'));
				$that.$selected.element.css('font-size', $that.$selected.fontSize + 1 + $that.$selected.fontScale);
			},
			'40': function() {
				$that.$selected.fontSize = parseInt($that.$selected.element.css('font-size'));
				$that.$selected.element.css('font-size', $that.$selected.fontSize - 1 + $that.$selected.fontScale);
			}
		},
		bold: function() {
			$that.$selected.fontWeight = $that.$selected.element.css('font-weight');
			($that.$selected.fontWeight == 'bold') ? $that.$selected.element.css('font-weight', 'normal'): $that.$selected.element.css('font-weight', 'bold');
		}
	};
	$(window).on('click',$.proxy(this.onColorSelect,this)).off('keydown',$.fn.settings.onKeyDown).on('keydown',$.proxy($.fn.settings.onKeyDown,this)).on('keydown',$.proxy($.fn.settings.onColorKeyDown,this));
	$('.color>div').on('click',$.proxy(this.pickColor,this));
	$("#set-color").on('input',$.proxy(this.setColor,this));
	$.fn.settings.commands['common']();
	$.fn.settings.commands['colorify']();
}

Colorify.VERSION = "1.0.0";
Colorify.pluginName = "Colorify";
Colorify.AUTHOR = "Sagar Dewani";
Colorify.WEBSITE = "http://www.hetrotech.in/";

function reg_colorify(options) {
    new Colorify(options);
}
//defining jQuery namespace colorify
$.fn.colorify = function(options) {
    return reg_colorify(options);
};

window.$.colorify = $.fn.colorify;

var settings = {
	disableSelect: [$("body"), $("#wrapper"), $("html"), $("option")],
	defSetting :{
		colorify: 0,
		bgcolor:0,
		fgcolor:0,
		font:0
	},
	modalCreated:0,
	hexDigits : new Array("0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "a", "b", "c", "d", "e", "f"),
	commands:{
		'common': function(){
			var keyCode = ['alt+shift+ctrl','ctrl+m','ENTER'];
			var keyUse = ['to go back to normal mode','to check which mode is active','to view the source generated'];
			var i,html;
			for(i=0;i<keyCode.length;i++)
			{
				html = "<li class='d-set'><pre class='d-set'><code class='d-set'><i class='d-set'>"+keyCode[i]+"</i> : "+keyUse[i]+"</code></pre></li>";
				$('#cmdList').append(html);
			}
		},
		'colorify':function(){
			var keyCode = ['shift+c','shift+b','shift+f','shift+t','ctrl+b','&larr;','&rarr;','&uarr;','&darr;'];
			var keyUse = ['to (de)activate hover colorify mode','to (de)activate background mode','to (de)activate foreground mode','to (de)activate font mode','to apply or remove bold effect on text element','decrease letter spacing','increase letter spacing','decrease font size','increase font size'];
			var i,html;
			for(i=0;i<keyCode.length;i++)
			{
				html = "<li class='d-set'><pre class='d-set'><code class='d-set'><i class='d-set'>"+keyCode[i]+"</i> : "+keyUse[i]+"</code></pre></li>";
				$('#cmdList').append(html);
			}
		},
		created:0
	},
	onKeyDown: function(e){
		var $that = this;
		if ($that.$selected.element !== 'undefined')
		{
			if (e.shiftKey && e.ctrlKey && e.altKey){
				for (var key in $.fn.settings.defSetting) {
					if ($.fn.settings.defSetting.hasOwnProperty(key))
						$.fn.settings.defSetting[key] = 0;
				}
			}
			if (e.ctrlKey && e.which == $that.keys.modeKey) {
				var mode = "normal";
				for (var key in $.fn.settings.defSetting) {
					if ($.fn.settings.defSetting.hasOwnProperty(key))
						if ($.fn.settings.defSetting[key] == 1) 
						mode = key;
				}
				alert("Activated Mode: " + mode);
			}
			if (e.which == $that.keys.sourceKey) {
				if($.fn.settings.defSetting.transition){
					$(".modal-body>pre").empty();
					var sheet;
					var styleSheets = $("style#d-set-stylesheet")[0].sheet ? $("style#d-set-stylesheet")[0].sheet : $("style#d-set-stylesheet")[0].styleSheet;
					var styleSheetRules = styleSheets.rules ? styleSheets.rules : styleSheets.cssRules;
					var len = styleSheetRules.length ? styleSheetRules.length : styleSheetRules.length;
					var targetClass = $that.$selected.element.attr('class').split(' ');
					var i;
					var selectorText;
					for(i=0;i<len;i++)
					{
						selectorText = styleSheetRules[i].selectorText.replace('.','');
						if(targetClass.indexOf(selectorText) > -1)
							$(".modal-body>pre").append("<code class=d-set style='background-color:#7fdfde;'>"+styleSheetRules[i].cssText+"</code><br/>");
						else
						$(".modal-body>pre").append("<code class=d-set>"+styleSheetRules[i].cssText+"</code><br/>");
					}
					$("#source-container").modal('show');
				}
				else if($.fn.settings.defSetting.colorify || $.fn.settings.defSetting.reposizing){
					$(".modal-body>pre").empty();
					$(".modal-body>pre").append("<code class=d-set>"+$that.$selected.element.attr('style')+"</code><br/>");
					$("#source-container").modal('show');
				}
			}
			//old.apply(this,arguments);
		}
		if(e.altKey && e.which == '72')
		{
			$("#cmdListContainer").toggleClass('hide');
		}
	},
	onColorKeyDown: function(e){
		var $that = this;
		if ($that.$selected.element !== 'undefined')
		{
			if (e.shiftKey && e.which == $that.keys.colorifyKey)
			{
				for (var key in $.fn.settings.defSetting) {
					if ($.fn.settings.defSetting.hasOwnProperty(key))
						if ($.fn.settings.defSetting.colorify) continue; //this line is just a mistake. However, it works as intended because logic behinde it is correct :p
							$.fn.settings.defSetting[key] = 0;
				}
				$.fn.settings.defSetting.colorify = ($.fn.settings.defSetting.colorify == 0) ? 1 : 0;
			}
			if($.fn.settings.defSetting.colorify)
			{
				//shift+b
				if (e.shiftKey && e.which == '66') {
					$.fn.settings.defSetting.fgcolor = 0;
					$.fn.settings.defSetting.font = 0;
					$.fn.settings.defSetting.bgcolor = ($.fn.settings.defSetting.bgcolor == 0) ? 1 : 0;
				}
				//shift+f
				if (e.shiftKey && e.which == '70') {
					$.fn.settings.defSetting.bgcolor = 0;
					$.fn.settings.defSetting.font = 0;
					$.fn.settings.defSetting.fgcolor = ($.fn.settings.defSetting.fgcolor == 0) ? 1 : 0;
				}
				//shift+t
				if (e.shiftKey && e.which == '84') {			
					$.fn.settings.defSetting.bgcolor = 0;
					$.fn.settings.defSetting.fgcolor = 0;
					$.fn.settings.defSetting.font = ($.fn.settings.defSetting.font == 0) ? 1 : 0;
				}
				//ctrl+b
				if (e.ctrlKey && e.which == '66'){
					if($.fn.settings.defSetting.font)
					{
						$that.$selected.bold();
					}
					else
					{
						alert("Please Turn ON the font mode, using shift+t\nTo apply text formatting effects.")
					}
				}
				if (e.which == '39' || e.which == '37' || e.which == '38' || e.which == '40')
				{
					if($.fn.settings.defSetting.font)
					{
						$that.$selected.font[e.which]();
					}
				}		
			}	
			//old.apply(this,arguments);
		}
	}
}

$.fn.colorify.defaults = {
	colorifyKey:'67',//shift+c
	sourceKey:'13',
	modeKey:'77'
};

$.fn.settings = $.extend(true,{}, $.fn.settings|| {},settings);

Colorify.prototype.onColorSelect = function(e){	
	var $that = this;
	var disable = $.fn.settings.disableSelect;
	var len = disable.length,i;
	for(i=0;i<len;i++)
	{
		if($(e.target).is(disable[i]))return;
	}		
	if($(e.target).is('[class*="d-set"]')) return;
	$that.$selected.element = $(e.target);
	$that.$selected.fontSize = $that.$selected.element != 'undefined' ? (($that.$selected.element.css('font-size') == 'inherit') ? 'inherit' : $that.$selected.element.css('font-size')) : 'initial';
	$that.$selected.fontWeight = $that.$selected.element != 'undefined' ? (($that.$selected.element.css('font-weight') == 'bold') ? 'bold' : 'normal') : 'normal';
	$that.$selected.tagName = $that.$selected.element != 'undefined' ? $that.$selected.element[0].tagName.toLowerCase() : 'undefined';

    //if item is selected and stored in object then
    //check if previous element is set then check if previous element has border-blue class
    //then remove border blue class from previous element.

    if ($that.$selected.element) {
        if ($that.previous && $that.previous.hasClass('border-blue')) {
            $that.previous.removeClass('border-blue');
        }
		$that.previous = $that.$selected.element;
        $that.previous.addClass('border-blue');
	}
}

Colorify.prototype.pickColor = function(e) {
	var $that = this;
    if ($.fn.settings.defSetting.bgcolor) {
        var value = rgb2hex($(e.target).css('background-color'));
        $("#set-color").val(value);
        $that.previous.css('background-color', value);
    } else if ($.fn.settings.defSetting.fgcolor) {
        var value = rgb2hex($(e.target).css('background-color'));
        $("#set-color").val(value);
        $that.previous.css('color', value);
    } else {
        alert("Please press shift + b\nTo Set background color\nPress shift + f\nTo Set Foreground Color");
    }
}
Colorify.prototype.setColor = function(e){
	var $that = this;
	var input = $("#set-color");
    if ($that.$selected.element !== 'undefined' && $.fn.settings.defSetting.bgcolor == 1) $that.previous.css('background-color', input.val());
    else if ($that.$selected.element !== 'undefined' && $.fn.settings.defSetting.fgcolor == 1) $that.previous.css('color', input.val());
    else alert("No element selected\n please select the element first\n or if you have selected the item\nThen select foreground or background mode\nPress shift+b : background mode\nPress shift+f : foreground mode");	
}

//Change the color from RGB to HEX format
//adopted from internet sources like stackoverflow.com
//thanks for this contributions of them.	
function rgb2hex(rgb) {
    rgb = rgb.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/);
    return "#" + hex(rgb[1]) + hex(rgb[2]) + hex(rgb[3]);
}
function hex(x) {
	var hexDigits = $.fn.settings.hexDigits;
    return isNaN(x) ? "00" : hexDigits[(x - x % 16) / 16] + hexDigits[x % 16];
}

function createControlElements()
{
	var html = '<div class="d-set color-container" id="color">\
			<div class="d-set color"><div class="d-set pointer color-1"></div></div>\
			<div class="d-set color"><div class="d-set pointer color-2"></div></div>\
			<div class="d-set color"><div class="d-set pointer color-3"></div></div>\
			<div class="d-set color"><div class="d-set pointer color-4"></div></div>\
			<div class="d-set color"><div class="d-set pointer color-5"></div></div>\
			<div class="d-set color"><div class="d-set pointer color-6"></div></div>\
			<div class="d-set color"><div class="d-set pointer color-7"></div></div>\
			<div class="d-set color"><div class="d-set pointer color-8"></div></div>\
			<div class="d-set color"><div class="d-set pointer color-9"></div></div>\
			<div class="d-set color"><div class="d-set pointer color-10"></div></div>\
			<div class="d-set color"><input title="enter custom color" type="text" placeholder="#fe211c"class="d-set set-color form-control" id="set-color"/></div>\
		</div>';
	$('body').prepend(html);
	if($.fn.settings.modalCreated == 0)
	createSourceModal();
}

function createSourceModal()
{
	var modal = '<div id="source-container" class="modal fade d-set" role="dialog">\
		  <div class="modal-dialog d-set">\
			<div class="modal-content d-set">\
			  <div class="modal-header d-set">\
				<button type="button" class="close d-set" data-dismiss="modal">&times;</button>\
				<h4 class="modal-title d-set">CSS Styles</h4>\
			  </div>\
			  <div class="modal-body d-set">\
				<pre class="d-set"></pre>\
			  </div>\
			  <div class="modal-footer d-set">\
				<button type="button" class="btn btn-default d-set" data-dismiss="modal">Close</button>\
			  </div>\
			</div>\
		</div>\
		</div>';
		$('body').append(modal);
	 $.fn.settings.modalCreated = 1;
}
})(jQuery,window);

/* ========================================================================
 * Reposizing: jQuery.reposizing.js v1.0.0
 * ========================================================================
 * Copyright 2017 Hetrotech Private Limited.
 * Licensed under MIT
 * ======================================================================== */


 
+(function($,window){
	'use strict';
//Reposizing Class To Handle Drop Events on Elements
//Using Drag and Drop Functionality

var body = {};

var Reposizing = function(options) {
	body.w = $("body").width();
	body.h = $("body").height();
	body.center = {
		x: body.w / 2,
		y: body.h / 2
	};	
	createNewStyle();
	createControlElements();
	this.keys = $.extend({},$.fn.reposizing.defaults,options);
	this.previous;
	var $that = this;
	this.$selected = {
		element: 'undefined',
		width: 'undefined',
		height: 'undefined',
		left: 'undefined',
		top: 'undefined',
		scale: 'px',
		tagName:'undefined',
		drag: 'undefined',
		position: 'undefined',
		maxWidth: 'undefined',
		minWidth: 'undefined',
		maxHeight: 'undefined',
		minHeight: 'undefined',
		inside: 'undefined',
		index: 'undefined',
		class:'undefined',
		keydown: {
			'37': function() {
				$that.$selected.width = $that.$selected.element.width();
				if ($that.$selected.width > 1) $that.$selected.element.width($that.$selected.width - 1);
			},
			'39': function() {
				$that.$selected.width = $that.$selected.element.width();
				if ($that.$selected.width < body.w) $that.$selected.element.width($that.$selected.width + 1);
			},
			'38': function() {
				$that.$selected.height = $that.$selected.element.height();
				if ($that.$selected.height > 1) $that.$selected.element.height($that.$selected.height - 1);
			},
			'40': function() {
				$that.$selected.height = $that.$selected.element.height();
				$that.$selected.element.height($that.$selected.height + 1);
			}
		},
		move: {
			'37': function() {
				if ($that.$selected.position == "relative" || $that.$selected.position == "absolute" || $that.$selected.position == "fixed") {
					$that.$selected.left = $that.$selected.element.position().left;
					$that.$selected.element.css('left', $that.$selected.left - 1 + $that.$selected.scale);
				} else {
					$that.$selected.left = parseInt($that.$selected.element.css('margin-left'));
					$that.$selected.element.css('margin-left', $that.$selected.left - 1 + $that.$selected.scale);
				}
			},
			'39': function() {
				if ($that.$selected.position == "relative" || $that.$selected.position == "absolute" || $that.$selected.position == "fixed") {
					$that.$selected.left = $that.$selected.element.position().left;
					$that.$selected.element.css('left', $that.$selected.left + 1 + $that.$selected.scale);
				} else {
					$that.$selected.left = parseInt($that.$selected.element.css('margin-left'));
					$that.$selected.element.css('margin-left', $that.$selected.left + 1 + $that.$selected.scale);
				}
			},
			'38': function() {
				if ($that.$selected.position == "relative" || $that.$selected.position == "absolute" || $that.$selected.position == "fixed") {
					$that.$selected.top = $that.$selected.element.position().top;
					$that.$selected.element.css('top', $that.$selected.top - 1 + $that.$selected.scale);
				} else {
					$that.$selected.top = parseInt($that.$selected.element.css('margin-top'));
					$that.$selected.element.css('margin-top', $that.$selected.top - 1 + $that.$selected.scale);
				}
			},
			'40': function() {
				if ($that.$selected.position == "relative" || $that.$selected.position == "absolute" || $that.$selected.position == "fixed") {
					$that.$selected.top = $that.$selected.element.position().top;
					$that.$selected.element.css('top', $that.$selected.top + 1 + $that.$selected.scale);
				} else {
					$that.$selected.top = parseInt($that.$selected.element.css('margin-top'));
					$that.$selected.element.css('margin-top', $that.$selected.top + 1 + $that.$selected.scale);
				}
			}
		}		
	};
	$(window).on('click',$.proxy(this.onSelect,this)).off('keydown',$.fn.settings.onKeyDown).on('keydown',$.proxy($.fn.settings.onKeyDown,this)).on('keydown',$.proxy($.fn.settings.onRepoKeyDown,this));
	$('#set-save').on('click',$.proxy(this.onSave,this));
	$.fn.settings.commands['common']();
	$.fn.settings.commands['reposizing']();
}

Reposizing.VERSION = "1.0.0";
Reposizing.pluginName = "REPOSIZING";
Reposizing.AUTHOR = "Sagar Dewani";
Reposizing.WEBSITE = "http://www.hetrotech.in/";

function reg_reposizing(options) {
    new Reposizing(options);
}
//defining jQuery namespace reposizing
$.fn.reposizing = function(options) {
    return reg_reposizing(options);
};

window.$.reposizing = $.fn.reposizing;

var settings = {
	disableSelect: [$("body"), $("#wrapper"), $("html"), $("option")],
	defSetting :{
		reposizing: 0,
		draggable:0,
		position:0
	},
	count:0,
	modalCreated:0,
	commands:{
		'common': function(){
			var keyCode = ['alt+shift+ctrl','ctrl+m','ENTER'];
			var keyUse = ['to go back to normal mode','to check which mode is active','to view the source generated'];
			var i,html;
			for(i=0;i<keyCode.length;i++)
			{
				html = "<li class='d-set'><pre class='d-set'><code class='d-set'><i class='d-set'>"+keyCode[i]+"</i> : "+keyUse[i]+"</code></pre></li>";
				$('#cmdList').append(html);
			}
		},
		'reposizing':function(){
			var keyCode = ['shift+r','shift+d','shift+p','&larr;','&rarr;','&uarr;','&darr;'];
			var keyUse = ['to (de)activate hover reposizing mode','to (de)activate draggable mode','to (de)activate position mode','to decrease element width or to move element left','to increase element width or to move element right ','to decrease element height or to move element up','to increase element height or to move element down'];
			var i,html;
			for(i=0;i<keyCode.length;i++)
			{
				html = "<li class='d-set'><pre class='d-set'><code class='d-set'><i class='d-set'>"+keyCode[i]+"</i> : "+keyUse[i]+"</code></pre></li>";
				$('#cmdList').append(html);
			}
		},
		created:0
	},
	onKeyDown: function(e){
		var $that = this;
		if ($that.$selected.element !== 'undefined')
		{
			if (e.shiftKey && e.ctrlKey && e.altKey){
				for (var key in $.fn.settings.defSetting) {
					if ($.fn.settings.defSetting.hasOwnProperty(key))
						$.fn.settings.defSetting[key] = 0;
				}
			}
			if (e.ctrlKey && e.which == $that.keys.modeKey) {
				var mode = "normal";
				for (var key in $.fn.settings.defSetting) {
					if ($.fn.settings.defSetting.hasOwnProperty(key))
						if ($.fn.settings.defSetting[key] == 1) 
						mode = key;
				}
				alert("Activated Mode: " + mode);
			}
			if (e.which == $that.keys.sourceKey) {
				if($.fn.settings.defSetting.transition){
					$(".modal-body>pre").empty();
					var sheet;
					var styleSheets = $("style#d-set-stylesheet")[0].sheet ? $("style#d-set-stylesheet")[0].sheet : $("style#d-set-stylesheet")[0].styleSheet;
					var styleSheetRules = styleSheets.rules ? styleSheets.rules : styleSheets.cssRules;
					var len = styleSheetRules.length ? styleSheetRules.length : styleSheetRules.length;
					var targetClass = $that.$selected.element.attr('class').split(' ');
					var i;
					var selectorText;
					for(i=0;i<len;i++)
					{
						selectorText = styleSheetRules[i].selectorText.replace('.','');
						if(targetClass.indexOf(selectorText) > -1)
							$(".modal-body>pre").append("<code class=d-set style='background-color:#7fdfde;'>"+styleSheetRules[i].cssText+"</code><br/>");
						else
						$(".modal-body>pre").append("<code class=d-set>"+styleSheetRules[i].cssText+"</code><br/>");
					}
					$("#source-container").modal('show');
				}
				else if($.fn.settings.defSetting.colorify || $.fn.settings.defSetting.reposizing){
					$(".modal-body>pre").empty();
					$(".modal-body>pre").append("<code class=d-set>"+$that.$selected.element.attr('style')+"</code><br/>");
					$("#source-container").modal('show');
				}
			}
			//old.apply(this,arguments);
		}
		if(e.altKey && e.which == '72')
		{
			$("#cmdListContainer").toggleClass('hide');
		}
	},
	onRepoKeyDown: function(e){
		var $that = this;
		if ($that.$selected.element !== 'undefined')
		{
			if (e.shiftKey && e.which == $that.keys.reposizingKey)
			{
				for (var key in $.fn.settings.defSetting) {
					if ($.fn.settings.defSetting.hasOwnProperty(key))
						if ($.fn.settings.defSetting.reposizing) continue;
							$.fn.settings.defSetting[key] = 0;
				}
				$.fn.settings.defSetting.reposizing = ($.fn.settings.defSetting.reposizing == 0) ? 1 :0;
			}
			if($.fn.settings.defSetting.reposizing)
			{
				if (e.shiftKey && e.which == '68'){
					$.fn.settings.defSetting.position =0;
					$.fn.settings.defSetting.draggable = ($.fn.settings.defSetting.draggable == 0) ? 1:0;
				}
				if (e.shiftKey && e.which == '80'){
					$.fn.settings.defSetting.draggable =0;
					$.fn.settings.defSetting.position = ($.fn.settings.defSetting.position == 0) ? 1:0;
				}
				if (e.which == '39' || e.which == '37' || e.which == '38' || e.which == '40')
				{
					if($.fn.settings.defSetting.position)
					{
						$that.$selected.move[e.which]();
					}
					else
					{
						$that.$selected.keydown[e.which]();
					}
				}
				if (e.shiftKey && e.altKey && e.which == '83'){
					$that.$selected.scale = $that.$selected.scale == 'px' ? '%' : 'px';
				}
				//beautifyElement function
				/*if(e.ctrlKey && e.which == '66')
				{
					beautifyElement($that.$selected);
				}
				*/
			}
			
			//old.apply(this,arguments);
		}
	}
}

$.fn.settings = $.extend(true,{}, $.fn.settings|| {},settings);

$.fn.reposizing.defaults = {
	reposizingKey:'82',
	modeKey:'77',
	sourceKey:'13'
};

Reposizing.prototype.onSelect = function(e){
	var $that = this;
	var disable = $.fn.settings.disableSelect;
	var len = disable.length,i;
	for(i=0;i<len;i++)
	{
		if($(e.target).is(disable[i]))return;
	}		
	if($(e.target).is('[class*="d-set"]')) return;
	if ($that.previous && $that.$selected.drag != "off" && $that.previous.hasClass('ui-draggable')) $that.previous.draggable("destroy");
	$that.$selected.element = $(e.target);
	//if(previous){var clonenode = previous.clone(false); previous.replaceWith(clonenode);}
	//updating the min/maxWidth or min/maxHeight and details of element
	//if it is not set then update as 'undefined' or initial values
	//else set to its value
	$that.$selected.maxWidth = $that.$selected.element != 'undefined' ? ($that.$selected.element.css('maxWidth') == 'none' ? 'undefined' : $that.$selected.element.css('maxWidth')) : 'undefined';
	$that.$selected.minWidth = $that.$selected.element != 'undefined' ? ($that.$selected.element.css('minWidth') == '0px' ? 'undefined' : $that.$selected.element.css('minWidth')) : 'undefined';
	$that.$selected.maxHeight = $that.$selected.element != 'undefined' ? ($that.$selected.element.css('maxHeight') == 'none' ? 'undefined' : $that.$selected.element.css('maxHeight')) : 'undefined';
	$that.$selected.minHeight = $that.$selected.element != 'undefined' ? ($that.$selected.element.css('minHeight') == '0px' ? 'undefined' : $that.$selected.element.css('minHeight')) : 'undefined';
	$that.$selected.height = $that.$selected.element != 'undefined' ? ($that.$selected.element.css('height') == '0px' ? 'undefined' : $that.$selected.element.css('height')) : 'undefined';
	$that.$selected.width = $that.$selected.element != 'undefined' ? ($that.$selected.element.css('width') == 'none' ? 'undefined' : $that.$selected.element.css('width')) : 'undefined';
	$that.$selected.position = $that.$selected.element != 'undefined' ? ($that.$selected.element.css('position') == 'static' ? 'static' : $that.$selected.element.css('position')) : 'undefined';
	$that.$selected.left = $that.$selected.element != 'undefined' ? (($that.$selected.element.css('position') == 'static') ? changeLeftPosition($that.$selected.element, "static") : changeLeftPosition($that.$selected.element, "other")) : 'undefined';
	$that.$selected.top = $that.$selected.element != 'undefined' ? (($that.$selected.element.css('position') == 'static') ? changeTopPosition($that.$selected.element, "static") : changeTopPosition($that.$selected.element, "other")) : 'undefined';
	$that.$selected.tagName = $that.$selected.element != 'undefined' ? $that.$selected.element[0].tagName.toLowerCase() : 'undefined';
	$that.$selected.drag = $that.$selected.element != 'undefined' ? (($.fn.settings.defSetting.draggable == 1) ? dragMe($that.$selected) : 'off') : 'undefiend';
	$that.$selected.inside = $that.$selected.element != 'undefined' ? isElementInside($that.$selected.element) : 'undefined';
	$that.$selected.index = $that.$selected.element != 'undefined' ? getElementIndex($that.$selected.element) : 'undefined';
	$that.$selected.class = $that.$selected.element != 'undefined' ? addNewClass($that.$selected) : 'undefined';
	//console.log($that.$selected);
	//if item is selected and stored in object then
	//check if previous element is set then check if previous element has border-blue class
	//then remove border blue class from previous element.
	if ($that.$selected.element) {
		if ($that.previous && $that.previous.hasClass('border-blue')) {
			$that.previous.removeClass('border-blue');
		}
		$that.previous = $that.$selected.element;
		$that.previous.addClass('border-blue');
	}
}

//To change/set element Left Position based on its position property
//Argument: any element and position property
function changeLeftPosition(element, type) {
    switch (type) {
        case "static":
            return element.css('margin-left') == '0px' ? 0 : element.css('margin-left');
        default:
            return element.css('left') == 0 ? 0 : element.css('left');
    }
}

//To change/set element Top Position based on its position property
//Argument: any element and position property
function changeTopPosition(element, type) {
    var isElementMoveable = 1;
    switch (type) {
        case "static":
            return element.css('margin-top') == '0px' ? 0 : element.css('margin-top');
        default:
            return element.css('top') == 0 ? 0 : element.css('top');
    }
}

//To check if element is child element of div element or not
//Argument: element
function isElementInside(element) {
    if (element.parent().is('div'))
        return true;
    else return false;
}
//Core function to make elements responsive
//Working on it to make elements as intended
//If you have suggestion or want to help me
//Contact me via provided methods to make this plugin 
//More usable. I will be thankful to team up with you :)

//To make the elements responsive
//Argument:element
/*
function beautifyElement(element) {
    if (element === 'undefined') return alert("element not selected");
    else if (htmlTagList[element.tagName].data.required) {
        if (element.maxWidth == "undefined" || element.maxHeight == "undefined") return alert("element max Width/Height not defined");
        else if (element.minWidth == "undefined" || element.minHeight == "undefined") return alert("element min Width/Height not defined");
    }
    var eW = [parseInt(element.width), parseInt(element.minWidth), parseInt(element.maxWidth)];
    var mediaWidth = [body.w, 768, 475];
    var x = [mediaWidth[0] / eW[0], mediaWidth[1] / eW[0], mediaWidth[2] / eW[0]];
	var i;
    for (i = 0; i < x.length; i++) {
        if (Math.ceil(x[i]) < 2)
            x[i] = 1;
    }
    var newW = [parseInt(eW[0]) * 100 / Math.max(eW[2], mediaWidth[0]), (parseInt(eW[0]) * 100 / mediaWidth[0]), (parseInt(eW[0]) * 100 / mediaWidth[0])];

	if (Math.ceil(newW[1]) >= 49)
		newW[1] = 100 - 3.25;
	else if (Math.ceil(newW[1]) >= 40)
		newW[1] = 50 - 1.25;
	else
		newW[1] = 33 - 0.75;

	if (Math.ceil(newW[2]) >= 49)
		newW[2] = 100 - 3.25;
	else if (Math.ceil(newW[2]) >= 27)
		newW[2] = 50 - 1.25;
	else
		newW[2] = 33 - 0.75;
        //console.log("eW: " + eW[i], "mediaWidth: " + mediaWidth[i], "x: " + x[i], "newW: " + newW[i]);

    if (element.left != 0) {
        var leftOffset, rightOffset, moveLeftBy, moveRightBy, parentWidth, outerWidth;
        parentWidth = element.element.parent().width();
        outerWidth = element.element.outerWidth();
        leftOffset = parseInt(element.left);
        if (element.inside) {
            rightOffset = parentWidth - (leftOffset + outerWidth);
            moveLeftBy = leftOffset * 100 / parentWidth;
            moveRightBy = rightOffset * 100 / parentWidth;
        } else {
            rightOffset = body.w - (leftOffset + element.element.outerWidth());
            moveLeftBy = leftOffset * 100 / body.w;
            moveRightBy = rightOffset * 100 / body.w;
        }
        if (element.position == "static")
            element.element.css('margin-left', moveLeftBy + '%');
        else
            element.element.css('left', moveLeftBy + '%');
    }
    if (element.top != 0) {
        var topOffset = parseInt(element.top);
        if (element.position == "static")
            element.element.css('margin-top', moveLeftBy + '%');
        else
            element.element.css('top', topOffset + 'px');
    }

    if (newW !== 'NaN') {
 
        var styleTag = document.getElementById("d-set-element-stylesheet");
        var styleRef = styleTag.sheet ? styleTag.sheet : styleTag.styleSheet;
        var style = {};
        var stylesheet = styleRef;
        element.element.css('width', newW[0] + '%');
        style.sheet = stylesheet;
        style.selector = element.class;
        style.type = ".";
        style.mediaType = "screen";
        style.mediaCondition = "max-width:768px";
        style.style = "width:" + newW[1] + "% !important";
        addCSSMediaRule(style);
        style.mediaCondition = "max-width:475px";
        style.style = "width:" + newW[2] + "% !important";
        addCSSMediaRule(style);

    }
}
*/

Reposizing.prototype.onSave = function(e){
    e.preventDefault();
    var w = $('#set_width').val();
    var h = $('#set_height').val();
    var type = $("#type option:selected").val();
	var $that = this;
    var regEx = /^[0-9]*(px|%|em|auto)$/;
    if ($that.$selected.element === "undefined") return alert("no element selected\nSelect element to resize");
    if (!regEx.test(w) || !regEx.test(h)) return alert("please unit must be added (px or % or em)");
    if (w && h && type == "max") {
        $that.previous.css('max-width', w);
        $that.previous.css('max-height', h);
    } else if (w && h && type === 'min') {
        $that.previous.css('min-width', w);
        $that.previous.css('min-height', h);
    } else if (w && h && type === "normal") {
        $that.previous.css('width', w);
        $that.previous.css('height', h);
    }
    $('form#set-form')[0].reset();
}

function createControlElements()
{
	var div = document.createElement('div');
	var form = document.createElement('form');
	var input = [];
	var option = [];
	var i;
	var button = document.createElement('input');
	var select = document.createElement('select');
	var values = ["min","max","normal"];
	var size = ["height","width"];
	div.setAttribute('id','set-div');
	div.setAttribute('class','d-set size-container');
	form.setAttribute('id','set-form');
	form.setAttribute('class','d-set form-horizontal');
	
	for(i=0;i<2;i++)
	{
		input[i] = document.createElement('input');
		input[i].setAttribute('type','text');
		input[i].setAttribute('class','d-set form-control');
		input[i].setAttribute('id','set_'+size[i]);
		input[i].setAttribute('placeholder','Enter '+size[i]+' Here');
		form.append(input[i]);
	}
	
	select.setAttribute('id','type');
	select.setAttribute('class','d-set form-control');
	for(i=0;i<3;i++)
	{
		option[i] = document.createElement('option');
		option[i].setAttribute('class','d-set');
		option[i].value = values[i];
		option[i].innerText = values[i].toUpperCase();
		select.append(option[i]);
	}
	form.append(select);
	
	button.setAttribute('type','button');
	button.setAttribute('id','set-save');
	button.setAttribute('class','d-set btn btn-default btn-danger');
	button.value = "save";
	form.append(button);
	
	$('body').append(div);
	div.append(form);
	if($.fn.settings.modalCreated == 0)
	createSourceModal();
}

function createSourceModal()
{
	var modal = '<div id="source-container" class="modal fade d-set" role="dialog">\
		  <div class="modal-dialog d-set">\
			<div class="modal-content d-set">\
			  <div class="modal-header d-set">\
				<button type="button" class="close d-set" data-dismiss="modal">&times;</button>\
				<h4 class="modal-title d-set">CSS Styles</h4>\
			  </div>\
			  <div class="modal-body d-set">\
				<pre class="d-set"></pre>\
			  </div>\
			  <div class="modal-footer d-set">\
				<button type="button" class="btn btn-default d-set" data-dismiss="modal">Close</button>\
			  </div>\
			</div>\
		</div>\
		</div>';
		$('body').append(modal);
	 $.fn.settings.modalCreated = 1;
}
function createNewStyle()
{
	var style = document.createElement("style");
	style.setAttribute('id','d-set-element-stylesheet');
	style.appendChild(document.createTextNode(""));
	document.head.appendChild(style);
}

//To get the element Index data;
//If not available assign new index data
//Argument : element
function getElementIndex(element,$that) {
    if (element.data('e_index') == null)
        element.data('e_index', ++$.fn.settings.count);
    return element.data('e_index');
}

function dragMe(element) {
	var original_position = element.position;
	var $e = null;
	var dragOn = 0;
	element.element.on('mousedown',function(e){
		e.preventDefault();
		$e = element.element;
		dragOn = 1;
		$e.addClass('dragging');
		var drg_h = $e.outerHeight(),
            drg_w = $e.outerWidth(),
            pos_y = $e.offset().top + drg_h - e.pageY,
            pos_x = $e.offset().left + drg_w - e.pageX,
			eX = e.pageX,
			eY = e.pageY,
			mY = parseInt($e.css('margin-top')),
			mX = parseInt($e.css('margin-left'));
		$(document).on('mousemove',function(e){
			if(dragOn)
			{	
				if(original_position == 'static')
				{
					$e.css('margin-top',e.pageY - eY + mY);
					$e.css('margin-left',e.pageX - eX + mX);
				}
				else
				{
					$e.offset({
						top: e.pageY + pos_y - drg_h,
						left: e.pageX + pos_x - drg_w
					});
				}
			}	
		}).on('mouseup',function(e){
			$(this).off("mousemove");
		});
	}).on('mouseup',function(e){
		if($e) 
		{
			dragOn = 0;
			$e.removeClass('dragging');
			$e = null;
		}
	});
}
function getElementClass(element)
{
	var e_index = element.index;
	var e_tag = element.tagName;
	if(e_index == "undefined") return false;
	var class_name = "e-set-"+"element-"+e_tag+"-"+e_index;
	return class_name;
}

function addNewClass(element)
{
	var new_class = getElementClass(element);
	if(new_class && !element.element.hasClass(new_class))
	{
		element.element[0].classList.add(new_class);
	}
	return new_class;
}

function addCSSMediaRule(styleSheet) {
	if(typeof styleSheet.mediaType == "undefined") styleSheet.mediaType = "all";
	if(styleSheet.sheet.insertRule)
		styleSheet.sheet.insertRule("@media "+styleSheet.mediaType+" and ("+styleSheet.mediaCondition+"){"+styleSheet.type+styleSheet.selector+"{"+styleSheet.style+"}}",styleSheet.sheet.cssRules.length);
	else
		styleSheet.sheet.addRule("@media "+styleSheet.mediaType+" and ("+styleSheet.mediaCondition+")",styleSheet.sheet.addRule(styleSheet.type+styleSheet.selector,styleSheet.sheet.style,-1),-1);	
}
})(jQuery,window);

///D-SET PLUGIN TO DIRECTLY CALL ALL PLUGINS

+(function($,window){
	'use strict';

	//defining jQuery namespace dset 
	$.fn.dset = function(options){
		if (!$('body').data('plugin_dset')){
           $('body').data('plugin_dset', new dset());
        }
	}
	
	window.$.dset = $.fn.dset;
	
	var dset = function(){
		if($.fn.settings.commands.created)
		createCommandsList();
		$.droppable();
		$.hoverTransition();
		$.colorify();
		$.reposizing();
	}
	
	function createCommandsList(){
		var div = document.createElement('div');
		var ul = document.createElement('ul');
		var a = document.createElement('a');
		a.setAttribute('href','javascript:void(0);');
		a.setAttribute('onClick','toggleShow('+div+')');
		a.setAttribute('class','pull-right');
		div.setAttribute('id','cmdListContainer');
		div.setAttribute('class','d-set cmdsList style-4 hide');
		ul.setAttribute('id','cmdList');
		ul.innerHTML = "<header>Commands List</header>";
		ul.setAttribute('class','d-set');
		ul.style.background = "#e7e7e7";
		$(div).append(a);
		$(div).append(ul);
		$('body').append(div);
		$.fn.settings.commands.created = 1;
	}
	function toggleShow(el){
		$(element).toggleClass('hide');
	}
	
})(jQuery,window);
	