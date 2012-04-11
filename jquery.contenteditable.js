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

jQuery.fn.contentEditable = function() {

	return this.each(function() {

		// Get me
		var $this = jQuery(this);

		// Make sure I'm not statically positioned so I can position the textarea
		if ($this.css('position') == 'static')
			$this.css('position', 'relative')

		// Okay, when I'm clicked...
		$this.on('click', function() {

			// Start editing if we aren't already
			if ($this.data('focused')) return;
			$this.data('focused', true);

			// Build a textarea and put it on top of me
			var textarea = document.createElement('textarea');
			var $textarea = jQuery(textarea);
			$textarea.css({
				'position': 'absolute',
				'top': $this.css('padding-top'),
				'left': $this.css('padding-left'),
				'margin': '0',
				'padding': '0',
				'border': '1px solid red',	// TODO TEMP
				'font': 'inherit',
				'color': 'blue',	// TODO TEMP
				'background': 'transparent',
				'outline': 'none',
				'resize': 'none'
			});
			$textarea.val($this.text());
			this.appendChild(textarea);	
			$textarea.focus();

			// When the textarea is blurred, we're done editing
			$textarea.on('blur', function() {
				var $this = jQuery(this);
				var $parent = $this.parent();
				$parent.data('focused', false);
				$this.remove();
			});

		});

	});

};
