/* =========================
   Session Check
========================= */

const currentUser =

Storage.get(
    CONFIG.KEYS.SESSION
);

if(

    !currentUser ||

    Object.keys(
        currentUser
    ).length === 0

){

    window.location.href =
    '../index.html';
}

/* =========================
   Sidebar HTML
========================= */

const role=currentUser.role;
const menus={admin:[
    
       'dashboard',
        'staff',
        'attendance',
        'leave-credits',
        'ot-pay-reports',
        'reports',
        'settings'
    ],

        hr:[
            'dashboard',
            'staff',
            'attendance',
            'leave-credits',
            'reports'
        ],
        
       employee:[

        'dashboard',

        'attendance',

        'leave-credits',

        'ot-pay-reports'
    ] 
};

const allow=menus[role]||[];
const sidebar = `

<aside class="sidebar">

    <div class="logo-section">

        <div class="logo-icon">

            <i class="fa-solid fa-users"></i>

        </div>

        <div class="logo-text">

            <h2>AMS</h2>

            <span>
                Management System
            </span>

        </div>

    </div>

    <ul class="sidebar-menu">

        <li>
            <a href="dashboard.html">
                <i class="fa-solid fa-table-columns"></i>
                <span>Dashboard</span>
            </a>
        </li>

        <li>
            <a href="staff.html">
                <i class="fa-solid fa-users"></i>
                <span>Staff Management</span>
            </a>
        </li>

        <li>
            <a href="attendance.html">
                <i class="fa-solid fa-calendar-check"></i>
                <span>Attendance</span>
            </a>
        </li>

        <li>
            <a href="leave-credits.html">
                <i class="fa-solid fa-wallet"></i>
                <span>Leave Credits</span>
            </a>
        </li>

        <li>
            <a href="ot-pay-reports.html">
                <i class="fa-solid fa-money-bill-wave"></i>
                <span>OT / Pay Reports</span>
            </a>
        </li>

        <li>
            <a href="reports.html">
                <i class="fa-solid fa-chart-pie"></i>
                <span>Reports</span>
            </a>
        </li>

        <li>
            <a href="settings.html">
                <i class="fa-solid fa-gear"></i>
                <span>Settings</span>
            </a>
        </li>

    </ul>

    <div class="sidebar-bottom">

        <a
            href="#"
            id="logoutBtn"
        >

            <i class="fa-solid fa-right-from-bracket"></i>

            <span>
                Logout
            </span>

        </a>

    </div>

</aside>
`;

/* =========================
   Load Sidebar
========================= */

document.getElementById(
    'sidebar-container'
).innerHTML = sidebar;

/* =========================
   Active Menu
========================= */

setActiveMenu();

function setActiveMenu(){

    const currentPage =

    window.location.pathname
    .split('/')
    .pop();

    document
    .querySelectorAll(
        '.sidebar-menu a'
    )
    .forEach(link => {

        if(

            link.getAttribute(
                'href'
            ) === currentPage

        ){

            link.parentElement
            .classList.add(
                'active'
            );
        }
    });
}

/* =========================
   Logout
========================= */

const logoutBtn =
document.getElementById(
    'logoutBtn'
);

logoutBtn?.addEventListener(

    'click',

    logoutUser
);

function logoutUser(e){

    e.preventDefault();

    Storage.remove(
        CONFIG.KEYS.SESSION
    );

    window.location.href =
    '../index.html';
}

/* =========================
   Mobile Toggle
========================= */

const menuToggle =

document.getElementById(
    'menuToggle'
);

const sidebarElement =

document.querySelector(
    '.sidebar'
);

if(menuToggle){

    menuToggle.addEventListener(

        'click',

        () => {

            sidebarElement
            ?.classList.toggle(
                'showSidebar'
            );
        }
    );
}


const map = {

    dashboard: 'dashboard.html',

    staff: 'staff.html',

    attendance: 'attendance.html',

    'leave-credits': 'leave-credits.html',

    'ot-pay-reports': 'ot-pay-reports.html',

    reports: 'reports.html',

    settings: 'settings.html'
};

document
    .querySelectorAll('.sidebar-menu a')
    .forEach(a => {

        const key = Object
            .keys(map)
            .find(
                k =>
                map[k] ===
                a.getAttribute('href')
            );

        if (
            key &&
            !allow.includes(key)
        ) {

            a.parentElement.remove();
        }

    });

    