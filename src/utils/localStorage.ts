const db = {
    save(key: string, value: any) {
        localStorage.setItem(key, JSON.stringify(value));
    },
    get(key: string, defaultValue: any = {}) {
        const str = localStorage.getItem(key);
        let value = str === null ? defaultValue : JSON.parse(str);

        return value;
    },
    remove(key: string) {
        localStorage.removeItem(key);
    },
    clear() {
        localStorage.clear();
    },
    isUndef(v: string) {
        return v === undefined || v === null;
    }
};

export default db;
