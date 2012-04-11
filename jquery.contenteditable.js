/*

Content editable jQuery plugin
==============================

by Evan Hahn

This is free and unencumbered software released into the public domain.

Anyone is free to copy, modify, publish, use, compile, sell, or
distribute this software, either in source code form or as a compiled
binary, for any purpose, commercial or non-commercial, and by any
means.

In jurisdictions that recognize copyright laws, the author or authors
of this software dedicate any and all copyright interest in the
software to the public domain. We make this dedication for the benefit
of the public at large and to the detriment of our heirs and
successors. We intend this dedication to be an overt act of
relinquishment in perpetuity of all present and future rights to this
software under copyright law.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
IN NO EVENT SHALL THE AUTHORS BE LIABLE FOR ANY CLAIM, DAMAGES OR
OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE,
ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
OTHER DEALINGS IN THE SOFTWARE.

For more information, please refer to <http://unlicense.org/>

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
				'background': 'transparent',
				'outline': 'none',
				'resize': 'none'
			});
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
