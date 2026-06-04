/* =========================
   AMS Storage Manager
========================= */

const Storage = {

    get(key, defaultValue = null){
        try{
            const value = localStorage.getItem(key);
            return value ? JSON.parse(value) : defaultValue;
        }catch(error){
            console.error('Storage GET Error:', error);
            return defaultValue;
        }
    },

    set(key,value){
        try{
            localStorage.setItem(key, JSON.stringify(value));
        }catch(error){
            console.error('Storage SET Error:', error);
        }
    },

    remove(key){
        localStorage.removeItem(key);
    },

    clear(){
        localStorage.clear();
    }
};
