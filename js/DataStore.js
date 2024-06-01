


/** @template T */
class DataStore {
    storageKey;

    /** 
     * @public
     * @type {T}
     */
    value;

    /**
     * @param {string} key
     * @param {T} initialValue
    */
    constructor(key, initialValue = {}) {
        this.storageKey = key;

        if (localStorage.getItem(key) == null) {
            localStorage.setItem(key, JSON.stringify(initialValue))
        }

        this.value = JSON.parse(localStorage.getItem(key));
    }

    save() {
        localStorage.setItem(this.storageKey, JSON.stringify(this.value))
    }

    pull() {
        if (localStorage.getItem(this.storageKey) == null) throw Error(this.storageKey + " leads to an empty storage")
        this.value = JSON.parse(localStorage.getItem(this.storageKey));
    }

    clear() {
        localStorage.removeItem(this.storageKey)
    }
}