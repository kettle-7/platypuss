 /************************************************************************
 * Copyright 2020-2023 Ben Keppel                                        *
 *                                                                       *
 * This program is free software: you can redistribute it and/or modify  *
 * it under the terms of the GNU General Public License as published by  *
 * the Free Software Foundation, either version 3 of the License, or     *
 * (at your option) any later version.                                   *
 *                                                                       *
 * This program is distributed in the hope that it will be useful,       *
 * but WITHOUT ANY WARRANTY; without even the implied warranty of        *
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the         *
 * GNU General Public License for more details.                          *
 *                                                                       *
 * You should have received a copy of the GNU General Public License     *
 * along with this program.  If not, see <http://www.gnu.org/licenses/>. *
 ************************************************************************/

var url = new URL(window.location);
var authUrl = localStorage.getItem("authUrl");
if (!authUrl) authUrl = "http://122.62.122.75";

// client-side hashing taken off stackoverflow :)
const cyrb53 = (str, seed = 20) => {
let h1 = 0xdeadbeef ^ seed, // dead beef
    h2 = 0x41c6ce57 ^ seed;
    for (let i = 0, ch; i < str.length; i++) {
        ch = str.charCodeAt(i);
        h1 = Math.imul(h1 ^ ch, 2654435761);
        h2 = Math.imul(h2 ^ ch, 1597334677);
    }

    h1 = Math.imul(h1 ^ (h1 >>> 16), 2246822507) ^ Math.imul(h2 ^ (h2 >>> 13), 3266489909);
    h2 = Math.imul(h2 ^ (h2 >>> 16), 2246822507) ^ Math.imul(h1 ^ (h1 >>> 13), 3266489909);

    return (h2>>>0).toString(16).padStart(8,0)+(h1>>>0).toString(16).padStart(8,0);
};

function swapsies() {
    if (!url.searchParams.has("ift")) {
        document.getElementById("loginform").removeChild(document.getElementById("pwdbox"));
        document.getElementById("pwd1").addEventListener("keypress", (e) => {
            if (e.key == "Enter")
                doTheLoginThingy();
        });
        return;
    }
    document.getElementById("pwd2").addEventListener("keypress", (e) => {
        if (e.key == "Enter")
            doTheLoginThingy();
    });
    document.getElementById("lit1").innerHTML = document.getElementById("lit1").innerHTML.replace(/Sign In/g, "Create Account");
    document.getElementById("lit2").innerHTML = "Welcome to Platypuss! If this is not your first time with us please <a href='./login.html'>sign in</a> instead. Please make\n\
sure to read the <a href='./tos.html'>terms of service</a> before creating an account.";
    document.getElementById("lit3").innerText = document.getElementById("lit3").innerText.replace(/Sign In/g, "Create Account");
}

function doTheLoginThingy() {
    let unam = document.getElementById("unam").value;
    let pwd1 = document.getElementById("pwd1").value;
    unam = unam.replace(/ /g, '-');
    let ift = false;
    if (document.getElementById("pwd2") != null) { // if you're making a new account
        ift = true;
        let pwd2 = document.getElementById("pwd2").value;
        if (pwd1 != pwd2) {
            document.getElementById("lit2").innerText = "Your passwords don't match.";
            return;
        }
        if (unam == "") {
            document.getElementById("lit2").innerText = "Please fill this out, you can't just make an account without an username...";
            return;
        }
        if (pwd1 == "") {
            document.getElementById("lit2").innerText = "Please fill this out, you can't just make an account without a password...";
            return;
        }
        let jsonobjectforloggingin = JSON.stringify({ // i want long variable name
            "ift": ift,
            "ser": "122.62.122.75:3000",
            "unam": unam,
            "pwd": cyrb53(pwd1)
        });
        console.log(jsonobjectforloggingin);
        const xhr = new XMLHttpRequest();
        xhr.open("POST", authUrl + '/li', true);
        xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
        xhr.onreadystatechange = () => { // Call a function when the state changes.
            if (xhr.readyState === XMLHttpRequest.DONE && xhr.status) {
                let res = JSON.parse(xhr.responseText);
                if (ift && res.exists) {
                    document.getElementById("lit2").innerHTML = 'An account with that username already exists, would you like to <a href="./login.html">log in</a> instead?';
                    return;
                }
                if (!ift && !res.exists) {
                    document.getElementById("lit2").innerText = "There's no account with that username, did you misspell it?";
                    return;
                }
                if (!ift && !res.pwd) {
                    document.getElementById("lit2").innerText = "That password isn't correct, did you misspell it?";
                    return;
                }
                localStorage.setItem('sid', res.sid);
                window.location = "./index.html";
            }
        }
        xhr.send(jsonobjectforloggingin);
        return;
    }
    let jsonobjectforloggingin = JSON.stringify({ // i want long variable name
        "ift": ift,
        "ser": "122.62.122.75:3000",
        "unam": unam,
        "pwd": cyrb53(pwd1)
    });
    const req = new XMLHttpRequest();
    req.open("POST", authUrl + '/li', true);
    req.setRequestHeader("Content-Type", "application/raw");
    req.onreadystatechange = () => { // Call a function when the state changes.
        if (req.readyState === XMLHttpRequest.DONE && (req.status == 200 || req.status == 204)) {
            let res = JSON.parse(req.responseText);
            if (ift && res.exists) {
                document.getElementById("lit2").innerText = "An account with that username already exists ;-;";
                return;
            }
            if (!ift && !res.exists) {
                document.getElementById("lit2").innerText = "There's no account with that username, did you misspell it?";
                return;
            }
            if (!ift && !res.pwd) {
                document.getElementById("lit2").innerText = "That password isn't correct, did you misspell it?";
                return;
            }
            localStorage.setItem('sid', res.sid);
            window.location = "./index.html";
        }
    }
    console.log(jsonobjectforloggingin);
    req.send(jsonobjectforloggingin);
}
