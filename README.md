# River.IO Javascipt Client  [![Build Status](https://travis-ci.org/javrasya/river.io-javascript_client.svg?branch=master)](https://travis-ci.org/javrasya/river.io-javascript_client)


RiverIO has javascript client, which you can do some RiverIO actions. It also provides hooking before and after transition. This means, anything custom can be done before the transition approved. This makes user more flexible.


There are some action you can do on River.IO with this javascript library. Here are some of them;
* Getting a state by label
* Getting current state of an object
* Getting available next states of an object
* Process Transition (Approve or Reject)
* Skip Transition

There is most significant functionality in this library which is hooking before and after a transition process. You can have custom callback function before or after the transition. Here is its usage;

		<script src="/path_to_your_js/daw_client.js" type="text/javascript"></script>
	    <script type="text/javascript">
	        RiverIO.GETTING_CURRENT_STATE_URI = "{% url 'daw.views.get_current_state' '$0' '$1' '$2'%}".replace(/%24/g, '$');
	        RiverIO.APPROVE_TRANSITION_URI = "{% url 'daw.views.approve_transition_view' '$0' '$1' '$2' '$3' %}".replace(/%24/g, '$');
	        RiverIO.REJECT_TRANSITION_URI = "{% url 'daw.views.reject_transition_view' '$0' '$1' '$2' '$3' %}".replace(/%24/g, '$');
	        RiverIO.GET_STATE_BY_LABEL_URI = "{% url 'daw.views.get_state_by_label' '$0' %}".replace(/%24/g, '$');
	        RiverIO.SKIP_TRANSITION_URI = "{% url 'daw.views.skip_transition' '$0' '$1' '$2' %}".replace(/%24/g, '$');
	        RiverIO.TOKEN='My River IO Application Token'

	        RiverIO.registerProcessCallBack(RiverIO.BEFORE_PROCESS, RiverIO.getStateByLabel('s1').id, RiverIO.getStateByLabel('s2').id, function (data) {
	            alert('Before Done!');
	            data.callback();
	        });
	        RiverIO.registerProcessCallBack(RiverIO.AFTER_PROCESS, RiverIO.getStateByLabel('s1').id, RiverIO.getStateByLabel('s2').id, function (data) {
	            alert('After Done!');
	            data.callback();
	        });
    </script>

First of all, we must define some urls for RiverIO javascript client. At the top of our script consists of the definitions.

There is a registration you see under the definition. With this piece of code, we told the javascript client, "When you are processing the transition has source state **s1** and destionation state **s2**, just call my callback function before you do it". My callback function will alert "Before Done!" text. We also registered for after processes as you see. 

On this registration t**here is a few things are very imporant**. RiverIO dispatchs a function to your custom callback function which you have to invoke it at the end of your callback function. If you don't, RiverIO javascript client won't complete your transition processes. RiverIO is letting you complete of transition process. This must be like this. Because, RiverIO can't now know, when did you callback function really ended. You might want to pass the transition completion function to another function. This is like this because of this reason. So, you don't have to do your things in one block. You have the transition process completion callback function. Invoke it whenever you want. 

It is not important same as AFTER_PROCESSES registration. If you invoke the function that is sent by RiverIO to your custom after callback, the page will be refreshed. You don't have to invoke it. But otherwise, you will have to handle the after transition processes somehow. It is under your control.

A json is sent to your custom callback function by RiverIO Javascript client. The json contains;

*	**contentTypeId** :		Content type id of the processed object.
*	**objectId**:				Object id of the processed object.
* 	**fieldId**:				State field name of the processed object.
*  **callback**:				Callback function which you must invoke at the end of your custom callback function.