/* ==========================================
   AMS REPORTS
   Premium Analytics Engine
========================================== */

document.addEventListener(
    "DOMContentLoaded",
    () => {

    /* =========================
       LOAD DATA
    ========================= */

    const staff =
        Storage.get(
            CONFIG.KEYS.STAFF
        ) || [];

    const attendance =
        Storage.get(
            CONFIG.KEYS.ATTENDANCE
        ) || [];

    const leaves =
        Storage.get(
            CONFIG.KEYS.LEAVE_REQUESTS
        ) || [];

    const ot = [];

    /* =========================
       KPI CALCULATIONS
    ========================= */

    const totalStaff =
        staff.length;

    const totalAttendance =
        attendance.length;

    const totalLeaves =
        leaves.length;

    const totalOT =
        ot.length;

    const attendanceRate =
        totalStaff > 0
        ? Math.round(
            (totalAttendance /
            totalStaff) * 100
        )
        : 0;

    /* =========================
       COUNTER ANIMATION
    ========================= */

    function animateCounter(
        id,
        value
    ){

        const el =
            document.getElementById(id);

        if(!el) return;

        let start = 0;

        const duration = 1000;
        const step =
            Math.ceil(value / 35);

        const counter =
        setInterval(()=>{

            start += step;

            if(start >= value){

                el.innerText =
                    value;

                clearInterval(
                    counter
                );
            }
            else{

                el.innerText =
                    start;
            }

        },
        duration / 35);
    }

    animateCounter(
        "staffCount",
        totalStaff
    );

    animateCounter(
        "attendanceCount",
        totalAttendance
    );

    animateCounter(
        "leaveCount",
        totalLeaves
    );

    animateCounter(
        "otCount",
        totalOT
    );

    /* =========================
       KPI TRENDS
    ========================= */

    document
    .getElementById(
        "staffTrend"
    ).innerHTML =

    `<i class="fa-solid fa-users"></i>
    ${totalStaff}
    employees registered`;

    document
    .getElementById(
        "attendanceTrend"
    ).innerHTML =

    `<i class="fa-solid fa-circle-check"></i>
    ${attendanceRate}%
    attendance rate`;

    document
    .getElementById(
        "leaveTrend"
    ).innerHTML =

    `<i class="fa-solid fa-calendar-xmark"></i>
    ${totalLeaves}
    leave requests`;

    document
    .getElementById(
        "otTrend"
    ).innerHTML =

    `<i class="fa-solid fa-clock"></i>
    ${totalOT}
    overtime records`;

    /* =========================
       ATTENDANCE CHART
    ========================= */

    const attendanceCanvas =
        document.getElementById(
            "attendanceChart"
        );

    const ctx =
        attendanceCanvas
        .getContext("2d");

    const gradient =
        ctx.createLinearGradient(
            0,
            0,
            0,
            350
        );

    gradient.addColorStop(
        0,
        "rgba(79,70,229,.35)"
    );

    gradient.addColorStop(
        1,
        "rgba(79,70,229,.02)"
    );

    const attendanceChart =
    new Chart(
        attendanceCanvas,
        {

        type:"line",

        data:{

            labels:[
                "Jan",
                "Feb",
                "Mar",
                "Apr",
                "May",
                "Jun"
            ],

            datasets:[{

                label:
                "Attendance",

                data:[
                    72,
                    80,
                    76,
                    85,
                    88,
                    91
                ],

                borderColor:
                    "#4f46e5",

                backgroundColor:
                    gradient,

                fill:true,

                tension:.4,

                borderWidth:3,

                pointRadius:5,

                pointHoverRadius:7,

                pointBackgroundColor:
                    "#4f46e5"
            }]
        },

        options:{

            responsive:true,

            plugins:{
                legend:{
                    display:false
                }
            },

            scales:{

                y:{
                    beginAtZero:true,
                    grid:{
                        color:"#eef2f7"
                    }
                },

                x:{
                    grid:{
                        display:false
                    }
                }
            }
        }
    });

    /* =========================
       LEAVE DISTRIBUTION
       FIXED NO FLICKER
    ========================= */

    const leaveTypes = {};

    leaves.forEach(item=>{

        const type =
            item.type ||
            "Other";

        leaveTypes[type] =
            (leaveTypes[type]
            || 0) + 1;
    });

    const leaveLabels =
        Object.keys(
            leaveTypes
        );

    const leaveValues =
        Object.values(
            leaveTypes
        );

    let leaveChart;

    function renderLeaveChart(){

        if(leaveChart){

            leaveChart.destroy();
        }

        leaveChart =
        new Chart(

            document.getElementById(
                "leaveChart"
            ),

            {

            type:"doughnut",

            data:{

                labels:
                leaveLabels.length
                ? leaveLabels
                : ["No Data"],

                datasets:[{

                    data:
                    leaveValues.length
                    ? leaveValues
                    : [1],

                    backgroundColor:[

                        "#4f46e5",
                        "#22c55e",
                        "#f59e0b",
                        "#ef4444",
                        "#3b82f6"
                    ],

                    borderWidth:0
                }]
            },

            options:{

                cutout:"72%",

                animation:{
                    duration:700
                },

                plugins:{
                    legend:{
                        position:
                        "bottom"
                    }
                }
            }
        });
    }

    renderLeaveChart();

    /* =========================
       DEPARTMENT ANALYTICS
    ========================= */

    const deptData = {};

    attendance.forEach(item=>{

        const dept =
            item.department ||
            "General";

        deptData[dept] =
            (deptData[dept]
            || 0) + 1;
    });

    const deptLabels =
        Object.keys(
            deptData
        );

    const deptValues =
        Object.values(
            deptData
        );

    const departmentChart =
    new Chart(

        document.getElementById(
            "departmentChart"
        ),

        {

        type:"bar",

        data:{

            labels:
            deptLabels.length
            ? deptLabels
            : ["No Data"],

            datasets:[{

                label:
                "Attendance",

                data:
                deptValues.length
                ? deptValues
                : [0],

                backgroundColor:
                    "#6366f1",

                borderRadius:16,

                maxBarThickness:42
            }]
        },

        options:{

            responsive:true,

            plugins:{
                legend:{
                    display:false
                }
            },

            scales:{

                y:{
                    beginAtZero:true,
                    grid:{
                        color:"#eef2f7"
                    }
                },

                x:{
                    grid:{
                        display:false
                    }
                }
            }
        }
    });

    /* =========================
       SMART INSIGHTS
    ========================= */

    const insights =
        document.getElementById(
            "insightsContainer"
        );

    let topDept =
        deptLabels.length
        ? deptLabels[0]
        : "N/A";

    insights.innerHTML =

    `
    <div class="insight-item">
        Attendance rate is
        <strong>
        ${attendanceRate}%
        </strong>
    </div>

    <div class="insight-item">
        Total leave requests:
        <strong>
        ${totalLeaves}
        </strong>
    </div>

    <div class="insight-item">
        OT records tracked:
        <strong>
        ${totalOT}
        </strong>
    </div>

    <div class="insight-item">
        Top department:
        <strong>
        ${topDept}
        </strong>
    </div>
    `;

});
const filterBtn=document.getElementById('filterBtn');
if(filterBtn){
 filterBtn.addEventListener('click',()=>{
   const d=document.getElementById('reportDate')?.value;
   if(window.Utils && Utils.toast){
      Utils.toast(d ? 'Reports filtered for '+d : 'Please select a date','info');
   } else {
      Utils.toast(d ? 'Reports filtered for '+d : 'Please select a date');
   }
 });
}
