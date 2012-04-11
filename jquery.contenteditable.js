/*

Content editable jQuery plugin
==============================

by Fetchnotes LLC

Common Public Attribution License Version 1.0.

"The contents of this file are subject to the Common Public Attribution License
Version 1.0 (the "License"); you may not use this file except in compliance with
the License. You may obtain a copy of the License at
http://www.fetchnotes.com/license. The License is based on the Mozilla Public
License Version 1.1 but Sections 14 and 15 have been added to cover use of
software over a computer network and provide for limited attribution for the
Original Developer. In addition, Exhibit A has been modified to be consistent
with Exhibit B.

Software distributed under the License is distributed on an "AS IS" basis,
WITHOUT WARRANTY OF ANY KIND, either express or implied. See the License for the
specific language governing rights and limitations under the License.

The Original Code is Fetchnotes.
The Original Developer is the Initial Developer.
The Initial Developer of the Original Code is Fetchnotes LLC. All portions of
the code written by Fetchnotes LLC are Copyright (c) 2012 Fetchnotes LLC. All
Rights Reserved.

*/

// Start editing an element
jQuery.fn.contentEdit = function(options) {

	// Default options
	if (!options) options = {};
	if (typeof options.fromHTML === 'undefined') {
		options.fromHTML = function(html) {
			return html.replace(/<br>/g, '\n');
		};
	}
	if (typeof options.toHTML === 'undefined') {
		options.toHTML = function(text) {
			return text.replace(/\n/g, '<br>') + '<br>';
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
		var top = offset.top + parseFloat($this.css('padding-top')) + 1;
		var left = offset.left + parseFloat($this.css('padding-left')) + 1;
		$textarea.css({
			'position': 'absolute',
			'top': top,
			'left': left,
			'margin': '0',
			'padding': '0',
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
		$textarea.on('keyup', function() {
			var $this = jQuery(this);
			var $div = jQuery($this.data('div'));
			$div.html(options.toHTML($this.val()));
			$this.width($div.width());
			$this.height($div.height());
		});

		// Make sure the textarea is the right size
		$textarea.width($this.width());
		$textarea.height($this.height());

	});

};

// Quit editing an element
jQuery.fn.contentUnedit = function() {

	return this.each(function() {

		var $this = jQuery(this);
		var $textarea = jQuery($this.data('textarea'));
		$this.data('focused', false);
		if ($div.data('oldColor'))
			$div.css('color', $div.data('oldColor'));
		$textarea.remove();

	});

};

// Do some simple bindings for edit and unedit
jQuery.fn.contentEditable = function(options) {

	return this.each(function() {

		var $this = jQuery(this);

		$this.on('click', function() {

			// Edit me when I'm clicked...
			$this.contentEdit(options);

			// ...and unedit when you unfocus the textarea.
			$textarea = jQuery($this.data('textarea'));
			$textarea.on('blur', function() {
				var $div = jQuery($this.data('div'));
				$div.contentUnedit();
			});

		});

	});

};
