import { setUrlParam,showLoader,getUrlParam,getParamStr,resetUrlParams,deleteObj,wipeDisplay,chainParams,fmtUrlParams } from './helpers.js'

function postLicInfo(data){
    deleteObj('lic_form')
    var ipanel = document.getElementById('info_panel')
    var lic_form = document.createElement('form')
    lic_form.id = 'lic_form'
    lic_form.onsubmit = function(pevent) { console.log(pevent) }

    var licdata = data['results']['data']
    for (var key in licdata){
        var label = document.createElement('label')
        label.innerHTML = key + ":"
        var dinput = document.createElement('input')
        dinput.type = 'text'
        dinput.name = key
        dinput.readOnly = true
        var data_text = licdata[key]
        dinput.value = data_text
        lic_form.appendChild(label)
        lic_form.appendChild(dinput)
    }
    ipanel.appendChild(lic_form)
}

export { postLicInfo }