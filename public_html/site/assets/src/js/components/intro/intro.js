class Intro {

    constructor()
    {
        this.sequence = app.config.INTRO_SEQUENCE;
    }

    init()
    {
        document.body.classList.add('menu-intro');
        let p = Promise.resolve(true);
        for (let key of this.sequence) {
            for (let action of ['show','hide']) {
                let fn = _.camelCase(action + ' ' + key);
                if (fn in this) {
                    p = p.then(_.bindKey(this, fn));
                }
            }
        }
        p.then(_.bindKey(this, 'finishIntro'));
    }

    showLogo()
    {
        let p = document.querySelectorAll('#logo path');
        console.log('Intro.showLogo', p);
        for (let i = 1; i <= p.length; i++) {
            p[i - 1].style.transitionDelay = `${i * Intro.LOGO_CHAR_DELAY}ms`;
        }
        requestAnimationFrame(() => document.getElementById('logo').classList.add('visible'));
        return new Promise(resolve => setTimeout(resolve, (p.length + 1) * Intro.LOGO_CHAR_DELAY));
    }

    showMenu()
    {
        let items = document.querySelectorAll('#main-menu > ul > li > ul > li');
        console.log('Intro.showMenu', items);
        let showItem = item => {
            item.classList.add('visible');
            setTimeout(() => item.classList.add('reset-color'), Intro.MENU_COLOR_DELAY);
        };
        for (let i = 1; i <= items.length; i++) {
            setTimeout(showItem.bind(this, items[i - 1]), i * Intro.MENU_ITEM_DELAY);
        }
        return new Promise(resolve => setTimeout(resolve, (items.length + 1) * Intro.MENU_ITEM_DELAY + Intro.MENU_COLOR_DELAY + Intro.MENU_COLOR_DURATION))
            .then(() => document.body.classList.remove('menu-intro'));
    }

    showBed()
    {
        return app.videos['cj-bedroom-bed'].init();
    }

    hideBed()
    {
        document.querySelector('#cj-bedroom-bed').remove();
        return Promise.delay(1000);
    }

    showImages()
    {
        return app.videos['introduction'].init();
    }

    finishIntro()
    {
    }

}

Intro.LOGO_CHAR_DELAY = 100;
Intro.MENU_ITEM_DELAY = 1000;
Intro.MENU_COLOR_DELAY = 500;
Intro.MENU_COLOR_DURATION = 1000;
