class TimeoutEventEmitter extends EventEmitter {

    constructor(name, duration)
    {
        super();
        this.name = name;
        this.duration = duration;
        this.timeoutId = 0;
    }

    onTimeout()
    {
        console.log('TimeoutEventEmitter.onTimeout');
        this.timeoutId = 0;
        this.trigger(this.name);
    }

    clear()
    {
        console.log('TimeoutEventEmitter.clear');
        clearTimeout(this.timeoutId);
        this.timeoutId = 0;
    }

    reset()
    {
        console.log('TimeoutEventEmitter.reset');
        if (this.timeoutId) {
            this.clear();
        }
        this.timeoutId = window.setTimeout(this.onTimeout.bind(this), this.duration);
    }

}
