function cmdLog(){
    var hdiv = document.getElementById("log_div");
    var txtbox = document.createElement("TEXTAREA");
    txtbox.id = "command_log";
    txtbox.readonly = true;
    hdiv.appendChild(txtbox);
}

function updateCmdLog(data){
    var run_status = "=OK="
    if (data['results']['return_code'] != 0 || data['results']['cp_exit_code'] != 0) {
        console.log(data['return_code'])
        console.log(data['results']['cp_exit_code'])
        run_status = "=ERROR="
    }

    var txtbox = document.getElementById("command_log");
    var init_value = txtbox.value
    if (init_value == null) {
        init_value = ""
    }

    var new_value = init_value + "\n" + run_status + data['cmd']
    txtbox.value = new_value
    txtbox.scrollTop = txtbox.scrollHeight;
}

export { cmdLog, updateCmdLog };