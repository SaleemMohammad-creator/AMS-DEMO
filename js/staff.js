document.addEventListener(
'DOMContentLoaded',
() => {

/* =========================
   Elements
========================= */

const modalOverlay =
document.getElementById(
    'modalOverlay'
);

const openModalBtn =
document.getElementById(
    'openModalBtn'
);

const closeModalBtn =
document.getElementById(
    'closeModalBtn'
);

const cancelBtn =
document.getElementById(
    'cancelBtn'
);

const resetBtn =
document.getElementById(
    'resetBtn'
);

const staffForm =
document.getElementById(
    'staffForm'
);

const staffTableBody =
document.getElementById(
    'staffTableBody'
);

const searchInput =
document.getElementById(
    'searchInput'
);

const modalTitle =
document.getElementById(
    'modalTitle'
);

const employeeIdField =
document.getElementById(
    'employeeId'
);


/* =========================
   Storage
========================= */

let staffData =

Storage.get(CONFIG.KEYS.STAFF, []);

let editIndex =
    null;


/* =========================
   Modal Controls
========================= */

function openModal(){

    modalOverlay.classList.add(
        'show'
    );

    /* Generate ID */

    if(
        editIndex === null
    ){

        employeeIdField.value =

        Utils.generateEmployeeId(
            staffData
        );

        employeeIdField.readOnly =
            true;
    }
}

function closeModal(){

    modalOverlay.classList.remove(
        'show'
    );

    staffForm.reset();

    employeeIdField.value =
        '';

    employeeIdField.readOnly =
        true;

    editIndex =
        null;

    modalTitle.innerText =
        'Add Employee';
}


/* Open */

openModalBtn
?.addEventListener(

    'click',

    openModal
);

/* Close */

closeModalBtn
?.addEventListener(

    'click',

    closeModal
);

cancelBtn
?.addEventListener(

    'click',

    closeModal
);

/* Overlay Close */

modalOverlay
?.addEventListener(

    'click',

    e => {

        if(
            e.target ===
            modalOverlay
        ){

            closeModal();
        }
    }
);


/* =========================
   Reset Form
========================= */

resetBtn
?.addEventListener(

    'click',

    () => {

        staffForm.reset();

        if(
            editIndex ===
            null
        ){

            modalTitle.innerText =
            'Add Employee';

            employeeIdField.value =

            Utils.generateEmployeeId(
                staffData
            );
        }
    }
);


/* =========================
   Save Staff
========================= */

staffForm
?.addEventListener(

    'submit',

    saveStaff
);

function saveStaff(e){

    e.preventDefault();

    const employee = {

        id:

        employeeIdField.value
        .trim(),

        name:

        document
        .getElementById(
            'employeeName'
        )
        .value
        .trim(),

        role:

        document
        .getElementById(
            'employeeRole'
        )
        .value
        .trim(),

        department:

        document
        .getElementById(
            'employeeDepartment'
        )
        .value
        .trim(),

        email:

        document
        .getElementById(
            'employeeEmail'
        )
        .value
        .trim(),

        phone:

        document
        .getElementById(
            'employeePhone'
        )
        .value
        .trim(),

        joining:

        document
        .getElementById(
            'joiningDate'
        )
        .value,

        salary: parseFloat(document.getElementById('employeeSalary').value || 0),
        otRate: parseFloat(document.getElementById('employeeOTRate').value || 0),
        allowance: parseFloat(document.getElementById('employeeAllowance').value || 0),
        pf: parseFloat(document.getElementById('employeePF').value || 0),
        esi: parseFloat(document.getElementById('employeeESI').value || 0),
        payrollStatus: document.getElementById('employeePayrollStatus').value
    };

    /* Edit */

    if(
        editIndex !==
        null
    ){

        staffData[
            editIndex
        ] =
        employee;

        showToast(
            'Employee Updated',
            'success'
        );
    }

    /* Add */

    else{

        staffData.push(
            employee
        );

        showToast(
            'Employee Added',
            'success'
        );
    }

    saveToLocal();

    loadStaffTable();

    closeModal();
}


/* =========================
   Save Local
========================= */

function saveToLocal(){

    Storage.set(

        CONFIG.KEYS.STAFF,

        staffData
    );
}


/* =========================
   Load Table
========================= */

function loadStaffTable(){

    if(
        !staffTableBody
    ) return;

    staffTableBody.innerHTML =
        '';

    staffData.forEach(

        (
            employee,
            index
        ) => {

        const row = `

        <tr>

            <td>
                ${employee.id}
            </td>

            <td>
                ${employee.name}
            </td>

            <td>
                ${employee.role}
            </td>

            <td>
                ${employee.department}
            </td>

            <td>
                ${employee.email}
            </td>

            <td>
                ${employee.phone}
            </td>

            <td>
                ${employee.joining}
            </td>

            <td>

                <div class="action-buttons">

                    <button
                        class="edit-btn"
                        data-index="${index}"
                    >
                        <i class="fa-solid fa-pen"></i>
                    </button>

                    <button
                        class="delete-btn"
                        data-index="${index}"
                    >
                        <i class="fa-solid fa-trash"></i>
                    </button>

                </div>

            </td>

        </tr>
        `;

        staffTableBody
        .insertAdjacentHTML(

            'beforeend',

            row
        );
    });

    attachActions();
}


/* =========================
   Attach Actions
========================= */

function attachActions(){

    document
    .querySelectorAll(
        '.edit-btn'
    )
    .forEach(btn => {

        btn.addEventListener(

            'click',

            () => {

                editStaff(
                    btn.dataset.index
                );
            }
        );
    });

    document
    .querySelectorAll(
        '.delete-btn'
    )
    .forEach(btn => {

        btn.addEventListener(

            'click',

            () => {

                deleteStaff(
                    btn.dataset.index
                );
            }
        );
    });
}

/* =========================
   Edit Staff
========================= */

function editStaff(index){

    const employee =
        staffData[index];

    if(
        !employee
    ) return;

    editIndex =
        index;

    employeeIdField.value =
        employee.id;

    employeeIdField.readOnly =
        true;

    document
    .getElementById(
        'employeeName'
    )
    .value =
        employee.name;

    document
    .getElementById(
        'employeeRole'
    )
    .value =
        employee.role;

    document
    .getElementById(
        'employeeDepartment'
    )
    .value =
        employee.department;

    document
    .getElementById(
        'employeeEmail'
    )
    .value =
        employee.email;

    document
    .getElementById(
        'employeePhone'
    )
    .value =
        employee.phone;

    document
    .getElementById(
        'joiningDate'
    )
    .value =
        employee.joining;

    document.getElementById('employeeSalary').value = employee.salary || '';
    document.getElementById('employeeOTRate').value = employee.otRate || '';
    document.getElementById('employeeAllowance').value = employee.allowance || 0;
    document.getElementById('employeePF').value = employee.pf || 12;
    document.getElementById('employeeESI').value = employee.esi || 0.75;
    document.getElementById('employeePayrollStatus').value = employee.payrollStatus || 'Active';

    modalTitle.innerText =
        'Edit Employee';

    modalOverlay.classList.add(
        'show'
    );
}


/* =========================
   Delete Staff
========================= */

function deleteStaff(index){

    if(

        confirm(
            'Delete this employee?'
        )

    ){

        staffData.splice(
            index,
            1
        );

        saveToLocal();

        loadStaffTable();

        showToast(

            'Employee Deleted',

            'error'
        );
    }
}


/* =========================
   Search
========================= */

searchInput
?.addEventListener(

    'input',

    searchEmployee
);

function searchEmployee(){

    const value =

        searchInput.value
        .toLowerCase()
        .trim();

    const rows =

        document.querySelectorAll(
            '#staffTableBody tr'
        );

    rows.forEach(
        row => {

            row.style.display =

            row.innerText
            .toLowerCase()
            .includes(value)

            ? ''

            : 'none';
        }
    );
}


/* =========================
   Toast
========================= */

function showToast(

    message,
    type

){

    const toast =

        document.createElement(
            'div'
        );

    toast.className =

        `toast ${type}`;

    toast.innerText =
        message;

    document.body.appendChild(
        toast
    );

    setTimeout(

        () =>

        toast.classList.add(
            'show'
        ),

        100
    );

    setTimeout(

        () => {

            toast.classList.remove(
                'show'
            );

            setTimeout(

                () =>
                    toast.remove(),

                300
            );
        },

        2500
    );
}


/* =========================
   Toast Styles
========================= */

const style =

document.createElement(
    'style'
);

style.innerHTML = `

.toast{

    position:fixed;

    top:30px;
    right:30px;

    padding:16px 24px;

    border-radius:16px;

    color:#fff;

    font-size:14px;
    font-weight:500;

    transform:
        translateX(120%);

    transition:.35s;

    z-index:5000;
}

.toast.show{

    transform:
        translateX(0);
}

.toast.success{

    background:
        #22c55e;
}

.toast.error{

    background:
        #ef4444;
}
`;

document.head.appendChild(
    style
);


/* =========================
   Initial Load
========================= */

loadStaffTable();

});