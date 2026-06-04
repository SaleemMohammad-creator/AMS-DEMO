/* =========================
   OT PAY REPORTS
   JS PART 1
========================= */

document.addEventListener(
'DOMContentLoaded',
() => {

/* =========================
   STORAGE
========================= */

const staffData =
Storage.get(
    CONFIG.KEYS.STAFF,
    []
);

const attendanceData =
Storage.get(
    CONFIG.KEYS.ATTENDANCE,
    []
);

let payrollRecords =
Storage.get(
    CONFIG.KEYS.PAYROLL ||
    'amsPayroll',
    []
);

/* =========================
   PAYROLL DATA SYNC
========================= */

if(
    !Array.isArray(
        staffData
    )
    ||
    staffData.length === 0
){

    payrollRecords = [];

    Storage.set(
        CONFIG.KEYS.PAYROLL ||
        'amsPayroll',
        []
    );
}
else{

    payrollRecords =
    payrollRecords.filter(
        payroll =>

        staffData.some(
            staff =>

            staff.id ===
            payroll.empId
        )
    );

    Storage.set(
        CONFIG.KEYS.PAYROLL ||
        'amsPayroll',
        payrollRecords
    );
}



/* =========================
   ELEMENTS
========================= */

const payrollMonth =
document.getElementById(
    'payrollMonth'
);

const generatePayrollBtn =
document.getElementById(
    'generatePayrollBtn'
);

const exportPayrollBtn =
document.getElementById(
    'exportPayrollBtn'
);

const payrollSearch =
document.getElementById(
    'payrollSearch'
);

const departmentFilter =
document.getElementById(
    'departmentFilter'
);

const statusFilter =
document.getElementById(
    'statusFilter'
);

const payrollTableBody =
document.getElementById(
    'payrollTableBody'
);

const payslipPreview =
document.getElementById(
    'payslipPreview'
);

const payrollModal =
document.getElementById(
    'payrollModal'
);

const modalPayrollContent =
document.getElementById(
    'modalPayrollContent'
);

const closePayrollModal =
document.getElementById(
    'closePayrollModal'
);

const totalEmployeesCard =
document.getElementById(
    'totalEmployeesCard'
);

const totalOtHoursCard =
document.getElementById(
    'totalOtHoursCard'
);

const totalOtAmountCard =
document.getElementById(
    'totalOtAmountCard'
);

const totalPayrollCard =
document.getElementById(
    'totalPayrollCard'
);

/* =========================
   HELPERS
========================= */

function toast(
    msg,
    type='info'
){

    if(
        typeof Utils !==
        'undefined'
        &&
        Utils.toast
    ){
        Utils.toast(
            msg,
            type
        );
    }
}

/* =========================
   TIME TO MINUTES
========================= */

function toMinutes(
    time
){

    if(!time)
    return 0;

    const parts =
    time.split(':');

    return (

        parseInt(
            parts[0]
        ) * 60

        +

        parseInt(
            parts[1]
        )
    );
}

/* =========================
   FORMAT CURRENCY
========================= */

function formatCurrency(
    amount
){

    return `₹${Number(
        amount || 0
    ).toLocaleString(
        'en-IN'
    )}`;
}

/* =========================
   FORMAT HOURS
========================= */

function formatHours(
    hours
){

    const h =
    Math.floor(
        hours
    );

    const m =
    Math.round(
        (
            hours - h
        ) * 60
    );

    if(h <= 0){

        return `${m} mins`;
    }

    return `${h}h ${m}m`;
}

/* =========================
   OT CALCULATION
========================= */
function calculatePayroll(
    employee,
    attendanceRows
){

    let totalOtHours = 0;

    attendanceRows.forEach(row => {

        if (
            row.otMode === 'Pay'
        ) {

            totalOtHours += Number(
                row.ot || 0
            );

        }

    });

    /* Salary */

    const basic =
    Number(
        employee.salary || 0
    );

    const ta =
    Number(
        employee.ta || 0
    );

    const allowance =
    Number(
        employee.allowance || 0
    );

    const shiftAllowance =
    Number(
        employee.shiftAllowance || 0
    );

    const otRate =
    Number(
        employee.otRate || 0
    );

    /* OT Amount */

    const otAmount =
    totalOtHours *
    otRate;

    /* Gross */

    const gross =
        basic +
        ta +
        allowance +
        shiftAllowance +
        otAmount;

    /* Deductions */

    const pf =
    gross * 0.12;

    const esi =
    gross * 0.0075;

    const pt =
    Number(
        employee.pt || 0
    );

    const deduction =
    Number(
        employee.deduction || 0
    );

    /* Net */

    const net =
        gross -
        pf -
        esi -
        pt -
        deduction;

    return {

        otHours:
        totalOtHours,

        otHoursText:
        formatHours(
            totalOtHours
        ),

        otAmount,

        gross,

        pf,

        esi,

        pt,

        deduction,

        net

    };

}

/* =========================
   GENERATE PAYROLL
========================= */

function generatePayroll(){

    const month =
    payrollMonth.value;

    if(!month){

        toast(
            'Select payroll month',
            'warning'
        );

        return;
    }

    payrollRecords = [];

    staffData.forEach(
    employee => {

        const rows =

        attendanceData.filter(
        row => {

            if(
                row.empId !==
                employee.id
            ) return false;

            if(
                !row.date
            ) return false;

            return row.date &&
            row.date.startsWith(
             month
          );
        });

        if(
            rows.length === 0
        ) return;

        const payroll =
        calculatePayroll(
            employee,
            rows
        );

        payrollRecords.push({

            id:
            Utils.uid(),

            empId:
            employee.id,

            employee:
            employee.name,

            department:
            employee.department || '-',

            month,

            otHours:
            payroll.otHours,

            otHoursText:
            payroll.otHoursText,

            otAmount:
            payroll.otAmount,

            gross:
            payroll.gross,

            net:
            payroll.net,

            pf:
            payroll.pf,

            esi:
            payroll.esi,

            pt:
            payroll.pt,

            deduction:
            payroll.deduction,

            ta:
            employee.ta || 0,

            allowance:
            employee.allowance || 0,

            shiftAllowance:
            employee.shiftAllowance || 0,

            status:
            'generated'
        });

    });

    Storage.set(
        CONFIG.KEYS.PAYROLL ||
        'amsPayroll',
        payrollRecords
    );

    renderCards();
    renderPayrollTable();

    toast(
        'Payroll generated successfully',
        'success'
    );
}

/* =========================
   SUMMARY CARDS
========================= */

function renderCards(){

    const employees =
    payrollRecords.length;

    const totalOtHours =
    payrollRecords.reduce(

        (sum,row)=>

            sum +
            Number(
                row.otHours || 0
            ),

        0
    );

    const totalOtAmount =
    payrollRecords.reduce(

        (sum,row)=>

            sum +
            Number(
                row.otAmount || 0
            ),

        0
    );

    const totalPayroll =
    payrollRecords.reduce(

        (sum,row)=>

            sum +
            Number(
                row.net || 0
            ),

        0
    );

    totalEmployeesCard.textContent =
    employees;

    totalOtHoursCard.textContent =
      isNaN(totalOtHours)
     ? '0 mins'
    : formatHours(
    totalOtHours
    );

    totalOtAmountCard.textContent =
    formatCurrency(
        totalOtAmount
    );

    totalPayrollCard.textContent =
    formatCurrency(
        totalPayroll
    );
}

/* =========================
   LOAD DEPARTMENTS
========================= */

function loadDepartments(){

    if(
        !departmentFilter
    ) return;

    const departments =
    [

        ...new Set(

            staffData
            .map(
                s =>
                s.department
            )
            .filter(
                Boolean
            )
        )
    ];

    departmentFilter.innerHTML =
    `
    <option value="">
        All Departments
    </option>
    `;

    departments.forEach(
    dept => {

        departmentFilter.innerHTML +=
        `
        <option value="${dept}">
            ${dept}
        </option>
        `;
    });
}

/* =========================
   PAYROLL TABLE
========================= */

function renderPayrollTable(){

    if(
        !payrollTableBody
    ) return;

    payrollTableBody.innerHTML =
    '';

    const search =
    payrollSearch
    ?.value
    ?.toLowerCase()
    || '';

    const dept =
    departmentFilter
    ?.value
    || '';

    const status =
    statusFilter
    ?.value
    || '';

    const filtered =
    payrollRecords.filter(
    row => {

        const matchSearch =

            row.employee
            ?.toLowerCase()
            .includes(
                search
            )

            ||

            row.empId
            ?.toLowerCase()
            .includes(
                search
            );

        const matchDept =

            !dept
            ||
            row.department
            === dept;

        const matchStatus =

            !status
            ||
            row.status
            === status;

        return (

            matchSearch
            &&
            matchDept
            &&
            matchStatus
        );
    });

  if(
    filtered.length === 0
){

    payrollTableBody.innerHTML =
    `
    <tr>

        <td
            colspan="8"
            class="empty-state"
        >

            No payroll records available

        </td>

    </tr>
    `;

    return;
}

    filtered.forEach(
    row => {

        payrollTableBody.innerHTML +=
        `
        <tr>

            <td>
                ${row.empId}
            </td>

            <td>
                ${row.employee}
            </td>

            <td>
                ${row.department}
            </td>

            <td>
              ${
               row.otHoursText
                 ||
                formatHours(
               row.otHours || 0
              )
          }
         </td>

            <td>
                ${formatCurrency(
                    row.otAmount
                )}
            </td>

            <td>
                ${formatCurrency(
                    row.gross
                )}
            </td>

            <td>
                ${formatCurrency(
                    row.net
                )}
            </td>

            <td>

                <div
                    class="action-group"
                >

                    <button
                        class="view-btn"
                        data-id="${row.id}"
                        title="View"
                    >
                        <i
                            class="fa-solid fa-eye"
                        ></i>
                    </button>

                    <button
                        class="download-btn"
                        data-id="${row.id}"
                        title="Download"
                    >
                        <i
                            class="fa-solid fa-download"
                        ></i>
                    </button>

                    <button
                        class="print-btn"
                        data-id="${row.id}"
                        title="Print"
                    >
                        <i
                            class="fa-solid fa-print"
                        ></i>
                    </button>

                </div>

            </td>

        </tr>
        `;
    });
}

/* =========================
   PAYSLIP PREVIEW
========================= */

function renderPayslip(
    id
){

    const payroll =
    payrollRecords.find(
        p =>
        p.id === id
    );

    if(
        !payroll
    ) return;

    modalPayrollContent.innerHTML =
    `
    <div class="payslip-preview">

        <div class="payslip-header">

            <h3>
                AMS Payroll
            </h3>

            <span>
                ${payroll.month}
            </span>

        </div>

        <div class="payslip-row">
            <span>Employee</span>
            <strong>${payroll.employee}</strong>
        </div>

        <div class="payslip-row">
            <span>Employee ID</span>
            <strong>${payroll.empId}</strong>
        </div>

        <div class="payslip-row">
            <span>Department</span>
            <strong>${payroll.department}</strong>
        </div>

        <div class="payslip-block">

            <h4>
                Earnings
            </h4>

            <div class="payslip-row">
                <span>OT Hours</span>
                <strong>${payroll.otHoursText}</strong>
            </div>

            <div class="payslip-row">
                <span>OT Amount</span>
                <strong>
                    ${formatCurrency(
                        payroll.otAmount
                    )}
                </strong>
            </div>

            <div class="payslip-row">
                <span>Gross Pay</span>
                <strong>
                    ${formatCurrency(
                        payroll.gross
                    )}
                </strong>
            </div>

        </div>

        <div class="payslip-block">

            <h4>
                Deductions
            </h4>

            <div class="payslip-row">
                <span>PF</span>
                <strong>
                    ${formatCurrency(
                        payroll.pf
                    )}
                </strong>
            </div>

            <div class="payslip-row">
                <span>ESI</span>
                <strong>
                    ${formatCurrency(
                        payroll.esi
                    )}
                </strong>
            </div>

            <div class="payslip-row">
                <span>PT</span>
                <strong>
                    ${formatCurrency(
                        payroll.pt
                    )}
                </strong>
            </div>

        </div>

        <div class="payslip-total">

            <span>
                Net Salary
            </span>

            <strong>
                ${formatCurrency(
                    payroll.net
                )}
            </strong>

        </div>

    </div>
    `;

    payrollModal.classList.add(
        'active'
    );
}

/* =========================
   DOWNLOAD
========================= */

function downloadPayslip(){

    if(
        !payslipPreview
    ) return;

    const blob =
    new Blob(
        [
            payslipPreview
            .innerHTML
        ],
        {
            type:
            'text/html'
        }
    );

    const url =
    URL.createObjectURL(
        blob
    );

    const a =
    document.createElement(
        'a'
    );

    a.href = url;
    a.download =
    'Payslip.html';

    a.click();

    URL.revokeObjectURL(
        url
    );
}

/* =========================
   PRINT
========================= */

function printPayslip(){

    const win =
    window.open(
        '',
        '_blank'
    );

    win.document.write(
        payslipPreview
        .innerHTML
    );

    win.document.close();
    win.print();
}

/* =========================
   EXPORT
========================= */

function exportPayroll(){

    const data =
    JSON.stringify(
        payrollRecords,
        null,
        2
    );

    const blob =
    new Blob(
        [data],
        {
            type:
            'application/json'
        }
    );

    const url =
    URL.createObjectURL(
        blob
    );

    const a =
    document.createElement(
        'a'
    );

    a.href = url;
    a.download =
    'Payroll-Report.json';

    a.click();

    URL.revokeObjectURL(
        url
    );

    toast(
        'Payroll exported',
        'success'
    );
}

/* =========================
   EVENTS
========================= */

generatePayrollBtn
?.addEventListener(
    'click',
    generatePayroll
);

exportPayrollBtn
?.addEventListener(
    'click',
    exportPayroll
);

payrollSearch
?.addEventListener(
    'input',
    renderPayrollTable
);

departmentFilter
?.addEventListener(
    'change',
    renderPayrollTable
);

statusFilter
?.addEventListener(
    'change',
    renderPayrollTable
);

/* Table Actions */

document.addEventListener(
'click',
e => {

    const btn =
    e.target.closest(
        'button'
    );

    if(
        !btn
    ) return;

    const id =
    btn.dataset.id;

    if(
        btn.classList.contains(
            'view-btn'
        )
    ){
        renderPayslip(
            id
        );
    }

    if(
        btn.classList.contains(
            'download-btn'
        )
    ){
        downloadPayslip();
    }

    if(
        btn.classList.contains(
            'print-btn'
        )
    ){
        printPayslip();
    }
});

/* =========================
   INITIAL LOAD
========================= */

loadDepartments();

renderCards();

renderPayrollTable();

/* =========================
   CLOSE MODAL
========================= */

closePayrollModal
?.addEventListener(
    'click',
    () => {

        payrollModal.classList.remove(
            'active'
        );

    }
);

payrollModal
?.addEventListener(
    'click',
    e => {

        if(
            e.target ===
            payrollModal
        ){

            payrollModal.classList.remove(
                'active'
            );
        }

    }
);

/* =========================
   END
========================= */

});