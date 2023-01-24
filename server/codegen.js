let code = "";
for (let part of process.env.ip.split(".")) {
    cp = parseInt(part, 10).toString(16);
    while (cp.length < 2) {
    	cp = "0" + cp;
    }
    code += cp;
}
code += parseInt(process.env.port, 10).toString(16) + parseInt(process.env.inviteCode, 10).toString(16);
console.log(code);
