/*******************************************************************************
 * Copyright (c) <2011> <Mansoor Sayed>
 * 
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 * 
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 *******************************************************************************/

(function ($) {
    /*
        Function: AstroForm
            Constructor
        
        Parameters:
            element - The DOM form element that is to be turned into a wizard
            args - An object containing properties to be loaded onto the instance of AstroForm
        
        Events:
            firstStep - 
            
            lastStep - 
            
            preStepCreation - 
            
            postStepCreation - 
            
            preStepRemoval - 
            
            postStepRemoval - 
            
            preStepChange - 
            
            postStepChange - 
            
            currentStep - 
            
        Returns:
            Object instance
    */
    function AstroForm(element, args) {
        this.astroformClass = 'astroform-wizard';
        this.submitClass = 'astroform-submit';
        this.resetClass = 'astroform-reset';
        this.nextButtonClass = 'astroform-nav-next';
        this.backButtonClass = 'astroform-nav-back';
        this.stepsListClass = 'astroform-steps';
        this.stepsLegendPrefix = 'astroform-stepsDesc';
        this.autoNavClass = 'astroform-auto-nav';
        this.stepsLabel = 'Step';
        this.autoNextLabel = 'Next';
        this.autoPrevLabel = 'Back';
        this.currentClass = 'current';
        this.resetLabel = 'Reset';
        this._anchorBase = '';
        this.autoCreateNav = true;
        this.createStepsList = true;
        this.clearOnSubmit = true;
        this.navToJqueryUi = false;
        this.useAnchorBase = false;
        this.preventDefaultOnNav = true;
        this.fieldSets = [];
        this.thisElement = null;
        this.currentStep = null;
        this.stopEvents = false;
        this.showReset = true;
        $.extend(this, args);
        this.thisElement = $(element);

        this.thisElement.trigger('firstStep');

        //set the current form step to a default of 0
        this.currentStep = 0;

        this.thisElement.addClass(this.astroformClass);
        
        this.fieldSets = this.thisElement.find('fieldset');

        //check to see if we need to create the navigation for the form or the user has manually created it (default)
        if (this.autoCreateNav === true) {
            this._createNav();
        }

        // setup anchor base if requested
        if (this.useAnchorBase === true) {
            this._anchorBase = location;
        }
            
        this.thisElement.find('.' + this.submitClass).hide();

        // create the element to hold the steps list
        this.thisElement.prepend('<ul class="' + this.stepsListClass + '"></ul>');

        //hide the submit button untill the last step of the form
        this.thisElement.find('.' + this.submitClass).hide();

        //hide the back button bu default
        this.thisElement.find('.' + this.backButtonClass).hide();


        this.fieldSets.hide();
        $(this.fieldSets[0]).show();

        // call the buildSteps function to generate the steps list
        this._rebuildStepsList();

        // add the 'current' class to the current step on the list 
        this._updateCurrentStep();

        if (this.navToJqueryUi === true) {
                this.thisElement.find('.' + this.submitClass).button();
                this.thisElement.find('.' + this.nextButtonClass).button();
                this.thisElement.find('.' + this.backButtonClass).button();
                //todo add logic for reset button
                
        }
        if (this.navToJqueryUi === true) {
            $('.' + this.autoNavClass).find('a, input').button();
        }

        //Register listeners for events
        this._registerEvents();
    }


    /*
        Method: next
            Goes to the next step of the wizard
        
        Parameters: 
            None
        
        Returns: 
            Void
     */
    AstroForm.prototype.next = function () {
        //sanity check
        if (this.currentStep === this.fieldSets.length - 1) {
            return;
        }

        if (!this.stopEvents) {
            this.thisElement.trigger('preStepChange');
        }

        $(this.fieldSets[this.currentStep]).hide();
        $(this.fieldSets[++this.currentStep]).show();

        if (this.currentStep === 0) {
            this.thisElement.find('.' + this.backButtonClass).hide();
        } else {
            this.thisElement.find('.' + this.backButtonClass).show();
        }

        this._updateCurrentStep();

        if (this.currentStep === this.fieldSets.length - 1) {
            this.thisElement.find('.' + this.submitClass).show();
            this.thisElement.find('.' + this.nextButtonClass).hide();
            this.thisElement.trigger('finalStep');
        }
        
        if (!this.stopEvents) {
            this.thisElement.trigger('postStepChange');
        }
    };



    /*
        Method: back
            Goes to the previous step of the wizard
        
        Parameters: 
            None
        
        Returns: 
            Void
     */
    AstroForm.prototype.back = function () {
        //sanity checking
        if (this.currentStep === 0) {
            return;
        }

        if (!this.stopEvents) {
            this.thisElement.trigger('preStepChange');
        }

        $(this.fieldSets[this.currentStep]).hide();
        $(this.fieldSets[--this.currentStep]).show();

        if (this.currentStep === 0) {
            this.thisElement.find('.' + this.backButtonClass).hide();
        } else {
            this.thisElement.find('.' + this.backButtonClass).show();
        }

        this._updateCurrentStep();
        this.thisElement.find('.' + this.submitClass).hide();
        this.thisElement.find('.' + this.nextButtonClass).show();

        if (!this.stopEvents) {
            this.thisElement.trigger('postStepChange');
        }
    };



    /*
        Method: _updateCurrentStep
            Updates the current step class in the steps list
        
        Parameters: 
            None
        
        Returns: 
            Void
     */
    AstroForm.prototype._updateCurrentStep = function () {
        this.thisElement.find('.' + this.stepsListClass + ' li').removeClass(this.currentClass);
        this.thisElement.find('.' + this.stepsLegendPrefix + this.currentStep).addClass(this.currentClass);
    };


    /*
        Method: _rebuildStepsList
            Rebuilds the steps list. Called after a step has been added or removed dynamically.
        
        Parameters: 
            None
        
        Returns: 
            Void
     */
    AstroForm.prototype._rebuildStepsList = function () {
        // update the list of feildsets
        this.fieldSets = this.thisElement.find('fieldset');

        //remove all of the child nodes if they exist
        var stepsList = this.thisElement.find('.' + this.stepsListClass).empty();

        var self = this;
        this.fieldSets.each(function (i) {
            var name = $(this).find('legend').html();
            stepsList.append('<li class="' + self.stepsLegendPrefix + i + '">Step ' + (i + 1) + '<span>' + name + '</span></li>');
        });

    };


    /*
        Method: _createNav
            Auto-Magically creates navigation for the form
        
        Parameters: 
            None
        
        Returns: 
            Void
     */
    AstroForm.prototype._createNav = function () {
        
        var resetButton = this.thisElement.find(':reset'),
            resetElement = '<input class="' + this.resetClass + '" type="reset" value="' + resetButton.val() + '"/>',
            submitElement = this.thisElement.find(':submit').remove().clone();
        
        //check to see if reset button exists
        if (resetButton.length) {
            resetButton.remove();
        }

        //build the navigation elements and append them to the end of the form
        this.thisElement.append('<div class="' + this.autoNavClass + '">' 
            + '<a class="' + this.backButtonClass + '" href="' + this._anchorBase +'#">' + this.autoPrevLabel 
            + '</a>' + '<input class="' + this.submitClass + ' ' + submitElement.attr('class') 
            + '" value="' + submitElement.val() + '" type="submit">' + '<a class="' + this.nextButtonClass 
            + '" href="' + this._anchorBase +'#">' + this.autoNextLabel + '</a>' + resetElement + '</div>');
        
        if (!this.showReset) {
            this.thisElement.find('.' + this.resetClass).hide();
        }
    };


    /*
        Method: gotoFirstStep
            Goes to the first step of the wizard
        
        Parameters: 
            None
        
        Returns: 
            Void
     */
    AstroForm.prototype.gotoFirstStep = function () {
        this.stopEvents = true;
        var i = this.currentStep;
        for (i; i > 0; i--) {
            this.back();
        }
        this.stopEvents = false;
        this.thisElement.trigger('firstStep');
    };


    /*
        Method: gotoLastStep
            Goes to the las step of the wizard
        
        Parameters: 
            None
        
        Returns: 
            Void
     */
    AstroForm.prototype.gotoLastStep = function () {
        this.stopEvents = true;
        var i = this.currentStep;
        for (i; i < this.fieldSets.length; i++) {
            this.next();
        }
        this.stopEvents = false;
        this.thisElement.trigger('lastStep');
    };


    /*
        Method: gotoStep
            Goes to an arbitrary step in the wizard
        
        Parameters: 
            arg - A variable of type Int or type Array(with the first element) holding the location of the target step

        Returns: 
            Void
     */
    AstroForm.prototype.gotoStep = function (arg) {
        var step = null;
        if (arg instanceof Array) {
            step = arg[0];
        } else {
            step = arg;
        }

        if (this.currentStep === step) {
            return;
        }

        this.stopEvents = true;
        var i = this.currentStep;
        if (this.currentStep > step) {
            for (i; i > step; i--) {
                this.back();
            }
        } else {
            for (i; i < step; i++) {
                this.next();
            }
        }

        this.stopEvents = false;
    };


    /*
        Method: createStepAt
            Dynamically adds a step to the wizard
        
        Parameters: 
            arg - An Array with the first element(String) holding the html data and the second element holding it's intended location 

        Returns: 
            Void
     */
    AstroForm.prototype.createStepAt = function (arg) {
        var data = arg[0],
            location = arg[1];


        this.thisElement.trigger('preStepCreation');

        this.fieldSets.eq(location).before(data);

        if (this.currentStep >= location) {
            this.currentStep++;
        }

        this._rebuildStepsList();

        $(this.fieldSets[location]).hide();

        // add the 'current' class to the current step on the list 
        this._updateCurrentStep();

        this.thisElement.trigger('postStepCreation');
    };


    /*
        Method: removeStep
            Dynamically removes a step from the wizard
        
        Parameters: 
            arg - An Int or Array(with the first element) holding the location of the step to be removed 

        Returns: 
            Void
     */
    AstroForm.prototype.removeStep = function (arg) {

        var location = null;
        if (arg instanceof Array) {
            location = arg[0];
        } else {
            location = arg;
        }

        this.thisElement.trigger('preStepRemoval');

        this.fieldSets.eq(location).remove();

        if (this.currentStep === location) {
            this.next();
        }

        if (this.currentStep > location) {
            this.currentStep--;
        }
        this._rebuildStepsList();

        // add the 'current' class to the current step on the list 
        this._updateCurrentStep();

        this.thisElement.trigger('postStepRemoval');
    };


    /*
        Method: getCurrentStep
            Returns the active (current) step of the wizard. Counting starts at 0.
        
        Parameters: 
            None 

        Returns: 
            Int
     */
    AstroForm.prototype.getCurrentStep = function () {
        return this.currentStep;
    };


    /*
        Method: reset
            Resets the form aspect of the wizard.
        
        Parameters: 
            None 

        Returns: 
            Void
     */
    AstroForm.prototype.reset = function () {
        this.thisElement.find('.' + this.resetClass).click();
    };


    /*
        Method: _registerEvent
            Registers event listeners
        
        Parameters: 
            None 

        Returns: 
            Void
     */
    AstroForm.prototype._registerEvents = function () {

        var self = this;
        // setup next button behaviour
        this.thisElement.find('.' + this.nextButtonClass).click(function (event) {
            if (self.preventDefaultOnNav) {
                event.preventDefault();
            }
            self.next();
        });

        // setup back button behaviour
        this.thisElement.find('.' + this.backButtonClass).click(function (event) {
            if (self.preventDefaultOnNav) {
                event.preventDefault();
            }
            self.back();
        });
    };
    

    /*
        Method: $.fn.AstroForm
            Extends jQuery to expose the AstroForm object.
        
        Parameters: 
            option - {Object} containing configurations for AstroForm | {String} containing name of method to call
            
            args -  {Array} holding parameters passed to the method(option) | {Int} containg value to be passed to the method(option)

        Returns: 
            jQuery object for the selected DOM nodes
     */
    $.fn.AstroForm = function (option, args) {
        var toReturn = [],
            returnedVal; 
        this.each(function (index, value) {
            var element = $(this);
            var astroform = element.data('AstroForm') ? element.data('AstroForm') : function () {
                var object = new AstroForm(this, option);
                element.data('AstroForm', object);
                return object;
            }.call(this);
            
			// If the first parameter is a method of AstroForm then call it with the provided argument
            if (astroform[option]) {
                returnedVal = astroform[option].call(astroform, args);
            }
            // If the called method does not return anything, return the jQuery object back. If it does return a value, return that instead
            toReturn[index] = (returnedVal !== undefined) ? returnedVal : value;
        });
        
        return toReturn;
    };
}(jQuery));
