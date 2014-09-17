'use strict';

/**
 * Created by ahmetdal on 03/09/14.
 */



/*
 * required underscore
 * */
/*
 * There Uri's must be defined in base html as variable;
 *   GETTING_AVAILABLE_STATES_URI
 *   GETTING_CURRENT_STATE_URI
 *   APPROVE_TRANSITION_URI
 *   REJECT_TRANSITION_URI
 *
 * */

/*jshint indent: false */
/*jshint undef: false */


var updateOrPush = function (array, filter, defaults) {
    var results = $.grep(array, function (e) {
        var r = true;
        for (var k in filter) {
            if (e[k] !== filter[k]) {
                r = false;
            }
        }
        if (r) {
            for (k in defaults) {
                e[k] = defaults[k];
            }
        }
        return r;
    });

    if (!results.length) {
        array.push($.extend(filter, defaults));
    }
};

var removeElementBy = function (array, filter) {
    return $.grep(array, function (e) {
        var r = false;
        for (var k in filter) {
            if (e[k] !== filter[k]) {
                r = true;
            }
        }
        return r;
    });
};

var getElementsBy = function (array, filter) {
    return $.grep(array, function (e) {
        var r = true;
        for (var k in filter) {
            if (e[k] !== filter[k]) {
                r = false;
            }
        }
        return r;
    });
};


var RiverIO = function () {
};

RiverIO.BEFORE_PROCESS = 'before_process';
RiverIO.AFTER_PROCESS = 'after_process';
RiverIO.WAITING_TRANSITION_PROCESSES = [];

RiverIO.PROCESS_CALLBACK_EVENTS = [];

RiverIO.APPROVE = 'APPROVE';
RiverIO.REJECT = 'REJECT';


RiverIO.GETTING_AVAILABLE_STATES_URI = 'GETTING_AVAILABLE_STATES_URI';
RiverIO.GETTING_CURRENT_STATE_URI = 'GETTING_CURRENT_STATE_URI';
RiverIO.APPROVE_TRANSITION_URI = 'APPROVE_TRANSITION_URI';
RiverIO.REJECT_TRANSITION_URI = 'REJECT_TRANSITION_URI';
RiverIO.GET_STATE_BY_LABEL_URI = 'GET_STATE_BY_LABEL_URI';
RiverIO.SKIP_TRANSITION_URI = 'SKIP_TRANSITION_URI';
RiverIO.TOKEN = 'river.io-token';

$.ajaxSetup(
    {
        headers: {
            "river.io-token": RiverIO.TOKEN
        }
    }
);


RiverIO.registerTransitionProcess = function (type, contentTypeId, objectId, fieldId, nextStateId, callbackUri) {
    var currentState = RiverIO.getCurrentState(contentTypeId, objectId, fieldId);
    var filter = {contentTypeId: contentTypeId, objectId: objectId, fieldId: fieldId, currentStateId: currentState.id, nextStateId: nextStateId};
    var defaults = {type: type, callbackUri: callbackUri, date: new Date()};
    if (nextStateId) {
        defaults.nextStateId = nextStateId;
    }
    updateOrPush(RiverIO.WAITING_TRANSITION_PROCESSES, filter, defaults);
};

RiverIO.getTransitionProcesses = function (contentTypeId, objectId, fieldId, nextStateId) {
    var currentState = RiverIO.getCurrentState(contentTypeId, objectId, fieldId);
    var filter = {contentTypeId: contentTypeId, objectId: objectId, fieldId: fieldId, currentStateId: currentState.id};
    if (nextStateId) {
        filter.nextStateId = nextStateId;
    }
    return getElementsBy(RiverIO.WAITING_TRANSITION_PROCESSES, filter);
};


RiverIO.unRegisterTransitionProcess = function (contentTypeId, objectId, fieldId, nextStateId) {
    var currentState = RiverIO.getCurrentState(contentTypeId, objectId, fieldId);
    RiverIO.WAITING_TRANSITION_PROCESSES = removeElementBy(RiverIO.WAITING_TRANSITION_PROCESSES, {contentTypeId: contentTypeId, objectId: objectId, fieldId: fieldId, currentStateId: currentState.id, nextStateId: nextStateId});
};


RiverIO.commitLastTransitionProcess = function (contentTypeId, objectId, fieldId) {
    var waitingProcesses = RiverIO.getTransitionProcesses(contentTypeId, objectId, fieldId);

    var results = $.grep(waitingProcesses,
        function (e) {
            var maxDate = new Date(Math.max.apply(Math, waitingProcesses.map(
                function (o) {
                    return o.date;
                })));
            return e.date.getTime() >= maxDate.getTime();
        });
    if (results.length) {
        var waitingTransitionProcess = results[0];
        RiverIO.commitTransitionProcess.apply(undefined, [
            waitingTransitionProcess.contentTypeId,
            waitingTransitionProcess.objectId,
            waitingTransitionProcess.fieldId,
            waitingTransitionProcess.currentStateId,
            waitingTransitionProcess.nextStateId
        ]);
    }
    else {
        throw 'No transition to be committed!';
    }
};

