/* =========================
   AMS ROLE PERMISSIONS
========================= */

const ROLE_PERMISSIONS = {

    /* =====================
       ADMIN
    ===================== */

    admin: [

        'dashboard',

        'staff',

        'attendance',

        'leave-credits',

        'ot-pay-reports',

        'reports',

        'settings'
    ],

    /* =====================
       HR
    ===================== */

    hr: [

        'dashboard',

        'staff',

        'attendance',

        'leave-credits',

        'reports'
    ],

    /* =====================
       EMPLOYEE
    ===================== */

    employee: [

        'dashboard',

        'attendance',

        'leave-credits',

        'ot-pay-reports'
    ]
};

/* =========================
   PERMISSION MANAGER
========================= */

const PermissionManager = {

    /* =====================
       SESSION
    ===================== */

    getSession(){

        return Storage.get(
            CONFIG.KEYS.SESSION
        ) || {};
    },

    /* =====================
       CURRENT ROLE
    ===================== */

    getRole(){

        const session =
        this.getSession();

        return session.role || '';
    },

    /* =====================
       CURRENT PAGE
    ===================== */

    getPage(){

        return window
        .location
        .pathname
        .split('/')
        .pop()
        .replace(
            '.html',
            ''
        );
    },

    /* =====================
       ALLOWED PAGES
    ===================== */

    getAllowedPages(){

        const role =
        this.getRole();

        return (
            ROLE_PERMISSIONS[
                role
            ] || []
        );
    },

    /* =====================
       CHECK ACCESS
    ===================== */

    hasAccess(page){

        const allowed =
        this.getAllowedPages();

        return allowed.includes(
            page
        );
    },

    /* =====================
       REDIRECT LOGIN
    ===================== */

    redirectLogin(){

        window.location.href =
        '../index.html';
    },

    /* =====================
       ACCESS DENIED
    ===================== */

    denyAccess(){

        if(
            typeof showToast
            !==
            'undefined'
        ){

            showToast(
                'Access denied',
                'error'
            );
        }

        setTimeout(
            () => {

                window.location.href =
                'dashboard.html';

            },
            700
        );
    },

    /* =====================
       INIT
    ===================== */

    init(){

        const session =
        this.getSession();

        /* No Login */

        if(
            !session.role
        ){

            this.redirectLogin();
            return;
        }

        const page =
        this.getPage();

        /* Invalid Page */

        if(
            page &&
            !this.hasAccess(
                page
            )
        ){

            this.denyAccess();
        }
    }
};

/* =========================
   START
========================= */

PermissionManager.init();