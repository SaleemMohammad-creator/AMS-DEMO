/* =========================
   AMS Utilities
========================= */

const Utils = {

    /* =========================
       Employee ID Generator
    ========================= */

    generateEmployeeId(staffData = []){
        let id;
        do{
            const randomNumber = Math.floor(100000 + Math.random()*900000);
            id = `${CONFIG.EMPLOYEE.PREFIX}${randomNumber}`;
        }while(staffData.some(emp => emp.id === id));
        return id;
    },

    /* =========================
       Calculate Days
    ========================= */

    calculateDays(

        fromDate,
        toDate

    ){

        const start =
            new Date(
                fromDate
            );

        const end =
            new Date(
                toDate
            );

        const diff =
            end - start;

        const days =
            Math.floor(

                diff /

                (
                    1000 *
                    60 *
                    60 *
                    24
                )

            ) + 1;

        return days > 0
            ? days
            : 1;
    },

    /* =========================
       Format Date
    ========================= */

    formatDate(date){

        if(!date){

            return '-';
        }

        return new Date(
            date
        ).toLocaleDateString(
            'en-IN'
        );
    },

    /* =========================
       Currency
    ========================= */

    formatCurrency(amount){

        return '₹' + Number(amount || 0).toLocaleString('en-IN');
    },

    exportCSV(filename,rows){
        const csv=rows.map(r=>r.join(',')).join('\n');
        const blob=new Blob([csv],{type:'text/csv'});
        const a=document.createElement('a');
        a.href=URL.createObjectURL(blob);a.download=filename;a.click();
    },

    /* =========================
       Random Number
    ========================= */

    randomId(){

        return Date.now();
    }

,

    /* UID */
    uid(){
        return 'ID' + Date.now() + Math.floor(Math.random()*1000);
    },

    formatHours(hours){
        if(!hours || hours<=0) return '0 min';
        const totalMinutes=Math.round(Number(hours)*60);
        const hrs=Math.floor(totalMinutes/60);
        const mins=totalMinutes%60;
        if(hrs && mins) return `${hrs} hr ${mins} min`;
        if(hrs) return `${hrs} hr`;
        return `${mins} min`;
    },

    /* Toast */
    toast(message,type='info'){
        if(typeof showToast==='function'){
            showToast(message,type);
        }else{
            console.warn(message);
        }
    }

};