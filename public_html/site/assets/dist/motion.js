!function(t){"use strict";function e(){this._head=null,this._tail=null,this._length=0}e.prototype._createNewNode=function(t){var e=this;return{data:t,next:null,prev:null,remove:function(){null!==this.prev&&(this.prev.next=this.next),null!==this.next&&(this.next.prev=this.prev),e._head===this&&(e._head=this.next),e._tail===this&&(e._tail=this.prev),e._length--},prepend:function(t){if(e._head===this)return e.prepend(t);var n=e._createNewNode(t);return n.prev=this.prev,n.next=this,this.prev.next=n,this.prev=n,e._length++,n},append:function(t){if(e._tail===this)return e.append(t);var n=e._createNewNode(t);return n.prev=this,n.next=this.next,this.next.prev=n,this.next=n,e._length++,n}}},e.prototype.append=function(t){var e=this._createNewNode(t);return 0===this._length?(this._head=e,this._tail=e):(this._tail.next=e,e.prev=this._tail,this._tail=e),this._length++,e},e.prototype.prepend=function(t){var e=this._createNewNode(t);return null===this._head?this.append(t):(this._head.prev=e,e.next=this._head,this._head=e,this._length++,e)},e.prototype.item=function(t){if(t>=0&&t<this._length){for(var e=this._head;t--;)e=e.next;return e}},e.prototype.head=function(){return this._head},e.prototype.tail=function(){return this._tail},e.prototype.size=function(){return this._length},e.prototype.remove=function(t){throw"Not implemented"},t.DoublyLinkedList=e}("undefined"==typeof exports?this.DLL={}:exports);
class Rect{constructor(t,i){this.width=t,this.height=i,this.ratio=t/i}contain(t){let i={};return t.ratio>this.ratio?(i.width=this.width,i.height=Math.round(this.width/t.ratio)):(i.width=Math.round(this.height*t.ratio),i.height=this.height),Rect.createFromObject(i)}containBigger(t){let i=this.contain(t);return i.width>t.width||i.height>t.height?t:i}}Rect.createFromNode=function(t){return new Rect(t.offsetWidth,t.offsetHeight)},Rect.createFromObject=function(t){return new Rect(t.width,t.height)};class AjaxLoader{constructor(s){this.baseUrl=s,this.isBusy=!1}fetch(){return this.isBusy?Promise.reject("Must wait for the current page to finish."):(this.isBusy=!0,window.fetch(this.getUrl()).then(this.onResponse.bind(this)))}getUrl(){throw new Error("Method must be implemented by a subclass.")}onResponse(s){return s.json()}done(){this.isBusy=!1}content(){return this.fetch()}}class ImageLoader extends EventEmitter{constructor(e){super(),this.images=e,this.chunkSize=5,this.parallelCount=0,this.loadedImages=[],this.isLoadingAll=!1}loadAll(){return this.isLoadingAll=!0,new Promise((e,a)=>{this.loadChunk(e)}).then(e=>this.trigger("all"))}loadChunk(e){let a=this.loadedImages.length,t=this.chunkSize,i=this.images.length;return Promise.all(_.range(a,Math.min(a+t,i)).map(this.loadIndex.bind(this))).then(this.onChunkLoaded.bind(this,e))}onChunkLoaded(e){return this.trigger("chunkloaded"),this.loadedImages.length==this.images.length?(e(this.loadedImages.length),this.isLoadingAll=!1):this.isLoadingAll&&this.loadChunk(e),this.loadedImages.length}onImageLoaded(e,a){return this.loadedImages.push(e),this.parallelCount--,this.trigger("imageloaded",{image:a,index:e}),e}loadImage(e){return this.parallelCount>=ImageLoader.MAX_PARALLEL_COUNT?Promise.reject(new Error(`Cannot exceed ${ImageLoader.MAX_PARALLEL_COUNT} simultaneous loads.`)):(this.parallelCount++,new Promise((a,t)=>{let i=new Image;i.addEventListener("load",e=>a(i)),i.src=e}))}loadIndex(e){return this.loadedImages.includes(e)?Promise.reject(new Error(`Image [${e}]${this.images[e]} was already loaded.`)):this.loadImage(this.images[e]).then(_.bindKey(this,"onImageLoaded",e))}}ImageLoader.MAX_PARALLEL_COUNT=5;class Motion extends EventEmitter{constructor(e){super(),this.node=e,e.id=e.dataset.name.split("/").join("--");let i=e.dataset;this._slideshowInfo=window[e.dataset.name],this.imageCount=this._slideshowInfo.length,this.poster=e.querySelector("img"),this.isInitialized=!1,this.hasBufferLoaded=!1,this.hasStarted=!1,this.autoplay="autoplay"in i&&"true"==i.autoplay,this.baseUrl="http://dahlenstudio.com"+window.app.config.ALBUMS_URL+i.name,this.animation=new MotionAnimation(Motion.ANIMATION_EVENT_NAMES),e.addEventListener("click",this.onClick.bind(this))}setupImageCreate(){let e=parseInt(this.node.dataset.timing,10);this.createImage=Motion.prototype.createImage.bind(this,{delay:e,duration:e+50,fadeDuration:e+50},Rect.createFromNode(this.node))}onPlayButtonClick(){this.isInitialized||this.init(),this.when("buffered").then(this.play.bind(this))}onClick(e){return e.target.classList.contains("play-button")?this.onPlayButtonClick():this.node.classList.contains("playing")?this.togglePlay():void 0}onBufferLoaded(){this.hasBufferLoaded=!0,this.node.classList.add("buffered"),this.trigger("buffered")}onImageLoaded(e,i){!this.hasBufferLoaded&&i/this.imageCount>.5&&this.onBufferLoaded()}onImagesLoaded(){this.node.classList.remove("loading"),this.trigger("loaded")}loadImages(){let e=new ImageLoader(this._slideshowInfo.map(e=>this.baseUrl+"/"+e.filename));return e.events.addEventListener("imageloaded",e=>this.onImageLoaded(e.detail.image,e.detail.index)),this.node.classList.add("loading"),e.loadAll().then(_.bindKey(this,"onImagesLoaded"))}finish(){this.node.classList.add("finished"),this.node.classList.remove("playing"),this.trigger("finished")}play(){this.hasStarted||(this.hasStarted=!0,this.node.classList.add("playing"),this.trigger("started"),this.resume())}pause(){this.trigger("paused"),this.animation.pause()}resume(){this.trigger("resumed"),this.animation.resume()}togglePlay(){return this.animation.isPaused?this.resume():this.pause()}remove(){return requestAnimationFrame(()=>this.node.style.opacity=0),Promise.delay(Motion.CONTAINER_FADE_DURATION,()=>this.node.classList.remove("current"))}addImageKeyFrames(e,i){let t=e.delay,s=t+e.fadeInDuration+e.duration,a=s+e.fadeOutDuration;i>0&&this.animation.addKeyFrame("show",t,i),this.animation.addKeyFrame("hide",s,i),this.animation.addKeyFrame("remove",a,i)}createImage(e,i,t){let s=this._slideshowInfo[t],a=new MotionImage(this.baseUrl+"/"+s.filename);this.images[t]=a,a.parseInfo(e,i,s,t,t?this.images[t-1]:void 0),0==t&&(a.createImageNode(),this.poster.style.cssText=a.node.getAttribute("style"),a.node=this.poster),this.addImageKeyFrames(a,t)}onShowAnimationTick(e){let i=e.detail.value;this.images[i].show(this.node)}onHideAnimationTick(e){let i=e.detail.value;i<this.imageCount-1&&this.images[i].hide()}onRemoveAnimationTick(e){let i=e.detail.value;i===this.imageCount-1?this.finish():(this.images[i].remove(),delete this.images[i],delete this._slideshowInfo[i])}init(){if(!this.isInitialized){for(let e of Motion.ANIMATION_EVENT_NAMES){let i="on"+_.capitalize(e)+"AnimationTick";this.animation.on(e,_.bindKey(this,i))}this.isInitialized=!0,this.totalDelay=0,this.images=[],this.loadImages(),this.setupImageCreate();for(let e=0;e<this._slideshowInfo.length;e++)this.createImage(e)}}}Motion.ANIMATION_EVENT_NAMES=["show","hide","remove"],Motion.CONTAINER_FADE_DURATION=1e3,Motion.LAST_IMAGE_DELAY=1e3,Motion.AUTOPLAY_DELAY=500;class MotionImage{constructor(t){this.url=t,this.hasLoaded=!1}parseInfo(t,e,i,a,n){let o=MotionImage.INITIAL_DURATIONS;"position"in i&&(this.left=i.position[0],this.top=i.position[1]);let d=e.containBigger(Rect.createFromObject(i));_.assign(this,d),"fade"in i?(this.fadeInDuration=i.fade[0]?i.fade[0]:t.fadeDuration,this.fadeOutDuration=i.fade[1]?i.fade[1]:t.fadeDuration):this.fadeInDuration=this.fadeOutDuration=t.fadeDuration,this.duration="duration"in i?i.duration?i.duration:t.duration:a<o.length?o[a]:t.duration,this.delay="delay"in i?i.delay?i.delay:n.delay+t.delay:a<o.length-1?o[a+1]-100:n.delay+t.delay}createImageNode(){let t=new Image,e=t.style;t.src=this.url;for(let t of["left","top","width","height"])t in this&&(e[t]=this[t]+"px");"left"in this&&(e.margin=0),this.node=t}fade(t,e){let i=this.node.style;i.transition="opacity "+e+"ms",requestAnimationFrame(()=>i.opacity=t)}fadeIn(){this.fade(1,this.fadeInDuration)}fadeOut(){this.fade(0,this.fadeOutDuration)}show(t){this.createImageNode(),t.appendChild(this.node),this.fadeIn()}hide(){this.fadeOut()}remove(){this.node.remove()}}MotionImage.INITIAL_DURATIONS=[1e3,700,500,400];class MotionQueue{constructor(t){this.list=new DLL.DoublyLinkedList;for(let e of t)this.list.append(e)}setupRelays(){let t=this.list.head();for(;t.next;){let e=t.data,s=t.next.data;this.setupRelay(e,s),t=t.next}}setupRelay(t,e){this.whenFinished(t,e).then(this.start.bind(this,e))}start(t){return this.startItem(void 0===t?this.list.head().data:t)}startItem(t){throw new Error("Method must be implemented by a subclass.")}whenFinished(t,e){throw new Error("Method must be implemented by a subclass.")}clone(t){let e=[];for(let t=0,s=this.list.size();t<s;t++)e.push(this.list.item(t).data);return t(e)}}class MotionAnimation extends EventEmitter{constructor(e){super(),this.keyFrames={};for(let s of e)this.keyFrames[s]=[];this.timeElapsed=0,this.isPaused=!0}addKeyFrame(e,s,t){this.keyFrames[e].push({time:s,value:t})}hasKeyFrames(){let e=Object.keys(this.keyFrames),s=e.length&&e.some(e=>this.keyFrames[e].length);return s}onTick(){let e=Date.now();this.timeElapsed+=e-this.tickTime;for(let e in this.keyFrames){let s=_.findIndex(this.keyFrames[e],e=>e.time<this.timeElapsed);if(s>=0){let t=this.keyFrames[e].splice(s,1).shift();this.trigger(e,t),0==this.keyFrames[e].length&&delete this.keyFrames[e],this.hasKeyFrames()||this.pause()}}this.tickTime=e,this.isPaused||this.tick()}pause(){this.isPaused=!0}tick(){requestAnimationFrame(this.onTick.bind(this))}resume(){if(!this.isPaused)return!1;this.tickTime=Date.now(),this.isPaused=!1,this.tick()}}class MotionLoadingQueue extends MotionQueue{startItem(e){return e.init(),Promise.resolve(!0)}whenFinished(e,n){return new Promise(n=>e.on("loaded",n))}}class MotionPlayingQueue extends MotionQueue{startItem(e){return e.node.style.opacity=1,Promise.delay(MotionPlayingQueue.TRANSITION_DELAY,_.bindKey(e,"onPlayButtonClick"))}whenFinished(e,n){return Promise.all([e.when("finished").then(_.bindKey(e,"remove")).then(Promise.delay(MotionPlayingQueue.TRANSITION_DELAY)),n.when("buffered")])}}MotionPlayingQueue.TRANSITION_DELAY=2e3;!function(e,n){n.init(function(){let e=Array.from(document.querySelectorAll(".motion")).map(e=>new Motion(e));n.loadingQueue=new MotionLoadingQueue(e),n.loadingQueue.setupRelays(),n.loadingQueue.start()})}(jQuery,window.app);