RiverIO.commitTransitionProcess = function (contentTypeId, objectId, fieldId, currentStateId, nextStateId) {
    var waitingTransitionProcess = RiverIO.getTransitionProcesses(contentTypeId, objectId, fieldId, nextStateId);
    if (waitingTransitionProcess.length) {
        waitingTransitionProcess = waitingTransitionProcess[0];
        RiverIO.processTransition.apply(undefined, [
            waitingTransitionProcess.type,
            waitingTransitionProcess.callbackUri,
            waitingTransitionProcess.contentTypeId,
            waitingTransitionProcess.objectId,
            waitingTransitionProcess.fieldId,
            waitingTransitionProcess.nextStateId,
            true,
            waitingTransitionProcess.currentStateId,
        ]);
    }
    else {
        throw 'No transition to be committed!';
    }
};


RiverIO.redirectUri = function (uri) {
    if (window.location === uri) {
        window.location.reload();
    } else {
        window.location = uri;
    }
};


RiverIO.registerProcessCallBack = function (type, sourceStateId, destinationStateId, fn, contentTypeId, objectId, fieldId) {
    var filter = {type: type, sourceStateId: sourceStateId, destinationStateId: destinationStateId};
    if (contentTypeId) {
        filter.contentTypeId = contentTypeId;
    }
    if (objectId) {
        filter.objectId = objectId;
    }
    if (fieldId) {
        filter.fieldId = fieldId;
    }
    var defaults = {fn: fn};
    updateOrPush(RiverIO.PROCESS_CALLBACK_EVENTS, filter, defaults);
};

RiverIO.unRegisterProcessCallBack = function (type, sourceStateId, destinationStateId, contentTypeId, objectId, fieldId) {
    var filter = {type: type, sourceStateId: sourceStateId, destinationStateId: destinationStateId};
    if (contentTypeId) {
        filter.contentTypeId = contentTypeId;
    }
    if (objectId) {
        filter.objectId = objectId;
    }
    if (fieldId) {
        filter.fieldId = fieldId;
    }
    RiverIO.PROCESS_CALLBACK_EVENTS = removeElementBy(RiverIO.PROCESS_CALLBACK_EVENTS, filter);

};


RiverIO.getProcessCallBacks = function (type, sourceStateId, destinationStateId, contentTypeId, objectId, fieldId) {
    var filter = {type: type, sourceStateId: sourceStateId, destinationStateId: destinationStateId};

    if (contentTypeId) {
        filter.contentTypeId = contentTypeId;
    }
    if (objectId) {
        filter.objectId = objectId;
    }
    if (fieldId) {
        filter.fieldId = fieldId;
    }
    return getElementsBy(RiverIO.PROCESS_CALLBACK_EVENTS, filter);
};


RiverIO.invokeProcessCallback = function (type, currentStateId, nextStateId, contentTypeId, objectId, fieldId, callback) {
    var processCallBacks = RiverIO.getProcessCallBacks(type, currentStateId, nextStateId, contentTypeId, objectId, fieldId);
    processCallBacks = processCallBacks.concat(RiverIO.getProcessCallBacks(type, currentStateId, nextStateId, contentTypeId, null, null));
    processCallBacks = processCallBacks.concat(RiverIO.getProcessCallBacks(type, currentStateId, nextStateId, null, null, null));
    processCallBacks = _.uniq(processCallBacks, function (e) {
        return JSON.stringify(e);
    });
    var results = [];
    for (var i in processCallBacks) {
        var processCallBack = processCallBacks[i];
        if (processCallBack.fn) {
            results.push(processCallBack.fn.call(undefined, {
                type: type,
                currentStateId: currentStateId,
                nextStateId: nextStateId,
                contentTypeId: contentTypeId,
                objectId: objectId,
                fieldId: fieldId,
                callback: callback
            }));
        }

    }
    return [processCallBacks.length !== 0, results];
};


RiverIO.getParameterizedUri = function (uri, args) {
    for (var i in args) {
        var argument = args[i];
        uri = uri.replace('$' + i, argument);
    }
    return uri;
};


/*
 *
 * CLIENT REST REQUESTS
 *
 * */


//noinspection JSCommentMatchesSignature
/**
 * Returns available states of the object given, as JSONArray.
 *
 * @param {number}  contentTypeId :ContentType id of the object that is processed.
 * @param {number}  objectId Object id of the object that is processed.
 * @param {string}  fieldId :fieldId of the object that is processed.
 * @return {array} Desired states as json array.
 */

RiverIO.getAvailableStates = function () {
    var uri = RiverIO.getParameterizedUri(RiverIO.GETTING_AVAILABLE_STATES_URI, arguments);
    var result = {};
    $.ajax(
        {
            type: 'GET',
            url: uri,
            dataType: 'json',
            async: false,
            success: function (data) {
                result = JSON.parse(data);
            },
            error: function (err) {
                throw err;
            }
        });
    return result;
};


