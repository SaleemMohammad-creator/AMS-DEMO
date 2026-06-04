/* =========================
   AMS Configuration
========================= */

const CONFIG = {

    /* =========================
       Storage Keys
    ========================= */

    KEYS:{

        USERS:
            'ams_users',

        SESSION:
            'ams_session',

        STAFF:
            'ams_staff',

        ATTENDANCE:
            'ams_attendance',

        LEAVE_REQUESTS:
            'ams_leave_requests',

        PAYROLL:
            'ams_payroll',

        SETTINGS:
            'ams_settings',

        PAYROLL_SETTINGS:
            'ams_payroll_settings'
    },

    /* =========================
       Employee Settings
    ========================= */

    EMPLOYEE:{

        PREFIX:'CSTL',

        RANDOM_DIGITS:
            4
    },

    /* =========================
       Leave Policy
    ========================= */

    LEAVE:{

        MONTHLY_CREDIT:
            1.5,

        MAX_CARRY_FORWARD:
            18,

        HALF_DAY:
            0.5,

        FULL_DAY:
            1
    },

    /* =========================
       Attendance
    ========================= */

    ATTENDANCE_STATUS:{

        PRESENT:
            'Present',

        ABSENT:
            'Absent',

        HALF_DAY:
            'Half Day',

        WEEK_OFF:
            'Week Off',

        HOLIDAY:
            'Holiday'
    },

    /* =========================
       Leave Status
    ========================= */

    LEAVE_STATUS:{

        PENDING:
            'Pending',

        APPROVED:
            'Approved',

        REJECTED:
            'Rejected',

        LOP:
            'LOP',

        BENEFIT:
            'Benefit'
    }

};