'use strict';

/**
 * Created by ahmetdal on 04/09/14.
 */

/*jshint indent: false */
/*jshint undef: false */


describe('RiverIO', function () {
    var expectedType = RiverIO.APPROVE;
    var expectedContentTypeId = 1;
    var expectedObjectId = 1;
    var expectedFieldId = 1;
    var expectedCurrentStateId = 1;
    var expectedNextStateId = 2;
    var expectedCallbackUri = 'testCallbackUri';
    var expectedState = {id: 1, label: 's2'};
    var redirected = false;
    beforeEach(function () {


        spyOn($, 'ajax').andCallFake(function (options) {
            if (options.url === RiverIO.GET_STATE_BY_LABEL_URI || options.url === RiverIO.GETTING_CURRENT_STATE_URI) {
                options.success(expectedState);
            } else if (options.url === RiverIO.APPROVE_TRANSITION_URI || options.url === RiverIO.REJECT_TRANSITION_URI) {
                options.success();
            }
        });
        spyOn(RiverIO, 'redirectUri').andCallFake(function () {
            redirected = true;
        });

    });


    it('Get Current State', function () {
        var currentState = RiverIO.getCurrentState(expectedContentTypeId, expectedObjectId, expectedFieldId);
        expect(JSON.stringify(currentState)).toBe(JSON.stringify(expectedState));
    });

    it('Get State By Label', function () {
        var state = RiverIO.getStateByLabel('s2');
        expect(JSON.stringify(state)).toBe(JSON.stringify(expectedState));
    });

    it('Register Transition Process', function () {
        expect(RiverIO.WAITING_TRANSITION_PROCESSES).toBeDefined();
        expect(RiverIO.WAITING_TRANSITION_PROCESSES.length).toBe(0);


        RiverIO.registerTransitionProcess(expectedType, expectedContentTypeId, expectedObjectId, expectedFieldId, expectedNextStateId, expectedCallbackUri);
        expect(RiverIO.WAITING_TRANSITION_PROCESSES.length).toBe(1);
        expect(RiverIO.WAITING_TRANSITION_PROCESSES[0].type).toBe(expectedType);
        expect(RiverIO.WAITING_TRANSITION_PROCESSES[0].contentTypeId).toBe(expectedContentTypeId);
        expect(RiverIO.WAITING_TRANSITION_PROCESSES[0].objectId).toBe(expectedObjectId);
        expect(RiverIO.WAITING_TRANSITION_PROCESSES[0].fieldId).toBe(expectedFieldId);
        expect(RiverIO.WAITING_TRANSITION_PROCESSES[0].currentStateId).toBe(expectedCurrentStateId);
        expect(RiverIO.WAITING_TRANSITION_PROCESSES[0].nextStateId).toBe(expectedNextStateId);
        expect(RiverIO.WAITING_TRANSITION_PROCESSES[0].callbackUri).toBe(expectedCallbackUri);
        expect(RiverIO.WAITING_TRANSITION_PROCESSES[0].date).not.toBeGreaterThan(new Date());

    });
    it('Get Transition Process', function () {
        expect(RiverIO.WAITING_TRANSITION_PROCESSES).toBeDefined();
        expect(RiverIO.WAITING_TRANSITION_PROCESSES.length).toBe(1);
        var transitionProcesses = RiverIO.getTransitionProcesses(expectedContentTypeId, expectedObjectId, expectedFieldId, expectedNextStateId);
        expect(transitionProcesses[0].type).toBe(expectedType);
        expect(transitionProcesses[0].contentTypeId).toBe(expectedContentTypeId);
        expect(transitionProcesses[0].objectId).toBe(expectedObjectId);
        expect(transitionProcesses[0].fieldId).toBe(expectedFieldId);
        expect(transitionProcesses[0].currentStateId).toBe(expectedCurrentStateId);
        expect(transitionProcesses[0].nextStateId).toBe(expectedNextStateId);
        expect(transitionProcesses[0].date).not.toBeGreaterThan(new Date());

    });
    it('Unregister Transition Process', function () {
        expect(RiverIO.WAITING_TRANSITION_PROCESSES).toBeDefined();
        expect(RiverIO.WAITING_TRANSITION_PROCESSES.length).toBe(1);
        RiverIO.unRegisterTransitionProcess(expectedContentTypeId, expectedObjectId, expectedFieldId, expectedNextStateId);
        expect(RiverIO.WAITING_TRANSITION_PROCESSES.length).toBe(0);
    });

    it('Commit Transition Process', function () {
        redirected = false;
        expect(RiverIO.WAITING_TRANSITION_PROCESSES).toBeDefined();
        expect(RiverIO.WAITING_TRANSITION_PROCESSES.length).toBe(0);
        RiverIO.registerTransitionProcess(expectedType, expectedContentTypeId, expectedObjectId, expectedFieldId, expectedNextStateId, expectedCallbackUri);
        var transitionProcesses = RiverIO.getTransitionProcesses(expectedContentTypeId, expectedObjectId, expectedFieldId, expectedNextStateId);
        expect(transitionProcesses.length).toBe(1);
        RiverIO.commitTransitionProcess(expectedContentTypeId, expectedObjectId, expectedFieldId, expectedCurrentStateId, expectedNextStateId);
        expect(RiverIO.WAITING_TRANSITION_PROCESSES.length).toBe(0);
        expect(redirected).toBeTruthy();
    });

    it('Commit Last Transition Process', function () {
        redirected = false;
        expect(RiverIO.WAITING_TRANSITION_PROCESSES).toBeDefined();
        expect(RiverIO.WAITING_TRANSITION_PROCESSES.length).toBe(0);
        RiverIO.registerTransitionProcess(expectedType, expectedContentTypeId, expectedObjectId, expectedFieldId, expectedNextStateId, expectedCallbackUri);
        var transitionProcesses = RiverIO.getTransitionProcesses(expectedContentTypeId, expectedObjectId, expectedFieldId, expectedNextStateId);
        expect(transitionProcesses.length).toBe(1);
        RiverIO.commitLastTransitionProcess(expectedContentTypeId, expectedObjectId, expectedFieldId);
        expect(RiverIO.WAITING_TRANSITION_PROCESSES.length).toBe(0);
        expect(redirected).toBeTruthy();
    });

    it('Register Process Callback', function () {
        expect(RiverIO.PROCESS_CALLBACK_EVENTS).toBeDefined();
        expect(RiverIO.PROCESS_CALLBACK_EVENTS.length).toBe(0);


        RiverIO.registerProcessCallBack(RiverIO.BEFORE_PROCESS, expectedCurrentStateId, expectedNextStateId, function () {
        });
        expect(RiverIO.PROCESS_CALLBACK_EVENTS.length).toBe(1);
        expect(RiverIO.PROCESS_CALLBACK_EVENTS[0].type).toBe(RiverIO.BEFORE_PROCESS);
        expect(RiverIO.PROCESS_CALLBACK_EVENTS[0].sourceStateId).toBe(expectedCurrentStateId);
        expect(RiverIO.PROCESS_CALLBACK_EVENTS[0].destinationStateId).toBe(expectedNextStateId);
        expect(RiverIO.PROCESS_CALLBACK_EVENTS[0].contentTypeId).toBeUndefined();
        expect(RiverIO.PROCESS_CALLBACK_EVENTS[0].objectId).toBeUndefined();
        expect(RiverIO.PROCESS_CALLBACK_EVENTS[0].fieldId).toBeUndefined();
    });

    it('Get Process Callback', function () {
        expect(RiverIO.PROCESS_CALLBACK_EVENTS).toBeDefined();
        expect(RiverIO.PROCESS_CALLBACK_EVENTS.length).toBe(1);
        var processCallbacks = RiverIO.getProcessCallBacks(RiverIO.BEFORE_PROCESS, expectedCurrentStateId, expectedNextStateId);
        expect(processCallbacks[0].type).toBe(RiverIO.BEFORE_PROCESS);
        expect(processCallbacks[0].sourceStateId).toBe(expectedCurrentStateId);
        expect(processCallbacks[0].destinationStateId).toBe(expectedNextStateId);
        expect(processCallbacks[0].contentTypeId).toBeUndefined();
        expect(processCallbacks[0].objectId).toBeUndefined();
        expect(processCallbacks[0].fieldId).toBeUndefined();

    });
    it('Unregister Process Callback', function () {
        expect(RiverIO.PROCESS_CALLBACK_EVENTS).toBeDefined();
        expect(RiverIO.PROCESS_CALLBACK_EVENTS.length).toBe(1);
        RiverIO.unRegisterProcessCallBack(RiverIO.BEFORE_PROCESS, expectedCurrentStateId, expectedNextStateId);
        expect(RiverIO.PROCESS_CALLBACK_EVENTS.length).toBe(0);
    });


    it('Get Parametrized Uri', function () {
        var uri = '$0$1$2$3';
        var args = [0, 'a', 2];
        var expectedUri = '0a2$3';
        expect(RiverIO.getParameterizedUri(uri, args)).toBe(expectedUri);
        args.push('last');
        expectedUri = '0a2last';
        expect(RiverIO.getParameterizedUri(uri, args)).toBe(expectedUri);
    });

    it('Invoke Process Callback For Before Process', function () {
        redirected = false;
        var beforeProcessVariable;
        var d = {};
        var expectedCallbackResult = 1;
        var expectedBeforeProcessVariable = 1;

        RiverIO.registerProcessCallBack(RiverIO.BEFORE_PROCESS, expectedCurrentStateId, expectedNextStateId, function (data) {
            d = data;
            beforeProcessVariable = expectedBeforeProcessVariable;
            return expectedCallbackResult;
        });

        expect(beforeProcessVariable).toBeUndefined();
        expect(JSON.stringify(d)).toBe('{}');
        var result = RiverIO.invokeProcessCallback(RiverIO.BEFORE_PROCESS, expectedCurrentStateId, expectedNextStateId);
        expect(result.length).toBe(2);
        expect(result[0]).toBeTruthy();
        expect(result[1].length).toBe(1);
        expect(result[1][0]).toBe(expectedCallbackResult);
        expect(beforeProcessVariable).toBe(expectedBeforeProcessVariable);
        expect(JSON.stringify(d)).toBe(
            JSON.stringify({
                               type: RiverIO.BEFORE_PROCESS,
                               currentStateId: expectedCurrentStateId,
                               nextStateId: expectedNextStateId,
                               contentTypeId: undefined,
                               objectId: undefined,
                               fieldId: undefined,
                               callback: undefined
                           }));

        expect(redirected).toBeFalsy();

    });

    it('Invoke Process Callback For After Process', function () {
        redirected = false;

        var afterProcessVariable;
        var d = {};
        var expectedCallbackResult = 1;
        var expectedAfterProcessVariable = 1;


        RiverIO.registerProcessCallBack(RiverIO.AFTER_PROCESS, expectedCurrentStateId, expectedNextStateId, function (data) {
            d = data;
            afterProcessVariable = expectedAfterProcessVariable;
            return expectedCallbackResult;
        });

        expect(afterProcessVariable).toBeUndefined();
        expect(JSON.stringify(d)).toBe('{}');
        var result = RiverIO.invokeProcessCallback(RiverIO.AFTER_PROCESS, expectedCurrentStateId, expectedNextStateId);
        expect(result.length).toBe(2);
        expect(result[0]).toBeTruthy();
        expect(result[1].length).toBe(1);
        expect(result[1][0]).toBe(expectedCallbackResult);
        expect(afterProcessVariable).toBe(expectedAfterProcessVariable);
        expect(JSON.stringify(d)).toBe(
            JSON.stringify({
                               type: RiverIO.AFTER_PROCESS,
                               currentStateId: expectedCurrentStateId,
                               nextStateId: expectedNextStateId,
                               contentTypeId: undefined,
                               objectId: undefined,
                               fieldId: undefined,
                               callback: undefined
                           }));

        expect(redirected).toBeFalsy();
    });
    it('Process Transition Without Invoke Callback Function', function () {
        redirected = false;

        expect(RiverIO.PROCESS_CALLBACK_EVENTS.length).toBe(2);
        expect(RiverIO.PROCESS_CALLBACK_EVENTS[0].type).toBe(RiverIO.BEFORE_PROCESS);
        expect(RiverIO.PROCESS_CALLBACK_EVENTS[1].type).toBe(RiverIO.AFTER_PROCESS);
        expect(RiverIO.WAITING_TRANSITION_PROCESSES.length).toBe(0);

        RiverIO.processTransition(RiverIO.APPROVE, expectedCallbackUri, expectedContentTypeId, expectedObjectId, expectedFieldId, expectedNextStateId);
        expect(RiverIO.WAITING_TRANSITION_PROCESSES.length).toBe(1);

        expect(redirected).toBeFalsy();

    });
    it('Process Transition With Invoke Before Callback Function', function () {
        redirected = false;

        RiverIO.registerProcessCallBack(RiverIO.BEFORE_PROCESS, expectedCurrentStateId, expectedNextStateId, function (data) {
            data.callback();
        });
        expect(RiverIO.PROCESS_CALLBACK_EVENTS.length).toBe(2);
        expect(RiverIO.PROCESS_CALLBACK_EVENTS[0].type).toBe(RiverIO.BEFORE_PROCESS);
        expect(RiverIO.PROCESS_CALLBACK_EVENTS[1].type).toBe(RiverIO.AFTER_PROCESS);

        RiverIO.processTransition(RiverIO.APPROVE, expectedCallbackUri, expectedContentTypeId, expectedObjectId, expectedFieldId, expectedNextStateId);

        expect(RiverIO.WAITING_TRANSITION_PROCESSES.length).toBe(0);
        expect(redirected).toBeFalsy();
    });

    it('Process Transition With Invoke After Callback Function', function () {
        redirected = false;

        RiverIO.registerProcessCallBack(RiverIO.AFTER_PROCESS, expectedCurrentStateId, expectedNextStateId, function (data) {
            data.callback();
        });
        expect(RiverIO.PROCESS_CALLBACK_EVENTS.length).toBe(2);
        expect(RiverIO.PROCESS_CALLBACK_EVENTS[0].type).toBe(RiverIO.BEFORE_PROCESS);
        expect(RiverIO.PROCESS_CALLBACK_EVENTS[1].type).toBe(RiverIO.AFTER_PROCESS);

        RiverIO.processTransition(RiverIO.APPROVE, expectedCallbackUri, expectedContentTypeId, expectedObjectId, expectedFieldId, expectedNextStateId);

        expect(RiverIO.WAITING_TRANSITION_PROCESSES.length).toBe(0);
        expect(redirected).toBeTruthy();
    });

    it('Process Transition With No Before and After Callback Function', function () {
        redirected = false;
        RiverIO.PROCESS_CALLBACK_EVENTS = [];
        expect(RiverIO.WAITING_TRANSITION_PROCESSES.length).toBe(0);
        RiverIO.processTransition(RiverIO.APPROVE, expectedCallbackUri, expectedContentTypeId, expectedObjectId, expectedFieldId, expectedNextStateId);
        expect(RiverIO.WAITING_TRANSITION_PROCESSES.length).toBe(0);
        expect(redirected).toBeTruthy();
    });
});
