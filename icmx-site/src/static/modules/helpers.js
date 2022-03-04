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

function fmtUrlParams(){
    var currenturl = new URL(window.location.href)
    var param_string = currenturl.searchParams.toString()
    param_string = param_string.replace('script=','')
    param_string = param_string.replace('&','?')
    return param_string
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
    var loader_element = document.getElementById('loader_wheel')
    if (doshow) {
        loader_element.style.display = 'block'
    }
    else{
        loader_element.style.display = 'none'
    }
}

function deleteObj(t_obj_id){
    var checker = document.getElementById(t_obj_id)
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

export { setUrlParam,showLoader,getUrlParam,getParamStr,resetUrlParams,deleteObj,wipeDisplay,chainParams,fmtUrlParams }