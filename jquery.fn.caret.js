/**
 * jquery.fn.caret - a jQuery plugin for handling text insertion/deletion at caret position
 * @version 1.0
 * @author leonidkhachaturov@gmail.com
 */
jQuery.fn.extend({
    insertAtCaretPos: function(key) {
        var targetField = this.get(0);

        targetField.focus();

        if (typeof targetField.setSelectionRange != 'undefined') {
            var selectionStart = targetField.selectionStart;
            var selectionEnd = targetField.selectionEnd;
            targetField.value = targetField.value.substring(0, selectionStart) + key + targetField.value.substring(selectionEnd);
            targetField.setSelectionRange(selectionStart + key.length, selectionStart + key.length);
        } else {
            if (typeof(targetField.createTextRange) != 'undefined' && targetField.caretPos) {
                var caretPos = targetField.caretPos;
                caretPos.text = caretPos.text.charAt(caretPos.text.length - 1) == ' ' ? key + ' ' : key;
                caretPos.select();
            } else {
                targetField.value += key;
            }
        }

        targetField.focus();
    },

    deleteAtCaretPos: function() {
        var targetField = this.get(0);

        targetField.focus();

        if (typeof targetField.setSelectionRange != 'undefined') {
            var selectionStart = targetField.selectionStart;
            var selectionEnd = targetField.selectionEnd;
            targetField.value = targetField.value.substring(0, selectionStart - 1) + targetField.value.substring(selectionEnd);
            targetField.setSelectionRange(selectionStart - 1, selectionStart - 1);
        } else {
            if (typeof(targetField.createTextRange) != 'undefined' && targetField.caretPos) {
                var caretPos = targetField.caretPos;
                if (!caretPos.text) {
                    caretPos.moveStart("character", -1);
                }
                caretPos.text = '';
                caretPos.select();
            } else {
                targetField.value = targetField.value.substring(0, targetField.value.length);
            }
        }

        targetField.focus();
    }
});