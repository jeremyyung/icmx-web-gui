import { setUrlParam,showLoader,getUrlParam,getParamStr,resetUrlParams,deleteObj,wipeDisplay,chainParams,fmtUrlParams,sendPost } from './helpers.js'
import { setPropPane } from './proppane.js'
var api_url = document.getElementById('endpoint_url').textContent

function postLicInfo(data){
    deleteObj('lic_form')
    deleteObj('prop_form')
    var ipanel = document.getElementById('info_panel')
    var lic_form = document.createElement('form')
    lic_form.id = 'lic_form'
    lic_form.onsubmit = function(pevent) {
        var submit_action = pevent.submitter.value
        submitAction(submit_action)
        return false
    }

    var licdata = data['results']['data']
    if(data['results']['data_category'] != 'client_license'){
        alert(licdata)
        var form_btn_list = ['Propvals']
    }
    else {
        for (var key in licdata){
            var label = document.createElement('label')
            label.innerHTML = key
            var dinput = document.createElement('input')
            dinput.type = 'text'
            dinput.name = key
            dinput.id = key
            dinput.readOnly = true
            dinput.value = licdata[key]
            if(dinput.name == 'expires' || dinput.name == 'Expiration' || dinput.name == 'Users' || dinput.name == 'users') {
                dinput.readOnly = false
                if(dinput.name == 'Users' || dinput.name == 'users'){
                    dinput.type = 'number'
                }
                if(dinput.name == 'expires' || dinput.name == 'Expiration'){
                    dinput.pattern = "[0-9]{4}/[0-9]{2}/[0-9]{2}"
                    dinput.title = "YYYY/MM/DD"
                }
            }
            lic_form.appendChild(label)
            lic_form.appendChild(dinput)
        }
        var form_btn_list = ['Renew', 'Notify', 'Propvals']
    }

    ipanel.appendChild(lic_form)
    for (var btn_name in form_btn_list) {
        var submit_btn = document.createElement('input')
        submit_btn.type = 'submit'
        submit_btn.value = form_btn_list[btn_name]
        submit_btn.style = 'display:inline'
        lic_form.appendChild(submit_btn)
    }
}

function submitAction(submit_action){
    switch(submit_action){
        case 'Notify':
            var fullurl = api_url + "/notify/" + fmtUrlParams()
            sendPost(fullurl,{})
            break
        case 'Renew':
            var fullurl = api_url + "/renew/" + fmtUrlParams()
            var payload_json = {}
            var target_fields = ['expires','Expiration','Users','users']
            target_fields.forEach(function(field_name){
                var field_element = document.getElementById(field_name)
                if (field_element != null){
                    payload_json[field_name] = field_element.value
                }
            })
            sendPost(fullurl,payload_json)
            break
        case 'Propvals'://Generate UUID & Quotas editing pane
            if(getUrlParam('script') == 'icmgdpxlt') {
                setPropPane()
            }
            else {
                alert("Only used for GDPXL licenses.")
            }
            break
    }
}

export { postLicInfo }