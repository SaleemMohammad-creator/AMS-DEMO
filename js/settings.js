document.addEventListener(
'DOMContentLoaded',
() => {

    const defaultSettings = {

        profile:{
            adminName:'',
            adminEmail:'',
            companyName:'',
            companyLogo:''
        },

        attendance:{
            fullDayHours:9,
            halfDayHours:4,
            lateLoginTime:'09:15',
            graceMinutes:10,
            minOtMinutes:30
        },

        payroll:{
            currency:'INR',
            weekOffRule:'Sunday',
            lopEnabled:true
        },

        appearance:{
            darkMode:false,
            toastNotifications:true,
            compactSidebar:false
        }
    };

    let settings =

        Storage.get(
            CONFIG.KEYS.SETTINGS,
            defaultSettings
        );

    loadSettings();

    function loadSettings(){

        adminName.value =
        settings.profile.adminName;

        adminEmail.value =
        settings.profile.adminEmail;

        companyName.value =
        settings.profile.companyName;

        fullDayHours.value =
        settings.attendance.fullDayHours;

        halfDayHours.value =
        settings.attendance.halfDayHours;

        lateLoginTime.value =
        settings.attendance.lateLoginTime;

        graceMinutes.value =
        settings.attendance.graceMinutes;

        minOtMinutes.value =
        settings.attendance.minOtMinutes;

        currency.value =
        settings.payroll.currency;

        weekOffRule.value =
        settings.payroll.weekOffRule;

        lopEnabled.checked =
        settings.payroll.lopEnabled;

        darkModeToggle.checked =
        settings.appearance.darkMode;

        toastToggle.checked =
        settings.appearance.toastNotifications;

        compactSidebarToggle.checked =
        settings.appearance.compactSidebar;
    }

    function save(){

        Storage.set(
            CONFIG.KEYS.SETTINGS,
            settings
        );

        Utils.toast(
            'Settings Saved',
            'success'
        );
    }

    saveProfileBtn.onclick = () => {

        settings.profile = {

            adminName:
            adminName.value,

            adminEmail:
            adminEmail.value,

            companyName:
            companyName.value,

            companyLogo:
            settings.profile.companyLogo
        };

        save();
    };

    saveAttendanceBtn.onclick = () => {

        settings.attendance = {

            fullDayHours:
            Number(fullDayHours.value),

            halfDayHours:
            Number(halfDayHours.value),

            lateLoginTime:
            lateLoginTime.value,

            graceMinutes:
            Number(graceMinutes.value),

            minOtMinutes:
            Number(minOtMinutes.value)
        };

        save();
    };

    savePayrollBtn.onclick = () => {

        settings.payroll = {

            currency:
            currency.value,

            weekOffRule:
            weekOffRule.value,

            lopEnabled:
            lopEnabled.checked
        };

        save();
    };

    saveAppearanceBtn.onclick = () => {

        settings.appearance = {

            darkMode:
            darkModeToggle.checked,

            toastNotifications:
            toastToggle.checked,

            compactSidebar:
            compactSidebarToggle.checked
        };

        save();
    };

    savePasswordBtn.onclick = () => {

        if(
            newPassword.value !==
            confirmPassword.value
        ){

            Utils.toast(
                'Passwords do not match',
                'error'
            );

            return;
        }

        Utils.toast(
            'Password Updated',
            'success'
        );
    };

});

resetSettingsBtn.onclick = () => {

    localStorage.removeItem(
        CONFIG.KEYS.SETTINGS
    );

    Utils.toast(
        'Settings Reset',
        'success'
    );

    location.reload();
};