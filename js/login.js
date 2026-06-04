/* =========================
   Default Users
========================= */

const defaultUsers = [

    {
        role:'admin',
        username:'admin',
        password:'admin123'
    },

    {
        role:'hr',
        username:'hr',
        password:'hr123'
    },

    {
        role:'employee',
        username:'employee',
        password:'emp123'
    }
];

/* =========================
   Initialize Users
========================= */

const users = Storage.get(CONFIG.KEYS.USERS, []);

if(users.length === 0){
    Storage.set(CONFIG.KEYS.USERS, defaultUsers);
}

/* =========================
   Elements
========================= */

const loginForm =
document.getElementById(
    'loginForm'
);

/* =========================
   Login Event
========================= */

loginForm?.addEventListener(

    'submit',

    loginUser
);

/* =========================
   Login Function
========================= */

function loginUser(e){

    e.preventDefault();

    const role =
    document.getElementById(
        'role'
    ).value;

    const username =
    document.getElementById(
        'username'
    ).value
    .trim();

    const password =
    document.getElementById(
        'password'
    ).value
    .trim();

    const usersData =

    Storage.get(CONFIG.KEYS.USERS, []);

    const validUser =

    usersData.find(

        user =>

            user.role === role &&

            user.username === username &&

            user.password === password
    );

    if(validUser){

        /* Save Session */

        Storage.set(

            CONFIG.KEYS.SESSION,

            validUser
        );

        showMessage(

            'Login Successful',

            'success'
        );

        /* Redirect */

        setTimeout(() => {

            window.location.href =
            'pages/dashboard.html';

        },1200);
    }

    else{

        showMessage(

            'Invalid Credentials',

            'error'
        );
    }
}

/* =========================
   Toast Message
========================= */

function showMessage(

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

    setTimeout(() => {

        toast.classList.add(
            'show'
        );

    },100);

    setTimeout(() => {

        toast.classList.remove(
            'show'
        );

        setTimeout(() => {

            toast.remove();

        },300);

    },2500);
}

/* =========================
   Toast Style
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

    padding:16px 25px;

    border-radius:14px;

    color:white;

    font-weight:500;

    z-index:9999;

    transform:
    translateX(120%);

    transition:.4s;
}

.toast.show{

    transform:
    translateX(0);
}

.toast.success{

    background:#22c55e;
}

.toast.error{

    background:#ef4444;
}
`;

document.head.appendChild(
    style
);