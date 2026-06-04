document.addEventListener(
'DOMContentLoaded',
() => {

/* =========================
   Storage
========================= */

const staffData =

Storage.get(
    CONFIG.KEYS.STAFF
);

const attendanceData =

Storage.get(
    CONFIG.KEYS.ATTENDANCE
);

const leaveRequests =

Storage.get(
    CONFIG.KEYS.LEAVE_REQUESTS
);


/* =========================
   Dashboard Card Elements
========================= */

const totalEmployees =
document.getElementById(
    'totalEmployees'
);

const presentEmployees =
document.getElementById(
    'presentEmployees'
);

const halfDayEmployees =
document.getElementById(
    'halfDayEmployees'
);

const fullLeaveEmployees =
document.getElementById(
    'fullLeaveEmployees'
);

const weekOffEmployees =
document.getElementById(
    'weekOffEmployees'
);


/* =========================
   Overview Elements
========================= */

const overviewTableBody =
document.getElementById(
    'overviewTableBody'
);

const overviewDate =
document.getElementById(
    'overviewDate'
);

const overviewSearch =
document.getElementById(
    'overviewSearch'
);


/* =========================
   Bottom Section
========================= */

const negativeCreditsBody =
document.getElementById(
    'negativeCreditsBody'
);

const otRecordsBody =
document.getElementById(
    'otRecordsBody'
);

const negativeAlertCount =
document.getElementById(
    'negativeAlertCount'
);

const leaveCreditsChart =
document.getElementById(
    'leaveCreditsChart'
);


/* =========================
   Dashboard Cards
========================= */

function updateDashboardCards(){

    if(
        totalEmployees
    ){

        totalEmployees.textContent =

            staffData.length;
    }

    let present = 0;
    let half = 0;
    let leave = 0;
    let week = 0;

    attendanceData.forEach(
        record => {

        const status =

            (
                record.status || ''
            )
            .toLowerCase();

        const type =

            (
                record.type || ''
            )
            .toLowerCase();

        /* Present */

        if(

            type ===
            'present'

            ||

            status.includes(
                'late'
            )

        ){

            present++;
        }

        /* Half */

        if(

            status.includes(
                'half'
            )

        ){

            half++;
        }

        /* Leave */

        if(

            type ===
            'leave'

        ){

            leave++;
        }

        /* Week */

        if(

            type ===
            'week off'

        ){

            week++;
        }
    });

    if(
        presentEmployees
    ){

        presentEmployees.textContent =
            present;
    }

    if(
        halfDayEmployees
    ){

        halfDayEmployees.textContent =
            half;
    }

    if(
        fullLeaveEmployees
    ){

        fullLeaveEmployees.textContent =
            leave;
    }

    if(
        weekOffEmployees
    ){

        weekOffEmployees.textContent =
            week;
    }
}


/* =========================
   Status Badge
========================= */

function getStatusClass(
    status
){

    status =
    (
        status || ''
    )
    .toLowerCase();


    /* Late + Half Day */

    if(

        status.includes(
            'late'
        )

        &&

        status.includes(
            'half'
        )
    ){

        return 'late-halfday';
    }


    /* Late */

    if(
        status.includes(
            'late'
        )
    ){

        return 'late';
    }


    /* Half Day */

    if(
        status.includes(
            'half'
        )
    ){

        return 'half';
    }


    /* Leave */

    if(
        status.includes(
            'leave'
        )
    ){

        return 'leave';
    }


    /* Week Off */

    if(
        status.includes(
            'week'
        )
    ){

        return 'weekoff';
    }

    return 'present';
}

/* =========================
   Credit Badge
========================= */

function getCreditClass(
    value
){

    if(
        value > 0
    )
        return 'credit-positive';

    if(
        value < 0
    )
        return 'credit-negative';

    return 'credit-zero';
}


/* =========================
   Employee Leave Balance
========================= */

function calculateEmployeeBalance(
    empId
){

    let used = 0;
    let benefits = 0;

    leaveRequests
    .filter(
        item =>

        item.empId ===
        empId
    )
    .forEach(
        item => {

        /* Approved */

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

        /* Benefits */

        if(

            item.creditChange > 0

        ){

            benefits +=

            item.creditChange;
        }
    });

    let balance =

        CONFIG.LEAVE
        .MONTHLY_CREDIT

        +

        benefits

        -

        used;

    /* Carry Limit */

    balance = Math.min(

        balance,

        CONFIG.LEAVE
        .MAX_CARRY_FORWARD
    );

    return Number(
        balance.toFixed(1)
    );
}

/* =========================
   Attendance Overview
========================= */

function renderOverviewTable(){

    let filtered =

        [...attendanceData];

    /* Date Filter */

    if(
        overviewDate?.value
    ){

        filtered =

        filtered.filter(
            row =>

            row.date ===
            overviewDate.value
        );
    }

    /* Search */

    const query =

        (
            overviewSearch
            ?.value || ''
        )
        .toLowerCase()
        .trim();

    if(query){

        filtered =

        filtered.filter(
            row =>

            (
                row.empId + ''
            )
            .toLowerCase()
            .includes(
                query
            )

            ||

            (
                row.name || ''
            )
            .toLowerCase()
            .includes(
                query
            )
        );
    }

    if(
        !overviewTableBody
    ) return;

    overviewTableBody.innerHTML =
        '';

    filtered.forEach(
        row => {

        const credit =

        calculateEmployeeBalance(
            row.empId
        );

        const sign =

            credit > 0
            ? '+'
            : '';

        overviewTableBody.innerHTML +=

        `
        <tr>

            <td>
                ${row.empId || '-'}
            </td>

            <td>
                ${row.name || '-'}
            </td>

            <td>
                ${row.dept || '-'}
            </td>

            <td>
                ${row.role || '-'}
            </td>

            <td>
                ${row.login || '-'}
            </td>

            <td>
                ${row.break || '-'}
            </td>

            <td>
                 ${row.logout || '-'}
            </td>

            <td>
                ${row.working || 0}
                hrs
            </td>

            <td>

                <span
                    class="
                    status-badge
                    ${getStatusClass(
                        row.status
                    )}
                    "
                >
                    ${row.status || '-'}
                </span>

            </td>

            <td>

                <span
                    class="
                    credit-badge
                    ${getCreditClass(
                        credit
                    )}
                    "
                >
                    ${sign}${credit}
                </span>

            </td>

        </tr>
        `;
    });
}


/* =========================
   Format Hours
========================= */

function formatHours(hours){

    const h =
        Math.floor(hours);

    const m =
        Math.round(
            (hours - h) * 60
        );

    /* Only minutes */

    if(h === 0){

        return `${m} mins`;
    }

    /* Hours + Minutes */

    return `${h}h ${m}m`;
}




/* =========================
   Bottom Section
========================= */

function renderBottomSection(){

    let positive = 0;
    let zero = 0;
    let negative = 0;

    /* Clear */

    if(
        negativeCreditsBody
    ){

        negativeCreditsBody.innerHTML =
            '';
    }

    if(
        otRecordsBody
    ){

        otRecordsBody.innerHTML =
            '';
    }


    /* =========================
       Leave Credit Analysis
    ========================= */

    staffData.forEach(
      employee => {

     const credit =

      calculateEmployeeBalance(
        employee.empId || employee.id
    );

        /* Positive */

        if(
            credit > 0
        ){

            positive++;
        }

        /* Negative */

        else if(
            credit < 0
        ){

            negative++;
        }

        /* Zero */

        else{

            zero++;
        }

        /* Negative Credits Table */

        if(

            credit < 0
            &&
            negativeCreditsBody

        ){

            negativeCreditsBody.innerHTML +=

            `
            <tr>

                <td>
                    ${employee.empId || employee.id}
                </td>

                <td>
                    ${employee.name}
                </td>

                <td
                    class="
                    credit-negative
                    "
                >
                    ${credit}
                </td>

            </tr>
            `;
        }
    });


    /* =========================
   OT Records
========================= */

attendanceData
.filter(
    item =>

    parseFloat(
        item.ot || 0
    ) > 0
)
.slice(
    0,
    5
)
.forEach(
    item => {

    if(
        otRecordsBody
    ){

        otRecordsBody.innerHTML +=

        `
        <tr>

            <td>
                ${item.empId}
            </td>

            <td>
                ${item.date || '-'}
            </td>

            <td>
                ${formatHours(
                parseFloat(
                item.ot || 0
               )
         )}
         </td>

            <td>
                ${
                   item.otMode
                  ? item.otMode
                  : (
                  parseFloat(item.ot || 0) > 0
                 ? 'Pay'
                 : '-'
                   )
                }
            </td>

            <!-- Details -->

            <td>
               <button
                  class="view-btn"
                  title="View OT Details"
                  onclick="viewOTDetails(
                  '${item.empId}',
                   '${item.date}'
                   )"
                >

               <i class="fa-solid fa-eye"></i>

               View

             </button>

            </td>

        </tr>
        `;
    }
});



    /* =========================
       Negative Alert
    ========================= */

    if(
        negativeAlertCount
    ){

        if(negative > 0){
            negativeAlertCount.innerHTML = `<i class="fa-solid fa-triangle-exclamation"></i> ${negative} Employees have Negative Credits`;
            negativeAlertCount.style.color = '#dc2626';
            negativeAlertCount.style.fontWeight = '700';
        } else {
            negativeAlertCount.innerHTML = `0 Employees have Negative Credits`;
            negativeAlertCount.style.color = '#15803d';
        }
    }

/* =========================
   Leave Credit Chart
========================= */

if(

    window.Chart
    &&
    leaveCreditsChart

){

    /* No Employees */

    if(
        staffData.length === 0
    ){
        zero = 1;
    }

    const chartData = [

        positive,
        zero,
        negative
    ];

    /* Update Existing */

    if(

        window.leaveChartInstance

    ){

        window.leaveChartInstance
        .data.datasets[0].data =
        chartData;

        window.leaveChartInstance
        .update('none');
    }

    /* Create Once */

    else{

        window.leaveChartInstance =

        new Chart(

            leaveCreditsChart,

            {

                type:'doughnut',

                data:{

                    labels:[

                        'Positive Credits',
                        'Zero Credits',
                        'Negative Credits'
                    ],

                    datasets:[{

                        data:
                            chartData,

                        backgroundColor:[

                            '#22c55e',
                            '#9ca3af',
                            '#ef4444'
                        ],

                        borderWidth:0,

                        hoverOffset:6
                    }]
                },

                options:{

                    responsive:true,

                    maintainAspectRatio:false,

                    animation:{
                        duration:0
                    },

                    plugins:{

                        legend:{
                            display:false
                        }
                    },

                    cutout:'68%'
                }
            }
        );
    }
}

/* CLOSE renderBottomSection */
}

/* =========================
   Events
========================= */

overviewDate
?.addEventListener(

    'change',

    () => {

        renderOverviewTable();
        renderBottomSection();
    }
);

overviewSearch
?.addEventListener(

    'input',

    () => {

        renderOverviewTable();
        renderBottomSection();
    }
);


/* =========================
   Storage Sync
========================= */

window.addEventListener(

    'storage',

    () => {

        renderOverviewTable();
        renderBottomSection();
        updateDashboardCards();
    }
);


/* =========================
   Initial Load
========================= */

updateDashboardCards();

renderOverviewTable();

renderBottomSection();

});

