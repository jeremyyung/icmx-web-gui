import { setUrlParam,showLoader,getUrlParam,getParamStr,resetUrlParams,deleteObj,wipeDisplay,chainParams,fmtUrlParams,sendPost } from './helpers.js'
import { setPropPane, hasChanged } from './proppane.js'
import { newTextField } from './uitemplates.js'
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
    var form_btn_list = ['Propvals','Renew']
    if(data['results']['data_category'] == 'noprompt'){
        var label = document.createElement('label')
        label.innerHTML = 'Expiration'
        var dinput = newTextField({field_id:'Expiration'})
        dinput.pattern = "[0-9]{4}/[0-9]{2}/[0-9]{2}"
        dinput.title = "YYYY/MM/DD"
        dinput.readOnly = false
        lic_form.appendChild(label)
        lic_form.appendChild(dinput)
        alert(licdata)
    }
    else {
        for (var key in licdata){
            var label = document.createElement('label')
            label.innerHTML = key
            var dinput = newTextField({field_id:key})
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
        var form_btn_list = ['Renew', 'Notify', 'Propvals', 'Clone']
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
        case 'Clone':
            getClonePrompt()
            break
        default:
            alert("Unknown property form submitAction().")
    }
}

function getClonePrompt(){
    var lic_form = document.getElementById('lic_form')
    var cl_form = document.createElement('form')
    cl_form.id = "clone_form"
    var cl_label = document.createElement('label')
    cl_label.innerHTML = "New Hostname"
    cl_form.onsubmit = function(){
        var clone_params = fmtUrlParams(true,[],['host']) + "&host=" + document.getElementById('clone_hostname').value
        var full_call_url = api_url + "/clone/" + clone_params
        sendPost(full_call_url,{})
        deleteObj('clone_form')
        return false
    }

    var cl_input = newTextField({field_id:'clone_hostname'})
    cl_input.required = true
    var cl_button = document.createElement('input')
    cl_button.type = 'submit'
    cl_form.appendChild(cl_label)
    cl_form.appendChild(cl_input)
    cl_form.appendChild(cl_button)
    lic_form.after(cl_form)
}

export { postLicInfo }