//noinspection JSCommentMatchesSignature
/**
 * Returns current state the object is given.
 *
 * @param {number}  contentTypeId :ContentType id of the object that is processed.
 * @param {number}  objectId Object id of the object that is processed.
 * @param {string}  fieldId :fieldId of the object that is processed.
 * @return {State} Desired state as dictionary.
 */
RiverIO.getCurrentState = function () {
    var uri = RiverIO.getParameterizedUri(RiverIO.GETTING_CURRENT_STATE_URI, arguments);
    var result = {};

    $.ajax(
        {
            type: 'GET',
            url: uri,
            dataType: 'json',
            async: false,
            success: function (data) {
                result = data;
            },
            error: function (err) {
                throw err;
            }
        });
    return result;
};

//noinspection JSCommentMatchesSignature
/**
 * Returns state by given label as dictionary.
 *
 * @param {string} label The desired states label.
 * @return {State} Desired state as dictionary.
 */
RiverIO.getStateByLabel = function () {
    var uri = RiverIO.getParameterizedUri(RiverIO.GET_STATE_BY_LABEL_URI, arguments);
    var result = {};
    $.ajax(
        {
            type: 'GET',
            url: uri,
            async: false,
            dataType: 'json',
            success: function (data) {
                result = data;
            },
            error: function (err) {
                throw err;
            }
        });
    return result;
};


/**
 * Workflow transition processor. Whenever you want to process any transition, just call this function with the required parameters.
 *
 * @param {string}  type :APPROVE or REJECT
 * @param {string}  callbackUri :redirecting url after the process is done
 * @param {number}  contentTypeId :ContentType id of the object that is processed.
 * @param {number}  objectId Object id of the object that is processed.
 * @param {string}  fieldId :fieldId of the object that is processed.
 * @param {number}  nextStateId :Next state id of the object that is processed.
 * @param {boolean} skipBeforeAction :Command to ignore registered 'before callbacks'. (Optional)
 * @param {boolean} currentStateId :Current state id of the object that is processed. (Optional)
 */
RiverIO.processTransition = function (type, callbackUri, contentTypeId, objectId, fieldId, nextStateId, skipBeforeAction, currentStateId) {
    skipBeforeAction = typeof skipBeforeAction !== 'undefined' ? skipBeforeAction : false;
    currentStateId = typeof currentStateId !== 'undefined' ? currentStateId : RiverIO.getCurrentState(contentTypeId, objectId, fieldId).id;
    callbackUri = typeof callbackUri !== undefined && callbackUri !== null ? callbackUri : window.location;
    var uri = null;
    if (type === RiverIO.APPROVE) {
        uri = RiverIO.APPROVE_TRANSITION_URI;
    }
    else if (type === RiverIO.REJECT) {
        uri = RiverIO.REJECT_TRANSITION_URI;
    }
    uri = RiverIO.getParameterizedUri(uri, Array.prototype.slice.call(arguments, 2));


    var anyInvocation = false;
    if (!skipBeforeAction) {
        RiverIO.registerTransitionProcess(type, contentTypeId, objectId, fieldId, nextStateId, callbackUri);
        var result = RiverIO.invokeProcessCallback(RiverIO.BEFORE_PROCESS, currentStateId, nextStateId, contentTypeId, objectId, fieldId, function () {
            RiverIO.commitLastTransitionProcess(contentTypeId, objectId, fieldId);
        });
        anyInvocation = result[0];
    }
    if (skipBeforeAction || !anyInvocation) {
        $.ajax(
            {
                type: 'GET',
                url: uri,
                dataType: 'json',
                success: function () {
                    var result = RiverIO.invokeProcessCallback(RiverIO.AFTER_PROCESS, currentStateId, nextStateId, contentTypeId, objectId, fieldId, function () {
                        RiverIO.redirectUri(callbackUri);
                    });
                    var anyInvocation = result[0];
                    if (!anyInvocation) {
                        RiverIO.redirectUri(callbackUri);
                    }
                },
                error: function (err) {
                    throw err;
                }
            });
        RiverIO.unRegisterTransitionProcess(contentTypeId, objectId, fieldId, nextStateId);
    }
};


RiverIO.skipTransition = function (contentTypeId, objectId, fieldId, destinationStateIds) {
    var uri = RiverIO.getParameterizedUri(RiverIO.SKIP_TRANSITION_URI, arguments);
    var postData = {
        destinationStateIds: destinationStateIds
    };
    var result = false;
    $.ajax(
        {
            type: 'POST',
            url: uri,
            dataType: 'json',
            data: JSON.stringify(postData),
            contentType: 'application/json',
            async: false,
            success: function () {
                result = true;
            },
            error: function (err) {
                throw err;
            }
        });

    return result;
};




