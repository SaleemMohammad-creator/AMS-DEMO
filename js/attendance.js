document.addEventListener(
'DOMContentLoaded',
() => {

/* =========================
   Storage
========================= */

let attendanceData =

Storage.get(
    CONFIG.KEYS.ATTENDANCE
) || [];

let staffData =

Storage.get(
    CONFIG.KEYS.STAFF
) || [];


/* =========================
   Elements
========================= */

const attendanceTableBody =
document.getElementById(
    'attendanceTableBody'
);

const attendanceModal =
document.getElementById(
    'attendanceModal'
);

const markAttendanceBtn =
document.getElementById(
    'markAttendanceBtn'
);

const closeAttendanceModal =
document.getElementById(
    'closeAttendanceModal'
);

const closeBtn2 =
document.getElementById(
    'closeBtn2'
);

const employeeSelect =
document.getElementById(
    'employeeSelect'
);

const breakContainer =
document.getElementById(
    'breakContainer'
);

const searchInput =
document.querySelector(
    '.search-box input'
);

const datePicker =
document.querySelector(
    '.date-picker'
);

const saveAttendanceBtn =
document.getElementById(
    'saveAttendanceBtn'
);

const resetAttendanceBtn =
document.getElementById(
    'resetAttendanceBtn'
);

const addBreakBtn =
document.getElementById(
    'addBreakBtn'
);


/* =========================
   Populate Employees
========================= */

function populateEmployees(){

    if(
        !employeeSelect
    ) return;

    employeeSelect.innerHTML =

    `
    <option value="">
        Select Employee ID / Name
    </option>
    `;

    staffData.filter(emp => !emp.status || emp.status === 'Active').forEach(
        emp => {

        employeeSelect.innerHTML +=

        `
        <option
            value="${emp.id}"
        >
            ${emp.id}
            -
            ${emp.name}
        </option>
        `;
    });
}

populateEmployees();


/* =========================
   Modal Controls
========================= */

function openModal(){

    attendanceModal
    ?.classList.add(
        'show'
    );

    document
    .getElementById(
        'attendanceDateModal'
    )
    .value =

    new Date()
    .toISOString()
    .split('T')[0];
}

function closeModal(){

    attendanceModal
    ?.classList.remove(
        'show'
    );
}

markAttendanceBtn
?.addEventListener(

    'click',

    openModal
);

closeAttendanceModal
?.addEventListener(

    'click',

    closeModal
);

closeBtn2
?.addEventListener(

    'click',

    closeModal
);


/* =========================
   Add Break
========================= */

addBreakBtn
?.addEventListener(

    'click',

    () => {

        const div =

        document.createElement(
            'div'
        );

        div.className =
            'break-row';

         div.innerHTML =

`
<div class="input-group">

    <label>
        Break Start
    </label>

    <input
        type="time"
        class="breakStart"
    />

</div>

<div class="input-group">

    <label>
        Break End
    </label>

    <input
        type="time"
        class="breakEnd"
    />

</div>
`;

        breakContainer
        .appendChild(div);
    }
);


/* =========================
   Time Difference
========================= */

function diffHours(
    start,
    end
){

    if(
        !start ||
        !end
    ) return 0;

    const s =

    new Date(
        '2025-01-01T' +
        start
    );

    const e =

    new Date(
        '2025-01-01T' +
        end
    );

    return (

        e - s

    ) / 36e5;
}


/* =========================
   Status Class
========================= */

function getStatusClass(
    status
){

    status =
    (
        status || ''
    )
    .toLowerCase();

    if(
        status.includes(
            'late'
        )
    )
        return 'late';

    if(
        status.includes(
            'half'
        )
    )
        return 'half';

    if(
        status.includes(
            'leave'
        )
    )
        return 'leave';

    if(
        status.includes(
            'holiday'
        )
    )
        return 'holiday';

    if(
        status.includes(
            'week'
        )
    )
        return 'weekoff';

    return 'present';
}

/* =========================
   Save Attendance
========================= */

saveAttendanceBtn
?.addEventListener(

    'click',

    () => {

        const empVal =

        employeeSelect.value;

        if(
            !empVal
        ){

           Utils.toast(
               'Select employee',
                'warning'
            );

            return;
        }

        const emp =

        staffData.find(

            e =>

            e.id ===
            empVal

        ) || {};

        const login =

        document
        .getElementById(
            'loginTimeModal'
        )
        .value;

        const logout =

        document
        .getElementById(
            'logoutTimeModal'
        )
        .value;

        const date =

        document
        .getElementById(
            'attendanceDateModal'
        )
        .value;


        /* =========================
           Validation
        ========================= */

        if(
            !login ||
            !logout ||
            !date
        ){

            Utils.toast(
                 'Complete all required fields',
                'warning'
           );
            return;
        }


        /* =========================
           Duplicate Attendance
           One Employee
           One Date
        ========================= */

        const alreadyMarked =

        attendanceData.find(

            item =>

            item.empId ===
            empVal

            &&

            item.date ===
            date
        );

        if(
            alreadyMarked
        ){

        Utils.toast(
                'Attendance already marked for this employee on selected date',
                'warning'
        );

            return;
        }


        /* =========================
           Break Calculation
        ========================= */

        let breakHours =
            0;

        let breakText =
            '';

        document
        .querySelectorAll(
            '.break-row'
        )
        .forEach(
            row => {

            const start =

            row.querySelector(
                '.breakStart'
            )?.value;

            const end =

            row.querySelector(
                '.breakEnd'
            )?.value;

            if(
                start &&
                end
            ){

                breakHours +=

                diffHours(
                    start,
                    end
                );

                breakText +=

                `${start}-${end} `;
            }
        });


        /* =========================
           Working Hours
        ========================= */

        let workHours =

        diffHours(
            login,
            logout
        ) - breakHours;

        if(
            workHours < 0
        ){

            workHours = 0;
        }


        /* =========================
           Rules
           Normal Shift =
           8 hrs 15 mins
        ========================= */

        const normalHours =
            8.25;

        const otHours =

        Math.max(

            0,

            workHours
            -
            normalHours
        );


        /* =========================
           Attendance Type
        ========================= */

        const type =

        document
        .getElementById(
            'attendanceType'
        )
        .value;

        let status =
            type;

        const benefitType =
document.getElementById(
    'benefitType'
).value;

let otMode = 'Pay';

if (
    type === 'Week Off' ||
    type === 'Holiday'
) {
    otMode = benefitType || 'Pay';
}


        /* =========================
           Status Logic
        ========================= */

        if(
            type ===
            'Present'
        ){

            const late =

            login >
            '09:30';

            if(
                workHours
                <
                8.25
            ){

                status =

                late

                ?

                'Late + Half Day'

                :

                'Half Day';
            }

            else{

                status =

                late

                ?

                'Late Login'

                :

                'Present';
            }
        }


        /* =========================
           Attendance Record
        ========================= */

    const record = {

    empId:
        emp.id || empVal,

    name:
        emp.name || '',

    role:
        emp.role || '',

    dept:
        emp.department || '',

    login,
    logout,
    date,

    break:
        breakText.trim(),

    working:
        workHours.toFixed(
            2
        ),

    ot:
   otHours.toFixed(2),

otMode:
   otMode,

creditEarned:

(
    otMode === 'Credit'
    &&
    (
        type === 'Week Off'
        ||
        type === 'Holiday'
    )
)

? 1

: 0,

type,
status

};

/* =========================
           Save
        ========================= */

        attendanceData.push(
            record
        );

        /* =========================
   AUTO LEAVE CREDIT
========================= */

if(
    record.creditEarned > 0
){

    let leaveRequests =

    Storage.get(
        CONFIG.KEYS.LEAVE_REQUESTS,
        []
    );

    const alreadyExists =

    leaveRequests.some(
    item =>

        item.category ===
        'Benefit'

        &&

        item.empId ===
        record.empId

        &&

        item.from ===
        record.date

        &&

        item.remarks ===
        'Auto Credit OT'
    );

    if(
        !alreadyExists
    ){

        leaveRequests.push({

            id:
            Utils.uid(),

            empId:
            record.empId,

            name:
            record.name,

            type:
            'Credit OT',

            benefit:
            'Extra Credit (+1)',

            from:
            record.date,

            to:
            record.date,

            days:1,

            creditChange:1,

            status:
            'Benefit',

            remarks:
            'Auto Credit OT',

            category:
            'Benefit'
        });

        Storage.set(

            CONFIG.KEYS
            .LEAVE_REQUESTS,

            leaveRequests
        );
    }
}

        Storage.set(

            CONFIG.KEYS
            .ATTENDANCE,

            attendanceData
        );

        renderTable();

        resetForm();

        closeModal();

        Utils.toast(
          'Attendance saved successfully',
           'success'
      );
    }
);

/* =========================
   Dashboard Cards
========================= */

function updateCards(data){

    const cards =

    document.querySelectorAll(
        '.dashboard-card h3'
    );

    let present = 0;
    let half = 0;
    let leave = 0;
    let week = 0;
    let ot = 0;
    let late = 0;

    data.forEach(
        r => {

        if(
            r.status?.includes(
                'Late'
            )
        ) late++;

        if(
            r.status?.includes(
                'Half'
            )
        ) half++;

        if(
            r.type ===
            'Leave'
        ) leave++;

        if(
            r.type ===
            'Week Off'
        ) week++;

        if(

            r.type ===
            'Present'

            ||

            r.status?.includes(
                'Late'
            )

        ){

            present++;
        }

        ot +=

        parseFloat(
            r.ot || 0
        );
    });

    if(cards.length >= 6){

        cards[0].textContent =
            present;

        cards[1].textContent =
            half;

        cards[2].textContent =
            leave;

        cards[3].textContent =
            week;

        cards[4].textContent =
            ot.toFixed(2);

        cards[5].textContent =
            late;
    }
}


/* =========================
   Render Table
========================= */

function renderTable(){

    let filtered =

        [...attendanceData];

    const query =

        (
            searchInput?.value || ''
        )
        .toLowerCase();

    const date =

        datePicker?.value || '';

    /* Search */

    if(query){

        filtered =

        filtered.filter(
            r =>

            (
                r.empId + ''
            )
            .toLowerCase()
            .includes(
                query
            )

            ||

            (
                r.name || ''
            )
            .toLowerCase()
            .includes(
                query
            )
        );
    }

    /* Date */

    if(date){

        filtered =

        filtered.filter(
            r =>

            r.date ===
            date
        );
    }

    attendanceTableBody.innerHTML =
        '';

    filtered.forEach(

        (
            r,
            i
        ) => {

        attendanceTableBody.innerHTML +=

        `

        <tr>

            <td>
                ${r.empId}
            </td>

            <td>
                ${r.name}
            </td>

            <td>
                ${r.role}
            </td>

            <td>
                ${r.dept}
            </td>

            <td>
                ${r.login || '-'}
            </td>

            <td>
                ${r.break || '-'}
            </td>

            <td>
                ${r.working || 0}
                hrs
            </td>

            <td>
                ${Utils.formatHours(Number(r.ot||0))}
            </td>

            <td>
                ${r.logout || '-'}
            </td>

            <td>

                <span
                    class="
                    status-badge
                    ${getStatusClass(
                        r.status
                    )}
                    "
                >
                    ${r.status}
                </span>

            </td>

            <td
                class="actions"
            >

                <button
                    class="
                    icon-btn
                    view-btn
                    "
                    onclick="
                    viewAttendance(
                    ${i}
                    )
                    "
                >
                    <i class="
                    fa-solid
                    fa-eye
                    "></i>
                </button>

                <button
                    class="
                    icon-btn
                    edit-btn
                    "
                    onclick="
                    editAttendance(
                    ${i}
                    )
                    "
                >
                    <i class="
                    fa-solid
                    fa-pen
                    "></i>
                </button>

                <button
                    class="
                    icon-btn
                    delete-btn
                    "
                    onclick="
                    deleteAttendance(
                    ${i}
                    )
                    "
                >
                    <i class="
                    fa-solid
                    fa-trash
                    "></i>
                </button>

            </td>

        </tr>
        `;
    });

    updateCards(
        attendanceData
    );
}


/* =========================
   Delete
========================= */

window.deleteAttendance =

function(index){

   attendanceData.splice(
    index,
    1
);

Storage.set(
    CONFIG.KEYS.ATTENDANCE,
    attendanceData
);

renderTable();

Utils.toast(
    'Attendance Record Deleted',
    'success'
);
    
    {

        attendanceData.splice(
            index,
            1
        );

        Storage.set(

            CONFIG.KEYS.ATTENDANCE,

            attendanceData
        );

        renderTable();
    }
};


/* =========================
   View
========================= */

window.viewAttendance =

function(index){

    const r =

    attendanceData[index];

    if(!r) return;

    Utils.toast(

`Employee : ${r.name}
Date : ${r.date}
Login : ${r.login}
Logout : ${r.logout}
Status : ${r.status}
Working : ${r.working} hrs
OT : ${r.ot} hrs`
    );
};


/* =========================
   Edit
========================= */

window.editAttendance =

function(index){

    const r =

    attendanceData[index];

    if(!r) return;

    openModal();

    employeeSelect.value =
        r.empId;

    document
    .getElementById(
        'attendanceDateModal'
    )
    .value =
        r.date;

    document
    .getElementById(
        'loginTimeModal'
    )
    .value =
        r.login;

    document
    .getElementById(
        'logoutTimeModal'
    )
    .value =
        r.logout;

    document
    .getElementById(
        'attendanceType'
    )
    .value =
        r.type;

    /* Remove old */

    attendanceData.splice(
        index,
        1
    );

    Storage.set(

        CONFIG.KEYS.ATTENDANCE,

        attendanceData
    );

    renderTable();
};


/* =========================
   Reset
========================= */

function resetForm(){

    employeeSelect.value =
        '';

    document
    .getElementById(
        'loginTimeModal'
    )
    .value =
        '';

    document
    .getElementById(
        'logoutTimeModal'
    )
    .value =
        '';

    document
    .getElementById(
        'attendanceType'
    )
    .value =
        'Present';

    const remarks =

    document.getElementById(
        'remarks'
    );

    if(remarks){

        remarks.value =
            '';
    }

    breakContainer.innerHTML =
        '';
}

resetAttendanceBtn
?.addEventListener(

    'click',

    resetForm
);


/* =========================
   Filters
========================= */

searchInput
?.addEventListener(

    'input',

    renderTable
);

datePicker
?.addEventListener(

    'change',

    renderTable
);


/* =========================
   Initial Load
========================= */

renderTable();

});