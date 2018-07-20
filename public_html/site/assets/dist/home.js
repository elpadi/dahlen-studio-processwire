class Intro{constructor(){this.sequence=app.config.INTRO_SEQUENCE}init(){document.body.classList.add("menu-intro");let e=Promise.resolve(!0);for(let t of this.sequence)for(let o of["show","hide"]){let n=_.camelCase(o+" "+t);n in this&&(e=e.then(_.bindKey(this,n)))}e.then(_.bindKey(this,"finishIntro"))}showLogo(){let e=document.querySelectorAll("#logo path");for(let t=1;t<=e.length;t++)e[t-1].style.transitionDelay=`${t*Intro.LOGO_CHAR_DELAY}ms`;return requestAnimationFrame(()=>document.getElementById("logo").classList.add("visible")),new Promise(t=>setTimeout(t,(e.length+1)*Intro.LOGO_CHAR_DELAY))}showMenu(){let e=document.querySelectorAll("#main-menu > ul > li > ul > li"),t=e=>{e.classList.add("visible"),setTimeout(()=>e.classList.add("reset-color"),Intro.MENU_COLOR_DELAY)};for(let o=1;o<=e.length;o++)setTimeout(t.bind(this,e[o-1]),o*Intro.MENU_ITEM_DELAY);return new Promise(t=>setTimeout(t,(e.length+1)*Intro.MENU_ITEM_DELAY+Intro.MENU_COLOR_DELAY+Intro.MENU_COLOR_DURATION)).then(()=>document.body.classList.remove("menu-intro"))}showBed(){let e=app.loadingQueue.list.item(0).data;return e.node.style.opacity=1,setTimeout(_.bindKey(e,"onPlayButtonClick"),Motion.CONTAINER_FADE_DURATION),new Promise(t=>e.on("finished",t))}hideBed(){return app.loadingQueue.list.item(0).data.remove(),Promise.delay(Motion.CONTAINER_FADE_DURATION+1e3)}showImages(){app.playingQueue=app.loadingQueue.clone(e=>new MotionPlayingQueue(e.slice(1))),app.playingQueue.setupRelays();let e=app.playingQueue.list.tail().data;return new Promise(t=>e.on("finished",t))}finishIntro(){app.playingQueue.list.tail().data.remove(),app.music.stop()}}Intro.LOGO_CHAR_DELAY=100,Intro.MENU_ITEM_DELAY=1e3,Intro.MENU_COLOR_DELAY=500,Intro.MENU_COLOR_DURATION=1e3;app.init(function(){app.intro=new Intro,app.intro.init()});