/* =========================
   OT DETAILS MODAL
========================= */

window.viewOTDetails =
function(
    empId,
    date
){

    /* Reload Storage */

    const attendanceData =

        Storage.get(
            CONFIG.KEYS.ATTENDANCE
        ) || [];

    const record =

    attendanceData.find(
        item =>

        item.empId == empId
        &&
        item.date == date
    );

    if(!record){

        console.log(
            'OT record not found'
        );

        return;
    }

    document
    .getElementById(
        'otModalContent'
    )
    .innerHTML =

    `
    <p>
        <strong>Employee ID:</strong>
        ${record.empId}
    </p>

    <p>
        <strong>Date:</strong>
        ${record.date || '-'}
    </p>

    <p>
        <strong>OT Hours:</strong>
        ${record.ot || 0}
    </p>

    <p>
        <strong>Mode:</strong>
          ${
            record.otMode
            ? record.otMode
            : (
            parseFloat(record.ot || 0) > 0
            ? 'Pay'
            : '-'
            )
         }
    </p>

    <p>
        <strong>Status:</strong>
        ${record.status || '-'}
    </p>

    <p>
        <strong>Working Hours:</strong>
        ${record.working || 0} hrs
    </p>
    `;

    document
    .getElementById(
        'otModal'
    )
    .classList
    .add('show');
};


/* CLOSE MODAL */

window.closeOTModal =
function(){

    document
    .getElementById(
        'otModal'
    )
    .classList
    .remove('show');
};

const systemUpdateStatus = document.getElementById('systemUpdateStatus');
if(systemUpdateStatus){
    const now = new Date();
    const formatted = now.toLocaleString('en-GB',{
        day:'2-digit',
        month:'2-digit',
        year:'numeric',
        hour:'2-digit',
        minute:'2-digit'
    }).replace(',', '');
    systemUpdateStatus.innerHTML = `System is up to date • Last updated: ${formatted}`;
}
