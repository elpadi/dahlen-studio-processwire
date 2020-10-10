class ResettableTimeout {

    constructor(duration, fn)
    {
        this.id = 0;
        this.duration = duration;
        this.fn = fn;
    }

    clear()
    {
        clearTimeout(this.id);
        this.id = 0;
    }

    reset()
    {
        this.id = setTimeout(this.onTimeout.bind(this), this.duration);
    }

    onTimeout()
    {
        this.id = 0;
        this.fn();
    }

    isWaiting()
    {
        return Boolean(this.id);
    }

}
