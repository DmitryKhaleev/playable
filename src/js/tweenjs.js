var createjs={};createjs.extend=function(subclass,superclass){"use strict";function o(){this.constructor=subclass}
    o.prototype=superclass.prototype;return(subclass.prototype=new o())};createjs.promote=function(subclass,prefix){"use strict";var subP=subclass.prototype,supP=(Object.getPrototypeOf&&Object.getPrototypeOf(subP))||subP.__proto__;if(supP){subP[(prefix+="_")+"constructor"]=supP.constructor;for(var n in supP){if(subP.hasOwnProperty(n)&&(typeof supP[n]=="function")){subP[prefix+n]=supP[n]}}}
    return subclass};createjs.deprecate=function(fallbackMethod,name){"use strict";return function(){var msg="Deprecated property or method '"+name+"'. See docs for info.";console&&(console.warn?console.warn(msg):console.log(msg));return fallbackMethod&&fallbackMethod.apply(this,arguments)}};(function(){"use strict";function Event(type,bubbles,cancelable){this.type=type;this.target=null;this.currentTarget=null;this.eventPhase=0;this.bubbles=!!bubbles;this.cancelable=!!cancelable;this.timeStamp=(new Date()).getTime();this.defaultPrevented=!1;this.propagationStopped=!1;this.immediatePropagationStopped=!1;this.removed=!1}
    var p=Event.prototype;p.preventDefault=function(){this.defaultPrevented=this.cancelable&&!0};p.stopPropagation=function(){this.propagationStopped=!0};p.stopImmediatePropagation=function(){this.immediatePropagationStopped=this.propagationStopped=!0};p.remove=function(){this.removed=!0};p.clone=function(){return new Event(this.type,this.bubbles,this.cancelable)};p.set=function(props){for(var n in props){this[n]=props[n]}
        return this};p.toString=function(){return"[Event (type="+this.type+")]"};createjs.Event=Event}());(function(){"use strict";function EventDispatcher(){this._listeners=null;this._captureListeners=null}
    var p=EventDispatcher.prototype;EventDispatcher.initialize=function(target){target.addEventListener=p.addEventListener;target.on=p.on;target.removeEventListener=target.off=p.removeEventListener;target.removeAllEventListeners=p.removeAllEventListeners;target.hasEventListener=p.hasEventListener;target.dispatchEvent=p.dispatchEvent;target._dispatchEvent=p._dispatchEvent;target.willTrigger=p.willTrigger};p.addEventListener=function(type,listener,useCapture){var listeners;if(useCapture){listeners=this._captureListeners=this._captureListeners||{}}else{listeners=this._listeners=this._listeners||{}}
        var arr=listeners[type];if(arr){this.removeEventListener(type,listener,useCapture)}
        arr=listeners[type];if(!arr){listeners[type]=[listener]}
        else{arr.push(listener)}
        return listener};p.on=function(type,listener,scope,once,data,useCapture){if(listener.handleEvent){scope=scope||listener;listener=listener.handleEvent}
        scope=scope||this;return this.addEventListener(type,function(evt){listener.call(scope,evt,data);once&&evt.remove()},useCapture)};p.removeEventListener=function(type,listener,useCapture){var listeners=useCapture?this._captureListeners:this._listeners;if(!listeners){return}
        var arr=listeners[type];if(!arr){return}
        for(var i=0,l=arr.length;i<l;i++){if(arr[i]==listener){if(l==1){delete(listeners[type])}
        else{arr.splice(i,1)}
            break}}};p.off=p.removeEventListener;p.removeAllEventListeners=function(type){if(!type){this._listeners=this._captureListeners=null}
    else{if(this._listeners){delete(this._listeners[type])}
        if(this._captureListeners){delete(this._captureListeners[type])}}};p.dispatchEvent=function(eventObj,bubbles,cancelable){if(typeof eventObj=="string"){var listeners=this._listeners;if(!bubbles&&(!listeners||!listeners[eventObj])){return!0}
        eventObj=new createjs.Event(eventObj,bubbles,cancelable)}else if(eventObj.target&&eventObj.clone){eventObj=eventObj.clone()}
        try{eventObj.target=this}catch(e){}
        if(!eventObj.bubbles||!this.parent){this._dispatchEvent(eventObj,2)}else{var top=this,list=[top];while(top.parent){list.push(top=top.parent)}
            var i,l=list.length;for(i=l-1;i>=0&&!eventObj.propagationStopped;i--){list[i]._dispatchEvent(eventObj,1+(i==0))}
            for(i=1;i<l&&!eventObj.propagationStopped;i++){list[i]._dispatchEvent(eventObj,3)}}
        return!eventObj.defaultPrevented};p.hasEventListener=function(type){var listeners=this._listeners,captureListeners=this._captureListeners;return!!((listeners&&listeners[type])||(captureListeners&&captureListeners[type]))};p.willTrigger=function(type){var o=this;while(o){if(o.hasEventListener(type)){return!0}
        o=o.parent}
        return!1};p.toString=function(){return"[EventDispatcher]"};p._dispatchEvent=function(eventObj,eventPhase){var l,arr,listeners=(eventPhase<=2)?this._captureListeners:this._listeners;if(eventObj&&listeners&&(arr=listeners[eventObj.type])&&(l=arr.length)){try{eventObj.currentTarget=this}catch(e){}
        try{eventObj.eventPhase=eventPhase|0}catch(e){}
        eventObj.removed=!1;arr=arr.slice();for(var i=0;i<l&&!eventObj.immediatePropagationStopped;i++){var o=arr[i];if(o.handleEvent){o.handleEvent(eventObj)}
        else{o(eventObj)}
            if(eventObj.removed){this.off(eventObj.type,o,eventPhase==1);eventObj.removed=!1}}}
        if(eventPhase===2){this._dispatchEvent(eventObj,2.1)}};createjs.EventDispatcher=EventDispatcher}());(function(){"use strict";function Ticker(){throw "Ticker cannot be instantiated."}
    Ticker.RAF_SYNCHED="synched";Ticker.RAF="raf";Ticker.TIMEOUT="timeout";Ticker.timingMode=null;Ticker.maxDelta=0;Ticker.paused=!1;Ticker.removeEventListener=null;Ticker.removeAllEventListeners=null;Ticker.dispatchEvent=null;Ticker.hasEventListener=null;Ticker._listeners=null;createjs.EventDispatcher.initialize(Ticker);Ticker._addEventListener=Ticker.addEventListener;Ticker.addEventListener=function(){!Ticker._inited&&Ticker.init();return Ticker._addEventListener.apply(Ticker,arguments)};Ticker._inited=!1;Ticker._startTime=0;Ticker._pausedTime=0;Ticker._ticks=0;Ticker._pausedTicks=0;Ticker._interval=50;Ticker._lastTime=0;Ticker._times=null;Ticker._tickTimes=null;Ticker._timerId=null;Ticker._raf=!0;Ticker._setInterval=function(interval){Ticker._interval=interval;if(!Ticker._inited){return}
        Ticker._setupTick()};Ticker.setInterval=createjs.deprecate(Ticker._setInterval,"Ticker.setInterval");Ticker._getInterval=function(){return Ticker._interval};Ticker.getInterval=createjs.deprecate(Ticker._getInterval,"Ticker.getInterval");Ticker._setFPS=function(value){Ticker._setInterval(1000/value)};Ticker.setFPS=createjs.deprecate(Ticker._setFPS,"Ticker.setFPS");Ticker._getFPS=function(){return 1000/Ticker._interval};Ticker.getFPS=createjs.deprecate(Ticker._getFPS,"Ticker.getFPS");try{Object.defineProperties(Ticker,{interval:{get:Ticker._getInterval,set:Ticker._setInterval},framerate:{get:Ticker._getFPS,set:Ticker._setFPS}})}catch(e){console.log(e)}
    Ticker.init=function(){if(Ticker._inited){return}
        Ticker._inited=!0;Ticker._times=[];Ticker._tickTimes=[];Ticker._startTime=Ticker._getTime();Ticker._times.push(Ticker._lastTime=0);Ticker.interval=Ticker._interval};Ticker.reset=function(){if(Ticker._raf){var f=window.cancelAnimationFrame||window.webkitCancelAnimationFrame||window.mozCancelAnimationFrame||window.oCancelAnimationFrame||window.msCancelAnimationFrame;f&&f(Ticker._timerId)}else{clearTimeout(Ticker._timerId)}
        Ticker.removeAllEventListeners("tick");Ticker._timerId=Ticker._times=Ticker._tickTimes=null;Ticker._startTime=Ticker._lastTime=Ticker._ticks=Ticker._pausedTime=0;Ticker._inited=!1};Ticker.getMeasuredTickTime=function(ticks){var ttl=0,times=Ticker._tickTimes;if(!times||times.length<1){return-1}
        ticks=Math.min(times.length,ticks||(Ticker._getFPS()|0));for(var i=0;i<ticks;i++){ttl+=times[i]}
        return ttl/ticks};Ticker.getMeasuredFPS=function(ticks){var times=Ticker._times;if(!times||times.length<2){return-1}
        ticks=Math.min(times.length-1,ticks||(Ticker._getFPS()|0));return 1000/((times[0]-times[ticks])/ticks)};Ticker.getTime=function(runTime){return Ticker._startTime?Ticker._getTime()-(runTime?Ticker._pausedTime:0):-1};Ticker.getEventTime=function(runTime){return Ticker._startTime?(Ticker._lastTime||Ticker._startTime)-(runTime?Ticker._pausedTime:0):-1};Ticker.getTicks=function(pauseable){return Ticker._ticks-(pauseable?Ticker._pausedTicks:0)};Ticker._handleSynch=function(){Ticker._timerId=null;Ticker._setupTick();if(Ticker._getTime()-Ticker._lastTime>=(Ticker._interval-1)*0.97){Ticker._tick()}};Ticker._handleRAF=function(){Ticker._timerId=null;Ticker._setupTick();Ticker._tick()};Ticker._handleTimeout=function(){Ticker._timerId=null;Ticker._setupTick();Ticker._tick()};Ticker._setupTick=function(){if(Ticker._timerId!=null){return}
        var mode=Ticker.timingMode;if(mode==Ticker.RAF_SYNCHED||mode==Ticker.RAF){var f=window.requestAnimationFrame||window.webkitRequestAnimationFrame||window.mozRequestAnimationFrame||window.oRequestAnimationFrame||window.msRequestAnimationFrame;if(f){Ticker._timerId=f(mode==Ticker.RAF?Ticker._handleRAF:Ticker._handleSynch);Ticker._raf=!0;return}}
        Ticker._raf=!1;Ticker._timerId=setTimeout(Ticker._handleTimeout,Ticker._interval)};Ticker._tick=function(){var paused=Ticker.paused;var time=Ticker._getTime();var elapsedTime=time-Ticker._lastTime;Ticker._lastTime=time;Ticker._ticks++;if(paused){Ticker._pausedTicks++;Ticker._pausedTime+=elapsedTime}
        if(Ticker.hasEventListener("tick")){var event=new createjs.Event("tick");var maxDelta=Ticker.maxDelta;event.delta=(maxDelta&&elapsedTime>maxDelta)?maxDelta:elapsedTime;event.paused=paused;event.time=time;event.runTime=time-Ticker._pausedTime;Ticker.dispatchEvent(event)}
        Ticker._tickTimes.unshift(Ticker._getTime()-time);while(Ticker._tickTimes.length>100){Ticker._tickTimes.pop()}
        Ticker._times.unshift(time);while(Ticker._times.length>100){Ticker._times.pop()}};var w=window,now=w.performance.now||w.performance.mozNow||w.performance.msNow||w.performance.oNow||w.performance.webkitNow;Ticker._getTime=function(){return((now&&now.call(w.performance))||(new Date().getTime()))-Ticker._startTime};createjs.Ticker=Ticker}());(function(){"use strict";function AbstractTween(props){this.EventDispatcher_constructor();this.ignoreGlobalPause=!1;this.loop=0;this.useTicks=!1;this.reversed=!1;this.bounce=!1;this.timeScale=1;this.duration=0;this.position=0;this.rawPosition=-1;this._paused=!0;this._next=null;this._prev=null;this._parent=null;this._labels=null;this._labelList=null;if(props){this.useTicks=!!props.useTicks;this.ignoreGlobalPause=!!props.ignoreGlobalPause;this.loop=props.loop===!0?-1:(props.loop||0);this.reversed=!!props.reversed;this.bounce=!!props.bounce;this.timeScale=props.timeScale||1;props.onChange&&this.addEventListener("change",props.onChange);props.onComplete&&this.addEventListener("complete",props.onComplete)}};var p=createjs.extend(AbstractTween,createjs.EventDispatcher);p._setPaused=function(value){createjs.Tween._register(this,value);return this};p.setPaused=createjs.deprecate(p._setPaused,"AbstractTween.setPaused");p._getPaused=function(){return this._paused};p.getPaused=createjs.deprecate(p._getPaused,"AbstactTween.getPaused");p._getCurrentLabel=function(pos){var labels=this.getLabels();if(pos==null){pos=this.position}
    for(var i=0,l=labels.length;i<l;i++){if(pos<labels[i].position){break}}
    return(i===0)?null:labels[i-1].label};p.getCurrentLabel=createjs.deprecate(p._getCurrentLabel,"AbstractTween.getCurrentLabel");try{Object.defineProperties(p,{paused:{set:p._setPaused,get:p._getPaused},currentLabel:{get:p._getCurrentLabel}})}catch(e){}
    p.advance=function(delta,ignoreActions){this.setPosition(this.rawPosition+delta*this.timeScale,ignoreActions)};p.setPosition=function(rawPosition,ignoreActions,jump,callback){var d=this.duration,loopCount=this.loop,prevRawPos=this.rawPosition;var loop=0,t=0,end=!1;if(rawPosition<0){rawPosition=0}
        if(d===0){end=!0;if(prevRawPos!==-1){return end}}else{loop=rawPosition/d|0;t=rawPosition-loop*d;end=(loopCount!==-1&&rawPosition>=loopCount*d+d);if(end){rawPosition=(t=d)*(loop=loopCount)+d}
            if(rawPosition===prevRawPos){return end}
            var rev=!this.reversed!==!(this.bounce&&loop%2);if(rev){t=d-t}}
        this.position=t;this.rawPosition=rawPosition;this._updatePosition(jump,end);if(end){this.paused=!0}
        callback&&callback(this);if(!ignoreActions){this._runActions(prevRawPos,rawPosition,jump,!jump&&prevRawPos===-1)}
        this.dispatchEvent("change");if(end){this.dispatchEvent("complete")}};p.calculatePosition=function(rawPosition){var d=this.duration,loopCount=this.loop,loop=0,t=0;if(d===0){return 0}
        if(loopCount!==-1&&rawPosition>=loopCount*d+d){t=d;loop=loopCount}
        else if(rawPosition<0){t=0}
        else{loop=rawPosition/d|0;t=rawPosition-loop*d}
        var rev=!this.reversed!==!(this.bounce&&loop%2);return rev?d-t:t};p.getLabels=function(){var list=this._labelList;if(!list){list=this._labelList=[];var labels=this._labels;for(var n in labels){list.push({label:n,position:labels[n]})}
        list.sort(function(a,b){return a.position-b.position})}
        return list};p.setLabels=function(labels){this._labels=labels;this._labelList=null};p.addLabel=function(label,position){if(!this._labels){this._labels={}}
        this._labels[label]=position;var list=this._labelList;if(list){for(var i=0,l=list.length;i<l;i++){if(position<list[i].position){break}}
            list.splice(i,0,{label:label,position:position})}};p.gotoAndPlay=function(positionOrLabel){this.paused=!1;this._goto(positionOrLabel)};p.gotoAndStop=function(positionOrLabel){this.paused=!0;this._goto(positionOrLabel)};p.resolve=function(positionOrLabel){var pos=Number(positionOrLabel);if(isNaN(pos)){pos=this._labels&&this._labels[positionOrLabel]}
        return pos};p.toString=function(){return"[AbstractTween]"};p.clone=function(){throw("AbstractTween can not be cloned.")};p._init=function(props){if(!props||!props.paused){this.paused=!1}
        if(props&&(props.position!=null)){this.setPosition(props.position)}};p._updatePosition=function(jump,end){};p._goto=function(positionOrLabel){var pos=this.resolve(positionOrLabel);if(pos!=null){this.setPosition(pos,!1,!0)}};p._runActions=function(startRawPos,endRawPos,jump,includeStart){if(!this._actionHead&&!this.tweens){return}
        var d=this.duration,reversed=this.reversed,bounce=this.bounce,loopCount=this.loop;var loop0,loop1,t0,t1;if(d===0){loop0=loop1=t0=t1=0;reversed=bounce=!1}else{loop0=startRawPos/d|0;loop1=endRawPos/d|0;t0=startRawPos-loop0*d;t1=endRawPos-loop1*d}
        if(loopCount!==-1){if(loop1>loopCount){t1=d;loop1=loopCount}
            if(loop0>loopCount){t0=d;loop0=loopCount}}
        if(jump){return this._runActionsRange(t1,t1,jump,includeStart)}
        else if(loop0===loop1&&t0===t1&&!jump&&!includeStart){return}
        else if(loop0===-1){loop0=t0=0}
        var dir=(startRawPos<=endRawPos),loop=loop0;do{var rev=!reversed!==!(bounce&&loop%2);var start=(loop===loop0)?t0:dir?0:d;var end=(loop===loop1)?t1:dir?d:0;if(rev){start=d-start;end=d-end}
            if(bounce&&loop!==loop0&&start===end){}
            else if(this._runActionsRange(start,end,jump,includeStart||(loop!==loop0&&!bounce))){return!0}
            includeStart=!1}while((dir&&++loop<=loop1)||(!dir&&--loop>=loop1));};p._runActionsRange=function(startPos,endPos,jump,includeStart){};createjs.AbstractTween=createjs.promote(AbstractTween,"EventDispatcher")}());(function(){"use strict";function Tween(target,props){this.AbstractTween_constructor(props);this.pluginData=null;this.target=target;this.passive=!1;this._stepHead=new TweenStep(null,0,0,{},null,!0);this._stepTail=this._stepHead;this._stepPosition=0;this._actionHead=null;this._actionTail=null;this._plugins=null;this._pluginIds=null;this._injected=null;if(props){this.pluginData=props.pluginData;if(props.override){Tween.removeTweens(target)}}
    if(!this.pluginData){this.pluginData={}}
    this._init(props)};var p=createjs.extend(Tween,createjs.AbstractTween);Tween.IGNORE={};Tween._tweens=[];Tween._plugins=null;Tween._tweenHead=null;Tween._tweenTail=null;Tween.get=function(target,props){return new Tween(target,props)};Tween.tick=function(delta,paused){var tween=Tween._tweenHead;while(tween){var next=tween._next;if((paused&&!tween.ignoreGlobalPause)||tween._paused){}
else{tween.advance(tween.useTicks?1:delta)}
    tween=next}};Tween.handleEvent=function(event){if(event.type==="tick"){this.tick(event.delta,event.paused)}};Tween.removeTweens=function(target){if(!target.tweenjs_count){return}
    var tween=Tween._tweenHead;while(tween){var next=tween._next;if(tween.target===target){Tween._register(tween,!0)}
        tween=next}
    target.tweenjs_count=0};Tween.removeAllTweens=function(){var tween=Tween._tweenHead;while(tween){var next=tween._next;tween._paused=!0;tween.target&&(tween.target.tweenjs_count=0);tween._next=tween._prev=null;tween=next}
    Tween._tweenHead=Tween._tweenTail=null};Tween.hasActiveTweens=function(target){if(target){return!!target.tweenjs_count}
    return!!Tween._tweenHead};Tween._installPlugin=function(plugin){var priority=(plugin.priority=plugin.priority||0),arr=(Tween._plugins=Tween._plugins||[]);for(var i=0,l=arr.length;i<l;i++){if(priority<arr[i].priority){break}}
    arr.splice(i,0,plugin)};Tween._register=function(tween,paused){var target=tween.target;if(!paused&&tween._paused){if(target){target.tweenjs_count=target.tweenjs_count?target.tweenjs_count+1:1}
    var tail=Tween._tweenTail;if(!tail){Tween._tweenHead=Tween._tweenTail=tween}
    else{Tween._tweenTail=tail._next=tween;tween._prev=tail}
    if(!Tween._inited&&createjs.Ticker){createjs.Ticker.framerate=60;createjs.Ticker.addEventListener("tick",Tween);Tween._inited=!0}}else if(paused&&!tween._paused){if(target){target.tweenjs_count--}
    var next=tween._next,prev=tween._prev;if(next){next._prev=prev}
    else{Tween._tweenTail=prev}
    if(prev){prev._next=next}
    else{Tween._tweenHead=next}
    tween._next=tween._prev=null}
    tween._paused=paused};p.wait=function(duration,passive){if(duration>0){this._addStep(+duration,this._stepTail.props,null,passive)}
    return this};p.to=function(props,duration,ease){if(duration==null||duration<0){duration=0}
    var step=this._addStep(+duration,null,ease);this._appendProps(props,step);return this};p.label=function(name){this.addLabel(name,this.duration);return this};p.call=function(callback,params,scope){return this._addAction(scope||this.target,callback,params||[this])};p.set=function(props,target){return this._addAction(target||this.target,this._set,[props])};p.play=function(tween){return this._addAction(tween||this,this._set,[{paused:!1}])};p.pause=function(tween){return this._addAction(tween||this,this._set,[{paused:!0}])};p.w=p.wait;p.t=p.to;p.c=p.call;p.s=p.set;p.toString=function(){return"[Tween]"};p.clone=function(){throw("Tween can not be cloned.")};p._addPlugin=function(plugin){var ids=this._pluginIds||(this._pluginIds={}),id=plugin.ID;if(!id||ids[id]){return}
    ids[id]=!0;var plugins=this._plugins||(this._plugins=[]),priority=plugin.priority||0;for(var i=0,l=plugins.length;i<l;i++){if(priority<plugins[i].priority){plugins.splice(i,0,plugin);return}}
    plugins.push(plugin)};p._updatePosition=function(jump,end){var step=this._stepHead.next,t=this.position,d=this.duration;if(this.target&&step){var stepNext=step.next;while(stepNext&&stepNext.t<=t){step=step.next;stepNext=step.next}
    var ratio=end?d===0?1:t/d:(t-step.t)/step.d;this._updateTargetProps(step,ratio,end)}
    this._stepPosition=step?t-step.t:0};p._updateTargetProps=function(step,ratio,end){if(this.passive=!!step.passive){return}
    var v,v0,v1,ease;var p0=step.prev.props;var p1=step.props;if(ease=step.ease){ratio=ease(ratio,0,1,1)}
    var plugins=this._plugins;proploop:for(var n in p0){v0=p0[n];v1=p1[n];if(v0!==v1&&(typeof(v0)==="number")){v=v0+(v1-v0)*ratio}else{v=ratio>=1?v1:v0}
        if(plugins){for(var i=0,l=plugins.length;i<l;i++){var value=plugins[i].change(this,step,n,v,ratio,end);if(value===Tween.IGNORE){continue proploop}
            if(value!==undefined){v=value}}}
        this.target[n]=v}};p._runActionsRange=function(startPos,endPos,jump,includeStart){var rev=startPos>endPos;var action=rev?this._actionTail:this._actionHead;var ePos=endPos,sPos=startPos;if(rev){ePos=startPos;sPos=endPos}
    var t=this.position;while(action){var pos=action.t;if(pos===endPos||(pos>sPos&&pos<ePos)||(includeStart&&pos===startPos)){action.funct.apply(action.scope,action.params);if(t!==this.position){return!0}}
        action=rev?action.prev:action.next}};p._appendProps=function(props,step,stepPlugins){var initProps=this._stepHead.props,target=this.target,plugins=Tween._plugins;var n,i,value,initValue,inject;var oldStep=step.prev,oldProps=oldStep.props;var stepProps=step.props||(step.props=this._cloneProps(oldProps));var cleanProps={};for(n in props){if(!props.hasOwnProperty(n)){continue}
    cleanProps[n]=stepProps[n]=props[n];if(initProps[n]!==undefined){continue}
    initValue=undefined;if(plugins){for(i=plugins.length-1;i>=0;i--){value=plugins[i].init(this,n,initValue);if(value!==undefined){initValue=value}
        if(initValue===Tween.IGNORE){delete(stepProps[n]);delete(cleanProps[n]);break}}}
    if(initValue!==Tween.IGNORE){if(initValue===undefined){initValue=target[n]}
        oldProps[n]=(initValue===undefined)?null:initValue}}
    for(n in cleanProps){value=props[n];var o,prev=oldStep;while((o=prev)&&(prev=o.prev)){if(prev.props===o.props){continue}
        if(prev.props[n]!==undefined){break}
        prev.props[n]=oldProps[n]}}
    if(stepPlugins!==!1&&(plugins=this._plugins)){for(i=plugins.length-1;i>=0;i--){plugins[i].step(this,step,cleanProps)}}
    if(inject=this._injected){this._injected=null;this._appendProps(inject,step,!1)}};p._injectProp=function(name,value){var o=this._injected||(this._injected={});o[name]=value};p._addStep=function(duration,props,ease,passive){var step=new TweenStep(this._stepTail,this.duration,duration,props,ease,passive||!1);this.duration+=duration;return this._stepTail=(this._stepTail.next=step)};p._addAction=function(scope,funct,params){var action=new TweenAction(this._actionTail,this.duration,scope,funct,params);if(this._actionTail){this._actionTail.next=action}
else{this._actionHead=action}
    this._actionTail=action;return this};p._set=function(props){for(var n in props){this[n]=props[n]}};p._cloneProps=function(props){var o={};for(var n in props){o[n]=props[n]}
    return o};createjs.Tween=createjs.promote(Tween,"AbstractTween");function TweenStep(prev,t,d,props,ease,passive){this.next=null;this.prev=prev;this.t=t;this.d=d;this.props=props;this.ease=ease;this.passive=passive;this.index=prev?prev.index+1:0};function TweenAction(prev,t,scope,funct,params){this.next=null;this.prev=prev;this.t=t;this.d=0;this.scope=scope;this.funct=funct;this.params=params}}());(function(){"use strict";function Timeline(props){var tweens,labels;if(props instanceof Array||(props==null&&arguments.length>1)){tweens=props;labels=arguments[1];props=arguments[2]}else if(props){tweens=props.tweens;labels=props.labels}
    this.AbstractTween_constructor(props);this.tweens=[];if(tweens){this.addTween.apply(this,tweens)}
    this.setLabels(labels);this._init(props)};var p=createjs.extend(Timeline,createjs.AbstractTween);p.addTween=function(tween){if(tween._parent){tween._parent.removeTween(tween)}
    var l=arguments.length;if(l>1){for(var i=0;i<l;i++){this.addTween(arguments[i])}
        return arguments[l-1]}else if(l===0){return null}
    this.tweens.push(tween);tween._parent=this;tween.paused=!0;var d=tween.duration;if(tween.loop>0){d*=tween.loop+1}
    if(d>this.duration){this.duration=d}
    if(this.rawPosition>=0){tween.setPosition(this.rawPosition)}
    return tween};p.removeTween=function(tween){var l=arguments.length;if(l>1){var good=!0;for(var i=0;i<l;i++){good=good&&this.removeTween(arguments[i])}
    return good}else if(l===0){return!0}
    var tweens=this.tweens;var i=tweens.length;while(i--){if(tweens[i]===tween){tweens.splice(i,1);tween._parent=null;if(tween.duration>=this.duration){this.updateDuration()}
        return!0}}
    return!1};p.updateDuration=function(){this.duration=0;for(var i=0,l=this.tweens.length;i<l;i++){var tween=this.tweens[i];var d=tween.duration;if(tween.loop>0){d*=tween.loop+1}
    if(d>this.duration){this.duration=d}}};p.toString=function(){return"[Timeline]"};p.clone=function(){throw("Timeline can not be cloned.")};p._updatePosition=function(jump,end){var t=this.position;for(var i=0,l=this.tweens.length;i<l;i++){this.tweens[i].setPosition(t,!0,jump)}};p._runActionsRange=function(startPos,endPos,jump,includeStart){var t=this.position;for(var i=0,l=this.tweens.length;i<l;i++){this.tweens[i]._runActions(startPos,endPos,jump,includeStart);if(t!==this.position){return!0}}};createjs.Timeline=createjs.promote(Timeline,"AbstractTween")}());(function(){"use strict";function Ease(){throw "Ease cannot be instantiated."}
    Ease.linear=function(t){return t};Ease.none=Ease.linear;Ease.get=function(amount){if(amount<-1){amount=-1}
    else if(amount>1){amount=1}
        return function(t){if(amount==0){return t}
            if(amount<0){return t*(t*-amount+1+amount)}
            return t*((2-t)*amount+(1-amount))}};Ease.getPowIn=function(pow){return function(t){return Math.pow(t,pow)}};Ease.getPowOut=function(pow){return function(t){return 1-Math.pow(1-t,pow)}};Ease.getPowInOut=function(pow){return function(t){if((t*=2)<1)return 0.5*Math.pow(t,pow);return 1-0.5*Math.abs(Math.pow(2-t,pow))}};Ease.quadIn=Ease.getPowIn(2);Ease.quadOut=Ease.getPowOut(2);Ease.quadInOut=Ease.getPowInOut(2);Ease.cubicIn=Ease.getPowIn(3);Ease.cubicOut=Ease.getPowOut(3);Ease.cubicInOut=Ease.getPowInOut(3);Ease.quartIn=Ease.getPowIn(4);Ease.quartOut=Ease.getPowOut(4);Ease.quartInOut=Ease.getPowInOut(4);Ease.quintIn=Ease.getPowIn(5);Ease.quintOut=Ease.getPowOut(5);Ease.quintInOut=Ease.getPowInOut(5);Ease.sineIn=function(t){return 1-Math.cos(t*Math.PI/2)};Ease.sineOut=function(t){return Math.sin(t*Math.PI/2)};Ease.sineInOut=function(t){return-0.5*(Math.cos(Math.PI*t)-1)};Ease.getBackIn=function(amount){return function(t){return t*t*((amount+1)*t-amount)}};Ease.backIn=Ease.getBackIn(1.7);Ease.getBackOut=function(amount){return function(t){return(--t*t*((amount+1)*t+amount)+1)}};Ease.backOut=Ease.getBackOut(1.7);Ease.getBackInOut=function(amount){amount*=1.525;return function(t){if((t*=2)<1)return 0.5*(t*t*((amount+1)*t-amount));return 0.5*((t-=2)*t*((amount+1)*t+amount)+2)}};Ease.backInOut=Ease.getBackInOut(1.7);Ease.circIn=function(t){return-(Math.sqrt(1-t*t)-1)};Ease.circOut=function(t){return Math.sqrt(1-(--t)*t)};Ease.circInOut=function(t){if((t*=2)<1)return-0.5*(Math.sqrt(1-t*t)-1);return 0.5*(Math.sqrt(1-(t-=2)*t)+1)};Ease.bounceIn=function(t){return 1-Ease.bounceOut(1-t)};Ease.bounceOut=function(t){if(t<1/2.75){return(7.5625*t*t)}else if(t<2/2.75){return(7.5625*(t-=1.5/2.75)*t+0.75)}else if(t<2.5/2.75){return(7.5625*(t-=2.25/2.75)*t+0.9375)}else{return(7.5625*(t-=2.625/2.75)*t+0.984375)}};Ease.bounceInOut=function(t){if(t<0.5)return Ease.bounceIn(t*2)*.5;return Ease.bounceOut(t*2-1)*0.5+0.5};Ease.getElasticIn=function(amplitude,period){var pi2=Math.PI*2;return function(t){if(t==0||t==1)return t;var s=period/pi2*Math.asin(1/amplitude);return-(amplitude*Math.pow(2,10*(t-=1))*Math.sin((t-s)*pi2/period))}};Ease.elasticIn=Ease.getElasticIn(1,0.3);Ease.getElasticOut=function(amplitude,period){var pi2=Math.PI*2;return function(t){if(t==0||t==1)return t;var s=period/pi2*Math.asin(1/amplitude);return(amplitude*Math.pow(2,-10*t)*Math.sin((t-s)*pi2/period)+1)}};Ease.elasticOut=Ease.getElasticOut(1,0.3);Ease.getElasticInOut=function(amplitude,period){var pi2=Math.PI*2;return function(t){var s=period/pi2*Math.asin(1/amplitude);if((t*=2)<1)return-0.5*(amplitude*Math.pow(2,10*(t-=1))*Math.sin((t-s)*pi2/period));return amplitude*Math.pow(2,-10*(t-=1))*Math.sin((t-s)*pi2/period)*0.5+1}};Ease.elasticInOut=Ease.getElasticInOut(1,0.3*1.5);createjs.Tween.Ease=Ease}());(function(){"use strict";function MotionGuidePlugin(){throw("MotionGuidePlugin cannot be instantiated.")}
    var s=MotionGuidePlugin;s.priority=0;s.ID="MotionGuide";s.install=function(){createjs.Tween._installPlugin(MotionGuidePlugin);return createjs.Tween.IGNORE};s.init=function(tween,prop,value){if(prop=="guide"){tween._addPlugin(s)}};s.step=function(tween,step,props){for(var n in props){if(n!=="guide"){continue}
        var guideData=step.props.guide;var error=s._solveGuideData(props.guide,guideData);guideData.valid=!error;var end=guideData.endData;tween._injectProp("x",end.x);tween._injectProp("y",end.y);if(error||!guideData.orient){break}
        var initRot=step.prev.props.rotation===undefined?(tween.target.rotation||0):step.prev.props.rotation;guideData.startOffsetRot=initRot-guideData.startData.rotation;if(guideData.orient=="fixed"){guideData.endAbsRot=end.rotation+guideData.startOffsetRot;guideData.deltaRotation=0}else{var finalRot=props.rotation===undefined?(tween.target.rotation||0):props.rotation;var deltaRot=(finalRot-guideData.endData.rotation)-guideData.startOffsetRot;var modRot=deltaRot%360;guideData.endAbsRot=finalRot;switch(guideData.orient){case "auto":guideData.deltaRotation=deltaRot;break;case "cw":guideData.deltaRotation=((modRot+360)%360)+(360*Math.abs((deltaRot/360)|0));break;case "ccw":guideData.deltaRotation=((modRot-360)%360)+(-360*Math.abs((deltaRot/360)|0));break}}
        tween._injectProp("rotation",guideData.endAbsRot)}};s.change=function(tween,step,prop,value,ratio,end){var guideData=step.props.guide;if(!guideData||(step.props===step.prev.props)||(guideData===step.prev.props.guide)){return}
        if((prop==="guide"&&!guideData.valid)||(prop=="x"||prop=="y")||(prop==="rotation"&&guideData.orient)){return createjs.Tween.IGNORE}
        s._ratioToPositionData(ratio,guideData,tween.target)};s.debug=function(guideData,ctx,higlight){guideData=guideData.guide||guideData;var err=s._findPathProblems(guideData);if(err){console.error("MotionGuidePlugin Error found: \n"+err)}
        if(!ctx){return err}
        var i;var path=guideData.path;var pathLength=path.length;var width=3;var length=9;ctx.save();ctx.lineCap="round";ctx.lineJoin="miter";ctx.beginPath();ctx.moveTo(path[0],path[1]);for(i=2;i<pathLength;i+=4){ctx.quadraticCurveTo(path[i],path[i+1],path[i+2],path[i+3])}
        ctx.strokeStyle="black";ctx.lineWidth=width*1.5;ctx.stroke();ctx.strokeStyle="white";ctx.lineWidth=width;ctx.stroke();ctx.closePath();var hiCount=higlight.length;if(higlight&&hiCount){var tempStore={};var tempLook={};s._solveGuideData(guideData,tempStore);for(var i=0;i<hiCount;i++){tempStore.orient="fixed";s._ratioToPositionData(higlight[i],tempStore,tempLook);ctx.beginPath();ctx.moveTo(tempLook.x,tempLook.y);ctx.lineTo(tempLook.x+Math.cos(tempLook.rotation*0.0174533)*length,tempLook.y+Math.sin(tempLook.rotation*0.0174533)*length);ctx.strokeStyle="black";ctx.lineWidth=width*1.5;ctx.stroke();ctx.strokeStyle="red";ctx.lineWidth=width;ctx.stroke();ctx.closePath()}}
        ctx.restore();return err};s._solveGuideData=function(source,storage){var err=undefined;if(err=s.debug(source)){return err}
        var path=storage.path=source.path;var orient=storage.orient=source.orient;storage.subLines=[];storage.totalLength=0;storage.startOffsetRot=0;storage.deltaRotation=0;storage.startData={ratio:0};storage.endData={ratio:1};storage.animSpan=1;var pathLength=path.length;var precision=10;var sx,sy,cx,cy,ex,ey,i,j,len,temp={};sx=path[0];sy=path[1];for(i=2;i<pathLength;i+=4){cx=path[i];cy=path[i+1];ex=path[i+2];ey=path[i+3];var subLine={weightings:[],estLength:0,portion:0};var subX=sx,subY=sy;for(j=1;j<=precision;j++){s._getParamsForCurve(sx,sy,cx,cy,ex,ey,j/precision,!1,temp);var dx=temp.x-subX,dy=temp.y-subY;len=Math.sqrt(dx*dx+dy*dy);subLine.weightings.push(len);subLine.estLength+=len;subX=temp.x;subY=temp.y}
            storage.totalLength+=subLine.estLength;for(j=0;j<precision;j++){len=subLine.estLength;subLine.weightings[j]=subLine.weightings[j]/len}
            storage.subLines.push(subLine);sx=ex;sy=ey}
        len=storage.totalLength;var l=storage.subLines.length;for(i=0;i<l;i++){storage.subLines[i].portion=storage.subLines[i].estLength/len}
        var startRatio=isNaN(source.start)?0:source.start;var endRatio=isNaN(source.end)?1:source.end;s._ratioToPositionData(startRatio,storage,storage.startData);s._ratioToPositionData(endRatio,storage,storage.endData);storage.startData.ratio=startRatio;storage.endData.ratio=endRatio;storage.animSpan=storage.endData.ratio-storage.startData.ratio};s._ratioToPositionData=function(ratio,guideData,output){var lineSegments=guideData.subLines;var i,l,t,test,target;var look=0;var precision=10;var effRatio=(ratio*guideData.animSpan)+guideData.startData.ratio;l=lineSegments.length;for(i=0;i<l;i++){test=lineSegments[i].portion;if(look+test>=effRatio){target=i;break}
        look+=test}
        if(target===undefined){target=l-1;look-=test}
        var subLines=lineSegments[target].weightings;var portion=test;l=subLines.length;for(i=0;i<l;i++){test=subLines[i]*portion;if(look+test>=effRatio){break}
            look+=test}
        target=(target*4)+2;t=(i/precision)+(((effRatio-look)/test)*(1/precision));var pathData=guideData.path;s._getParamsForCurve(pathData[target-2],pathData[target-1],pathData[target],pathData[target+1],pathData[target+2],pathData[target+3],t,guideData.orient,output);if(guideData.orient){if(ratio>=0.99999&&ratio<=1.00001&&guideData.endAbsRot!==undefined){output.rotation=guideData.endAbsRot}else{output.rotation+=guideData.startOffsetRot+(ratio*guideData.deltaRotation)}}
        return output};s._getParamsForCurve=function(sx,sy,cx,cy,ex,ey,t,orient,output){var inv=1-t;output.x=inv*inv*sx+2*inv*t*cx+t*t*ex;output.y=inv*inv*sy+2*inv*t*cy+t*t*ey;if(orient){output.rotation=57.2957795*Math.atan2((cy-sy)*inv+(ey-cy)*t,(cx-sx)*inv+(ex-cx)*t)}};s._findPathProblems=function(guideData){var path=guideData.path;var valueCount=(path&&path.length)||0;if(valueCount<6||(valueCount-2)%4){var message="\tCannot parse 'path' array due to invalid number of entries in path. ";message+="There should be an odd number of points, at least 3 points, and 2 entries per point (x & y). ";message+="See 'CanvasRenderingContext2D.quadraticCurveTo' for details as 'path' models a quadratic bezier.\n\n";message+="Only [ "+valueCount+" ] values found. Expected: "+Math.max(Math.ceil((valueCount-2)/4)*4+2,6);return message}
        for(var i=0;i<valueCount;i++){if(isNaN(path[i])){return"All data in path array must be numeric"}}
        var start=guideData.start;if(isNaN(start)&&!(start===undefined)){return"'start' out of bounds. Expected 0 to 1, got: "+start}
        var end=guideData.end;if(isNaN(end)&&(end!==undefined)){return"'end' out of bounds. Expected 0 to 1, got: "+end}
        var orient=guideData.orient;if(orient){if(orient!="fixed"&&orient!="auto"&&orient!="cw"&&orient!="ccw"){return'Invalid orientation value. Expected ["fixed", "auto", "cw", "ccw", undefined], got: '+orient}}
        return undefined};createjs.Tween.MotionGuidePlugin=MotionGuidePlugin}());(function(){"use strict";var s=createjs.TweenJS=createjs.TweenJS||{};s.version="1.0.0";s.buildDate="Thu, 14 Sep 2017 19:47:47 GMT"})();export default createjs.Tween