import { updateCmdLog } from './cmdlog.js'

function getParamStr(){//Get all params except for 'script'
    var currenturl = new URL(window.location.href)
    var params = new URLSearchParams(currenturl.search);
    params.delete('script')
    return params.toString()
}

function getUrlParam(key){ //Gets search params in URL
    var currenturl = new URL(window.location.href)
    return currenturl.searchParams.get(key)
}

function setUrlParam(key,value){ //Sets search params in URL
    var currenturl = new URL(window.location.href)
    currenturl.searchParams.set(key, value)
    history.replaceState(null,null,currenturl)
}

function fmtUrlParams(showscript=true,noregx_list=[],skip_params=[]){
    var currenturl = new URL(window.location.href)
    var param_string = ''
    currenturl.searchParams.forEach(function(value,key){
        var true_param = ''
        if (key == 'script'){
            if(showscript){
                param_string = value + "?"
            }
            else {
                param_string = "?"
            }
        }
        else if (noregx_list.includes(key)){
            true_param = key + "=" + value + "&"
        }
        else if (skip_params.includes(key)){
            //do nothing
        }
        else{
            true_param = key + "=" + "^" + value + "$&"
        }
        param_string = param_string + true_param
    })
    return param_string.replace(/&$/,"") //cutoff trailing '&'
}

function resetUrlParams(){
    var currenturl = new URL(window.location.href)
    const main_params = ['customer','group','host','propval']
    main_params.forEach(function(param_name){
        currenturl.searchParams.delete(param_name)
    })
    history.replaceState(null,null,currenturl)
}

function showLoader(doshow){ //Toggles loading div visibility
    var loader_element = document.getElementById('loading_overlay')
    if (doshow) {
        loader_element.style.display = 'block'
    }
    else{
        loader_element.style.display = 'none'
    }
}

function deleteObj(tar_obj_id){
    var checker = document.getElementById(tar_obj_id)
    if (checker != null) {
        checker.remove()
    }
}

function wipeDisplay({div_id_list=[]} = {}){
    var cp_div = document.getElementById('control_panel')
    var new_div = document.createElement('div')
    new_div.id = 'display_board'
    new_div.className = 'panels'
    div_id_list.forEach(function(item){
        var item_panel = document.createElement('div')
        item_panel.id = item
        new_div.appendChild(item_panel)
    })

    document.getElementById('display_board').remove()
    cp_div.after(new_div)
}

function chainParams(idchain){
    idchain.split('&').forEach(function(item){
        var section = item.split('=')
        var key = section[0]
        var value = section[1]
        setUrlParam(key,value)
    })
}

function sendPost(callurl, payload_json){
    showLoader(true)
    fetch(callurl, {
        "method": "POST",
        "headers": { 'Content-Type':'application/json'},
        "body": JSON.stringify(payload_json)
    })
    .then(response => response.json())
    .then(data => {
        updateCmdLog(data)
        showLoader(false)
    })
    .catch(err => alert(err));
}

async function sendGet(callurl){
    showLoader(true)
    const response = await fetch(callurl,
    {
       "method": "GET"
    })

    if (!response.ok) {
        const message = `An error has occured: ${response.status}`
        showLoader(false)
        throw new Error(message)
    }

    const data = await response.json()
    updateCmdLog(data)
    showLoader(false)
    return data
}

export { setUrlParam,showLoader,getUrlParam,getParamStr,resetUrlParams,deleteObj,wipeDisplay,chainParams,fmtUrlParams,sendPost,sendGet }