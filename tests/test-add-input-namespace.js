(function() {
    'use strict';

    var YUITest = require('yuitest');

    var path = require('path');

    var fs = require('fs');

    var addNamespaceInput = (new (require(path.resolve(__dirname, '../lib/add-namespace-input.js')).AddNamespaceInput)());

    var testDataJSP = fs.readFileSync(path.resolve(__dirname, '../data/data-add-namespace-input.jsp'), 'utf8');

    var contentJSP = addNamespaceInput.process(testDataJSP);

    YUITest.TestRunner.add(new YUITest.TestCase({
        name: "Test Add Namespace to input",

        /*
         * @tests #30
         */
        'test we do not touch invalid input start tag': function() {
            var dest,
                src;

            src = '<inputid="name1" name="name1">';
            dest = '<inputid="name1" name="name1">';

            YUITest.Assert.isTrue(contentJSP.indexOf(dest) !== -1, src + ' should be ignored');
        },

        /*
         * @tests #30
         */
        'test add namespace to input before first closing form tag': function() {
            var dest,
                src;

            src = '<input id="test2" name="name2">\n</form>';
            dest = '<input id="test2" name="<portlet:namespace />name2">\n</form>';

            YUITest.Assert.isTrue(contentJSP.indexOf(dest) !== -1, src + ' should be transformed');
        },

        /*
         * @tests #30
         */
        'test we ignore already namespaced name attribute': function() {
            var dest,
                src;

            src = '<input name="<%= namespace %>name3">';
            dest = '<input name="<%= namespace %>name3">';

            YUITest.Assert.isTrue(contentJSP.indexOf(dest) !== -1, src + ' should be ignored');
        },

        /*
         * @tests #30
         */
        'test we convert element in the second form': function() {
            var dest,
                src;

            src = '<input name="name4" id="test123">';
            dest = '<input name="<portlet:namespace />name4" id="test123">';

            YUITest.Assert.isTrue(contentJSP.indexOf(dest) !== -1, src + ' should be transformed');
        },

        /*
         * @tests #30
         */
        'test we ignore already namespaced element in the second form': function() {
            var dest,
                src;

            src = '<input name="<portlet:namespace /> name3">';
            dest = '<input name="<portlet:namespace /> name3">';

            YUITest.Assert.isTrue(contentJSP.indexOf(dest) !== -1, src + ' should be ignored');
        },

        /*
         * @tests #30
         */
        'test we ignore element outside a form': function() {
            var dest,
                src;

            src = 'testEnd\n\n<input name="<portlet:namespace /> name4">';
            dest = 'testEnd\n\n<input name="<portlet:namespace /> name4">';

            YUITest.Assert.isTrue(contentJSP.indexOf(dest) !== -1, src + ' should be ignored');
        },

        /*
         * @tests #34
         */
         'test we prefix textarea, button and select too': function() {
            var dest,
                src;

            src = '<textarea name="name6" id="test123">';
            dest = '<textarea name="<portlet:namespace />name6" id="test123">';

            YUITest.Assert.isTrue(contentJSP.indexOf(dest) !== -1, src + ' should be prefixed');

            src = '<button name="name7">';
            dest = '<button name="<portlet:namespace />name7">';

            YUITest.Assert.isTrue(contentJSP.indexOf(dest) !== -1, src + ' should be prefixed');

            src = '<select name="coches" id="selectCoches">';
            dest = '<select name="<portlet:namespace />coches" id="selectCoches">';

            YUITest.Assert.isTrue(contentJSP.indexOf(dest) !== -1, src + ' should be prefixed');
        }
    }));
}());