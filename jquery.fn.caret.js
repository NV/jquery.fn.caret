/**
 * jQuery plugin for handling text insertion/deletion at caret position
 * Based on http://img.yandex.net/i/keyboardu.js
 * leonya@yandex-team.ru, aandrosov@yandex-team.ru
 */
jQuery.fn.extend({

    /**
     * Saves caret position to data.selection
     */
    saveCaretPos: function() {
        var start,
            end,
            target = this.get(0),
            range;

        if (target.createTextRange) { //IE
            if (target.tagName == 'TEXTAREA') {
                // http://the-stickman.com/web-development/javascript/finding-selection-cursor-position-in-a-textarea-in-internet-explorer/
                range = document.selection.createRange();
                // We'll use this as a 'dummy'
                var storedRange = range.duplicate();
                // Select all text
                storedRange.moveToElementText( target );
                // Now move 'dummy' end point to end point of original range
                storedRange.setEndPoint('EndToEnd', range);
                // Now we can calculate start and end points
                start = storedRange.text.length - range.text.length;
                end = start + range.text.length;
            } else {
                range = document.selection.createRange().duplicate();
                range.moveEnd('character', target.value.length);
                if (range.text == '') {
                    start = target.value.length;
                } else {
                    start = target.value.lastIndexOf(range.text);
                }
                range = document.selection.createRange().duplicate();
                range.moveStart('character', -target.value.length);
                end = range.text.length;
            }
        } else if (target.setSelectionRange) {
            start =  target.selectionStart;
            end = target.selectionEnd
        } else {
            start = end = target.value.length;
        }

        if (start >= 0 && end >= 0) {
            this.data('selection', {
                'start': start,
                'end': end
            });
        }
    },

    setCaretPos: function(position) {
        var target = this.get(0);

        if (position >= 0) {
            this.data('selection', {
                'start': position,
                'end': position
            });
        } else {
            position = this.data('selection');
            if (position) {
                position = position.start;
            } else {
                return;
            }
        }

        if (target.setSelectionRange) {
            target.focus();
            target.setSelectionRange(position, position);

        } else if (target.createTextRange) { //IE
            var range = target.createTextRange();
            range.collapse(true);
            range.moveEnd('character', position);
            range.moveStart('character', position);
            range.select();
        }
    },

    insertAtCaretPos: function(key) {
        var caretPosition = this.data('selection'),
            targetField = this.get(0),
            newCaretPosition = caretPosition.start + key.length;

        targetField.value = targetField.value.substring(0, caretPosition.start) + key + targetField.value.substring(caretPosition.end);

        // In IE, use setTimeout to set caret position
        if ($.browser.msie) {
            this.data('selection', {
                'start': newCaretPosition,
                'end': newCaretPosition
            });
        } else {
            this.setCaretPos(newCaretPosition);
        }

    },

    deleteAtCaretPos: function() {
        var caretPosition = this.data('selection'),
            targetField = this.get(0),
            newCaretPosition;

        if (caretPosition.start === caretPosition.end) {
            targetField.value = targetField.value.substring(0, caretPosition.start - 1) + targetField.value.substring(caretPosition.end);
            newCaretPosition = caretPosition.start - 1;
            if (newCaretPosition < 0) {
                newCaretPosition = 0;
            }
        } else {
            targetField.value = targetField.value.substring(0, caretPosition.start) + targetField.value.substring(caretPosition.end);
            newCaretPosition = caretPosition.start;
        }

        if ($.browser.msie) {
            this.data('selection', {
                'start': newCaretPosition,
                'end': newCaretPosition
            });
        } else {
            this.setCaretPos(newCaretPosition);
        }

    }
});