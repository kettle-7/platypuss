var url = new URL(window.location);
var ift = false;

function swapsies() {
    l = ["lit1"];
    if (!url.searchParams.has("ift")) return;
    ift = true;
    for (let i = 0; i < l.length; i++) {
        document.getElementById(l[i]).innerHTML = document.getElementById(l[i]).innerHTML.replace(/Log In/g, "Sign Up");
    }
    document.getElementById("lit2").innerHTML = "Welcome to Platypuss! If this is not your first time with us please <a href='/login'>log in</a> instead. Please make\n\
sure to read the <a href='/tos'>terms of service</a> before creating an account.";
}