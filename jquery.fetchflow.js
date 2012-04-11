/*

Fetchflow jQuery plugin
=======================

Copyright (c) 2012 Fetchnotes, LLC

Permission is hereby granted, free of charge, to any person obtaining a
copy of this software and associated documentation files (the
"Software"), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:

The above copyright notice and this permission notice shall be included
in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

*/

// Start editing an element
jQuery.fn.fetchflowEdit = function(options) {

	// Default options
	if (!options) options = {};

	if (typeof options.fromHTML === 'undefined') {
		options.fromHTML = function(html) {
			html = html.replace(/<br>/g, '\n').replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>');
			var lastNewline = html.lastIndexOf('\n');
			if (lastNewline === -1)
				return html;
			return html.substring(0, lastNewline);
		};
	}

	if (typeof options.toHTML === 'undefined') {
		options.toHTML = function(text) {
			text = text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/\n/g, '<br>');
			return text + '<br>';
		};
	}

	// For every element we've selected...
	return this.each(function() {

		// Get me
		var $this = jQuery(this);

		// Start editing if we aren't already
		if ($this.data('focused')) return;
		$this.data('focused', true);

		// Build a textarea and put it on top of me
		var textarea = document.createElement('textarea');
		var $textarea = jQuery(textarea);
		var offset = $this.offset();
		var padding = $this.css('padding-top') + ' ' + $this.css('padding-right') + ' ' + $this.css('padding-bottom') + ' ' + $this.css('padding-left');
		$textarea.css({
			'position': 'absolute',
			'top': offset.top + 1,
			'left': offset.left + 1,
			'margin': '0',
			'padding': padding,
			'border-width': '0',
			'font': $this.css('font'),
			'color': 'inherit',
			'background-color': 'transparent',
			'outline': 'none',
			'resize': 'none',
			'overflow': 'hidden'
		});
		$textarea.val(options.fromHTML($this.html()));
		$textarea.data('div', this);
		$this.data('textarea', textarea);
		document.body.appendChild(textarea);

		// Focus the textarea
		$textarea.trigger('focus');

		// Hide my text
		$this.data('oldColor', $this.css('color'));
		$this.css('color', 'transparent');

		// When I edit, change the HTML
		$textarea.on('keydown keyup', function() {
			var $this = jQuery(this);
			var $div = jQuery($this.data('div'));
			$div.html(options.toHTML($this.val()));
			$this.width($div.width());
			$this.height($div.height());
			var offset = $div.offset();
			$this.css({
				'top': offset.top + 1,
				'left': offset.left + 1
			});
		});

		// Make sure the textarea is the right size
		$textarea.width($this.width());
		$textarea.height($this.height());

	});

};

// Quit editing an element
jQuery.fn.fetchflowUnedit = function() {

	return this.each(function() {

		var $this = jQuery(this);
		var $textarea = jQuery($this.data('textarea'));
		$this.data('focused', false);
		if ($this.data('oldColor'))
			$this.css('color', $this.data('oldColor'));
		if ($textarea)
			$textarea.remove();

	});

};

// Do some simple bindings for edit and unedit
jQuery.fn.fetchflowEditable = function(options) {

	return this.each(function() {

		var $this = jQuery(this);

		$this.on('click', function() {

			// Edit me when I'm clicked...
			$this.fetchflowEdit(options);

			// ...and unedit when you unfocus the textarea.
			$textarea = jQuery($this.data('textarea'));
			$textarea.on('blur', function() {
				var $div = jQuery($(this).data('div'));
				$div.fetchflowUnedit();
			});

		});

	});

};
