/* =========================
   LEAVE CREDITS
   JS PART 1
========================= */

document.addEventListener(
'DOMContentLoaded',
() => {

/* =========================
   STORAGE
========================= */

let leaveRequests =
Storage.get(
    CONFIG.KEYS.LEAVE_REQUESTS,
    []
);

let staffData =
Storage.get(
    CONFIG.KEYS.STAFF,
    []
);

/* =========================
   DOM
========================= */

const leaveTableBody =
document.getElementById(
    'leaveTableBody'
);

const ledgerBody =
document.getElementById(
    'ledgerBody'
);

const searchInput =
document.getElementById(
    'searchInput'
);

const monthFilter =
document.getElementById(
    'monthFilter'
);

/* Cards */

const takenLeavesCard =
document.getElementById(
    'takenLeavesCard'
);

const balanceCard =
document.getElementById(
    'balanceCard'
);

const pendingCard =
document.getElementById(
    'pendingCard'
);

const lopCard =
document.getElementById(
    'lopCard'
);

const alertCard =
document.getElementById(
    'alertCard'
);

/* =========================
   MODALS
========================= */

const leaveModal =
document.getElementById(
    'leaveModal'
);

const benefitModal =
document.getElementById(
    'benefitModal'
);

const leaveForm =
document.getElementById(
    'leaveForm'
);

const benefitForm =
document.getElementById(
    'benefitForm'
);

const openLeaveModalBtn =
document.getElementById(
    'openLeaveModalBtn'
);

const openBenefitModalBtn =
document.getElementById(
    'openBenefitModalBtn'
);

const closeLeaveModal =
document.getElementById(
    'closeLeaveModal'
);

const closeBenefitModal =
document.getElementById(
    'closeBenefitModal'
);

const cancelLeaveBtn =
document.getElementById(
    'cancelLeaveBtn'
);

const cancelBenefitBtn =
document.getElementById(
    'cancelBenefitBtn'
);

/* Dropdowns */

const employeeSelect =
document.getElementById(
    'employeeSelect'
);

const benefitEmployee =
document.getElementById(
    'benefitEmployee'
);

/* =========================
   SAVE
========================= */

function saveData(){

    Storage.set(

        CONFIG.KEYS
        .LEAVE_REQUESTS,

        leaveRequests
    );
}

/* =========================
   MODAL CONTROL
========================= */

function openModal(
    modal
){

    modal
    ?.classList
    .add(
        'active'
    );
}

function closeModal(
    modal
){

    modal
    ?.classList
    .remove(
        'active'
    );
}

/* Open */

openLeaveModalBtn
?.addEventListener(
'click',
() =>
openModal(
    leaveModal
)
);

openBenefitModalBtn
?.addEventListener(
'click',
() =>
openModal(
    benefitModal
)
);

/* Close */

closeLeaveModal
?.addEventListener(
'click',
() =>
closeModal(
    leaveModal
)
);

closeBenefitModal
?.addEventListener(
'click',
() =>
closeModal(
    benefitModal
)
);

cancelLeaveBtn
?.addEventListener(
'click',
() =>
closeModal(
    leaveModal
)
);

cancelBenefitBtn
?.addEventListener(
'click',
() =>
closeModal(
    benefitModal
)
);

/* Outside */

window.addEventListener(
'click',
e => {

    if(
        e.target ===
        leaveModal
    ){

        closeModal(
            leaveModal
        );
    }

    if(
        e.target ===
        benefitModal
    ){

        closeModal(
            benefitModal
        );
    }
});

/* =========================
   EMPLOYEES
========================= */

function loadEmployees(){

    if(
        !employeeSelect
        ||
        !benefitEmployee
    ) return;

    employeeSelect.innerHTML =
    `
    <option value="">
        Select Employee
    </option>
    `;

    benefitEmployee.innerHTML =
    `
    <option value="">
        Select Employee
    </option>
    `;

    staffData.forEach(
    emp => {

        const option1 =
        document.createElement(
            'option'
        );

        option1.value =
        emp.id;

        option1.textContent =
        `${emp.id} - ${emp.name}`;

        employeeSelect
        .appendChild(
            option1
        );

        const option2 =
        option1.cloneNode(
            true
        );

        benefitEmployee
        .appendChild(
            option2
        );
    });
}

/* =========================
   HELPERS
========================= */

function getEmployee(
    empId
){

    return staffData.find(
        emp =>
        emp.id ===
        empId
    );
}

function getCarryForward(
    balance
){

    return Math.min(

        balance,

        CONFIG.LEAVE
        .MAX_CARRY_FORWARD
    );
}

/* =========================
   APPLY LEAVE
========================= */

leaveForm
?.addEventListener(
'submit',
applyLeave
);

function applyLeave(
    e
){

    e.preventDefault();

    const empId =
    employeeSelect.value;

    const employee =
    getEmployee(
        empId
    );

    if(
        !employee
    ){

        Utils.toast(
            'Select Employee',
            'warning'
        );

        return;
    }

    const leaveType =
    document
    .getElementById(
        'leaveType'
    ).value;

    const fromDate =
    document
    .getElementById(
        'fromDate'
    ).value;

    const toDate =
    document
    .getElementById(
        'toDate'
    ).value;

    const remarks =
    document
    .getElementById(
        'leaveRemarks'
    )
    .value
    .trim();

    let days =
    Utils.calculateDays(
        fromDate,
        toDate
    );

    if(
        leaveType ===
        'Half Day'
    ){

        days =
        CONFIG.LEAVE
        .HALF_DAY;
    }

    const today =
    new Date()
    .toISOString()
    .split('T')[0];

    let status =
    'Pending';

    if(
        fromDate <
        today
    ){

        status =
        'Backdated Pending';
    }

    const request = {

        id:
        Utils.uid(),

        empId:
        employee.id,

        name:
        employee.name,

        type:
        leaveType,

        from:
        fromDate,

        to:
        toDate,

        days,

        creditChange:
        -days,

        status,

        remarks,

        category:
        'Leave'
    };

    leaveRequests.push(
        request
    );

    saveData();

    leaveForm.reset();

    closeModal(
        leaveModal
    );

    renderLeaveTable();
    updateCards();
    renderLedger();

    Utils.toast(
        'Leave Applied',
        'success'
    );
}

/* =========================
   BENEFIT
========================= */

benefitForm
?.addEventListener(
'submit',
applyBenefit
);

function applyBenefit(
    e
){

    e.preventDefault();

    const empId =
    benefitEmployee.value;

    const employee =
    getEmployee(
        empId
    );

    if(
        !employee
    ){

        Utils.toast(
            'Select Employee',
            'warning'
        );

        return;
    }

    const workedOn =
    document
    .getElementById(
        'workedOn'
    ).value;

    const benefitType =
    document
    .getElementById(
        'benefitType'
    ).value;

    const benefitDate =
    document
    .getElementById(
        'benefitDate'
    ).value;

    const remarks =
    document
    .getElementById(
        'benefitRemarks'
    )
    .value
    .trim();

    let creditChange =
    0;

    if(
        benefitType ===
        'Extra Credit (+1)'
    ){

        creditChange = 1;
    }

    const request = {

        id:
        Utils.uid(),

        empId:
        employee.id,

        name:
        employee.name,

        type:
        workedOn,

        benefit:
        benefitType,

        from:
        benefitDate,

        to:
        benefitDate,

        days:1,

        creditChange,

        status:
        'Benefit',

        remarks,

        category:
        'Benefit'
    };

    leaveRequests.push(
        request
    );

    saveData();

    benefitForm.reset();

    closeModal(
        benefitModal
    );

    renderLeaveTable();
    updateCards();
    renderLedger();

    Utils.toast(
        'Benefit Added',
        'success'
    );
}

/* =========================
   ACTIONS
========================= */

window.approveLeave =
function(id){

    const request =
    leaveRequests.find(
        item =>
        item.id === id
    );

    if(!request)
    return;

    request.status =
    'Approved';

    saveData();

    renderLeaveTable();
    updateCards();
    renderLedger();

    Utils.toast(
        'Leave Approved',
        'success'
    );
};

window.rejectLeave =
function(id){

    const request =
    leaveRequests.find(
        item =>
        item.id === id
    );

    if(!request)
    return;

    request.status =
    'Rejected';

    request.creditChange =
    0;

    saveData();

    renderLeaveTable();
    updateCards();
    renderLedger();

    Utils.toast(
        'Leave Rejected',
        'warning'
    );
};

window.markLOP =
function(id){

    const request =
    leaveRequests.find(
        item =>
        item.id === id
    );

    if(!request)
    return;

    request.status =
    'LOP';

    saveData();

    renderLeaveTable();
    updateCards();
    renderLedger();

    Utils.toast(
        'Marked as LOP',
        'warning'
    );
};

window.deleteLeave =
function(id){

    if(
        !confirm(
            'Delete record?'
        )
    ) return;

    leaveRequests =
    leaveRequests.filter(
        item =>
        String(item.id)
        !==
        String(id)
    );

    saveData();

    renderLeaveTable();

    updateCards();

    renderLedger();

    Utils.toast(
        'Record Deleted',
        'success'
    );
};

/* =========================
   BALANCE
========================= */

function calculateEmployeeBalance(
    empId
){

    let used = 0;
    let benefit = 0;

    leaveRequests
    .filter(
        item =>
        item.empId ===
        empId
    )
    .forEach(
    item => {

        if(
            item.status ===
            'Approved'
            &&
            item.creditChange < 0
        ){

            used +=
            Math.abs(
                item.creditChange
            );
        }

        if(
            item.creditChange > 0
        ){

            benefit +=
            item.creditChange;
        }
    });

    let balance =

        CONFIG.LEAVE
        .MONTHLY_CREDIT

        +

        benefit

        -

        used;

    balance =
    getCarryForward(
        balance
    );

    return Number(
        balance.toFixed(
            1
        )
    );
}

/* =========================
   TABLE
========================= */

function renderLeaveTable(){

    let filtered =
    [...leaveRequests];

    const search =
    (
        searchInput
        ?.value || ''
    )
    .toLowerCase()
    .trim();

    const month =
    monthFilter
    ?.value || '';

    /* Search */

    if(search){

        filtered =
        filtered.filter(
        item =>

            item.empId
            ?.toLowerCase()
            .includes(
                search
            )

            ||

            item.name
            ?.toLowerCase()
            .includes(
                search
            )
        );
    }

    /* Month */

    if(month){

        filtered =
        filtered.filter(
        item =>

            item.from
            ?.startsWith(
                month
            )
        );
    }

    /* Empty */

    if(
        filtered.length === 0
    ){

        leaveTableBody.innerHTML =
        `
        <tr>
            <td
                colspan="10"
                class="empty-state"
            >
                No leave records found
            </td>
        </tr>
        `;

        return;
    }

    leaveTableBody.innerHTML =
    filtered.map(
    item => {

        let badgeClass='';

        if(
            item.status ===
            'Pending'
        )
        badgeClass =
        'pending';

        if(
            item.status ===
            'Approved'
        )
        badgeClass =
        'approved';

        if(
            item.status ===
            'Rejected'
        )
        badgeClass =
        'rejected';

        if(
            item.status ===
            'LOP'
        )
        badgeClass =
        'rejected';

        if(
            item.status ===
            'Benefit'
        )
        badgeClass =
        'approved';

        if(
            item.status ===
            'Backdated Pending'
        )
        badgeClass =
        'pending';

        const balance =
        calculateEmployeeBalance(
            item.empId
        );

        let alertText =
        '-';

        if(
            balance >= 10
        ){
            alertText =
            'Warning';
        }

        if(
            balance >= 15
        ){
            alertText =
            'High';
        }

        return `
        <tr>

            <td>
                ${item.empId}
            </td>

            <td>
                ${item.name}
            </td>

            <td>
                ${
                    item.category ===
                    'Benefit'
                    ?
                    item.benefit
                    :
                    item.type
                }
            </td>

            <td>
                ${item.from}
            </td>

            <td>
                ${item.to}
            </td>

            <td>
                ${item.days}
            </td>

            <td
                class="
                ${
                    item.creditChange >=0
                    ?
                    'credit-positive'
                    :
                    'credit-negative'
                }
                "
            >
                ${item.creditChange}
            </td>

            <td>

                <span
                    class="
                    status
                    ${badgeClass}
                    "
                >
                    ${item.status}
                </span>

            </td>

            <td>
                ${alertText}
            </td>

            <td>

                <div
                    class="
                    action-buttons
                    "
                >

                ${
                    item.status
                    ?.includes(
                        'Pending'
                    )

                    ?

                    `
                    <button
                        class="
                        action-btn
                        approve
                        "
                        onclick="
                        approveLeave(
                        '${item.id}'
                        )
                        "
                    >
                        <i class="fa-solid fa-check"></i>
                    </button>

                    <button
                        class="
                        action-btn
                        reject
                        "
                        onclick="
                        rejectLeave(
                        '${item.id}'
                        )
                        "
                    >
                        <i class="fa-solid fa-xmark"></i>
                    </button>

                    <button
                        class="
                        action-btn
                        view
                        "
                        onclick="
                        markLOP(
                        '${item.id}'
                        )
                        "
                    >
                        LOP
                    </button>
                    `

                    :

                    `
                    <button
                        class="
                        action-btn
                        reject
                        "
                        onclick="
                        deleteLeave(
                        '${item.id}'
                        )
                        "
                    >
                        <i class="fa-solid fa-trash"></i>
                    </button>
                    `
                }

                </div>

            </td>

        </tr>
        `;
    }).join('');
}

/* =========================
   CARDS
========================= */

function updateCards(){

    const taken =
    leaveRequests
    .filter(
        item =>

        item.status ===
        'Approved'
        &&
        item.creditChange < 0
    )
    .reduce(
        (sum,item)=>
        sum +
        Math.abs(
            item.creditChange
        ),
        0
    );

    const pending =
    leaveRequests
    .filter(
        item =>
        item.status
        ?.includes(
            'Pending'
        )
    )
    .length;

    const lop =
    leaveRequests
    .filter(
        item =>
        item.status ===
        'LOP'
    )
    .length;

    let alerts = 0;

    staffData.forEach(
    emp => {

        if(
            calculateEmployeeBalance(
                emp.id
            ) >= 10
        ){
            alerts++;
        }
    });

    let balance = 0;

    if(
        staffData.length > 0
    ){

        const total =
        staffData.reduce(
        (sum,emp)=>

            sum +

            calculateEmployeeBalance(
                emp.id
            ),

            0
        );

        balance =
        (
            total /
            staffData.length
        )
        .toFixed(1);
    }

    takenLeavesCard.textContent =
    taken;

    balanceCard.textContent =
    balance;

    pendingCard.textContent =
    pending;

    lopCard.textContent =
    lop;

    alertCard.textContent =
    alerts;
}

/* =========================
   LEDGER
========================= */

function renderLedger(){

    ledgerBody.innerHTML =
    '';

    if(
        leaveRequests.length === 0
    ){

        ledgerBody.innerHTML =
        `
        <tr>
            <td colspan="6">
                No ledger data found
            </td>
        </tr>
        `;

        return;
    }

    const grouped = {};

    leaveRequests.forEach(
    item => {

        const month =
        item.from
        ?.slice(
            0,
            7
        );

        if(
            !month
        ) return;

        if(
            !grouped[month]
        ){

            grouped[month] = {

                opening:0,

                added:
                CONFIG.LEAVE
                .MONTHLY_CREDIT,

                used:0,

                expired:0
            };
        }

        if(
            item.creditChange < 0
            &&
            item.status ===
            'Approved'
        ){

            grouped[month]
            .used +=
            Math.abs(
                item.creditChange
            );
        }

        if(
            item.creditChange > 0
        ){

            grouped[month]
            .added +=
            item.creditChange;
        }
    });

    Object.keys(
        grouped
    ).forEach(
    month => {

        const row =
        grouped[month];

        let closing =

            row.opening
            +
            row.added
            -
            row.used;

        if(
            closing >
            CONFIG.LEAVE
            .MAX_CARRY_FORWARD
        ){

            row.expired =
            closing
            -
            CONFIG.LEAVE
            .MAX_CARRY_FORWARD;

            closing =
            CONFIG.LEAVE
            .MAX_CARRY_FORWARD;
        }

        ledgerBody.innerHTML +=
        `
        <tr>

            <td>${month}</td>

            <td>${row.opening}</td>

            <td>+${row.added}</td>

            <td>-${row.used}</td>

            <td>-${row.expired}</td>

            <td>${closing.toFixed(1)}</td>

        </tr>
        `;
    });
}

/* =========================
   FILTERS
========================= */

searchInput
?.addEventListener(
'input',
() => {

    renderLeaveTable();
});

monthFilter
?.addEventListener(
'change',
() => {

    renderLeaveTable();
});

/* =========================
   INIT
========================= */

loadEmployees();
renderLeaveTable();
updateCards();
renderLedger();

/* =========================
   END
========================= */

});