/* =========================
   GLOBAL TOAST
========================= */

window.showToast = function(
    message,
    type='success'
){

    const container =
        document.getElementById(
            'toastContainer'
        );

    if(!container) return;

    const toast =
        document.createElement(
            'div'
        );

    toast.className =
        `toast ${type}`;

    let icon =
        'fa-circle-check';

    if(type === 'error')
        icon =
        'fa-circle-xmark';

    if(type === 'warning')
        icon =
        'fa-triangle-exclamation';

    if(type === 'info')
        icon =
        'fa-circle-info';

    toast.innerHTML =

    `
    <i class="fa-solid ${icon}"></i>
    ${message}
    `;

    container.appendChild(
        toast
    );

    setTimeout(()=>{

        toast.remove();

    },3000);
};