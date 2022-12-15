var loggedin = true;
if (localStorage.getItem('sid') == null || localStorage.getItem('sid') == 0) {
    loggedin = false;
}
else {
    const xhr = new XMLHttpRequest();
    xhr.open('GET', '/uinfo?id='+localStorage.getItem('sid').toString(), true);
    xhr.onload = () => {
        if (xhr.status != 200) loggedin = false;
        else {
            let res = JSON.parse(xhr.responseText);
            document.getElementById("pfp").src = res.pfp;
            document.getElementById("username").innerText = "Logged in as " + res.unam;
            document.ppures = res;
        }
    };
    xhr.send(null);
}
if (loggedin) {
    document.getElementById("header").removeChild(document.getElementById("login"));
    document.getElementById("header").removeChild(document.getElementById("signup"));
}
else {
    document.getElementById("header").removeChild(document.getElementById("pfp"));
}
document.getElementById("accountInfo").addEventListener("click", (e) => {
    e.stopPropagation();
});
document.getElementById("logoutPopup").addEventListener("click", (e) => {
    e.stopPropagation();
});

function logout() {
    localStorage.clear();
    window.location.reload();
}