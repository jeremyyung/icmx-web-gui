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

export { setUrlParam,showLoader,getUrlParam,getParamStr,resetUrlParams }