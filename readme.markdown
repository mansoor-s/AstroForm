#AstroForm
AstroForm is a jQuery plugin to transform regular HTML forms into interactive wizards with multiple steps. To learn more about how it is used, take a look at the demo index.html file.

##DEMO:
    [[http://mansoorsayed.com/AstroForm/]]

##Sample Usage:
    $('selector').AstroForm({
        navToJqueryUi: true,  //turn the wizard navigation links into jquery UI buttons (jQuery UI required for this)
        showReset: false    // to show a reset button or not (one will be created if the original form doesn't have one)
    });
    
    
###Default Properties:
    astroformClass : 'astroform-wizard'
    submitClass : 'astroform-submit'
    resetClass : 'astroform-reset'
    nextButtonClass : 'astroform-nav-next'
    backButtonClass : 'astroform-nav-back';
    stepsListClass : 'astroform-steps'
    stepsLegendPrefix : 'astroform-stepsDesc'
    autoNavClass : 'astroform-auto-nav'
    stepsLabel : 'Step'
    autoNextLabel : 'Next'
    autoPrevLabel : 'Back'
    currentClass : 'current'
    resetLabel : 'Reset'
    autoCreateNav : true
    createStepsList : true
    clearOnSubmit : true
    navToJqueryUi : false
    useAnchorBase : false
    preventDefaultOnNav : true
    showReset : true

###Events Triggered:
    firstStep - Triggered when the wizard is navigated to the first step. It's also given off after wizard construction.
    lastStep - Triggered when the wizard is navigated to the last step.
    preStepCreation - Triggered right before a step is dynamically created
    postStepCreation - Triggered right after a step is dynamically created
    preStepRemoval - Triggered right before a step is dynamically removed
    postStepRemoval - Triggered right after a step is dynamically removed
    preStepChange - Emitted before the current step is changed (going forward or backwords for example)
    postStepChange - Triggered after the current step is changed (going forward or backwords for example)
