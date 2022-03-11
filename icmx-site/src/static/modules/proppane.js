import { setUrlParam,showLoader,getUrlParam,getParamStr,resetUrlParams,deleteObj,wipeDisplay,chainParams,fmtUrlParams,sendPost } from './helpers.js'
import { updateCmdLog } from './cmdlog.js'
var api_url = document.getElementById('endpoint_url').textContent

function setPropPane(){
    deleteObj('prop_form')
    var license_form = document.getElementById('lic_form')
    var prop_form = document.createElement('form')
    prop_form.id = 'prop_form'

    //###
/*    lic_form.onsubmit = function(pevent) {
        var submit_action = pevent.submitter.value
        submitAction(submit_action)
        return false
    }*/
    getPropVals()
    license_form.after(prop_form)
}

async function getPropVals() {
    showLoader(true)
    const target_props = ['Uuid','Quotas']
    for (var index in target_props) {
        var tprop = target_props[index]
        await fetchProp(tprop)
    }

    var form_btn_list = ['Update']
    for (var btn_name in form_btn_list) {
        var submit_btn = document.createElement('input')
        submit_btn.type = 'submit'
        submit_btn.value = form_btn_list[btn_name]
        submit_btn.style = 'display:inline'
        prop_form.appendChild(submit_btn)
    }
    showLoader(false)
}

function fetchProp(tprop){
    var full_call_url = api_url + '/propval' + fmtUrlParams(false) + '&propval=' + tprop + "&noregex"
    return fetch(full_call_url,
        {
            "method": "GET"
        })
    .then(response => response.json())
    .then(data => {
        updateCmdLog(data)
        addPropField(data, tprop)
    })
    .catch(err => {
        alert(err)
    })
}

function addPropField(data, tprop) {
    var prop_form_obj = document.getElementById('prop_form')
    var label = document.createElement('label')
    label.innerHTML = tprop
    var dinput = document.createElement('input')
    dinput.type = 'text'
    dinput.name = tprop
    dinput.id = tprop
    dinput.value = data['results']['data']
    prop_form_obj.appendChild(label)
    prop_form_obj.appendChild(dinput)
}

export { setPropPane }












//    var target_propvals = ['Uuid', 'Quotas']
//    for (var index in target_propvals) {
//        var prop_name = target_propvals[index]
//        var full_call_url = api_url + '/propval' + fmtUrlParams(false) + '&propval=' + prop_name
//        fetch(full_call_url,
//            {
//                "method": "GET"
//            })
//        .then(response => response.json())
//        .then(data => {
//            updateCmdLog(data)
//            var returned_value = data['results']['data']
//            var label = document.createElement('label')
//            label.innerHTML = prop_name
//            var dinput = document.createElement('input')
//            dinput.type = 'text'
//            dinput.name = prop_name
//            dinput.id = prop_name
//            dinput.value = returned_value
//            prop_form.appendChild(label)
//            prop_form.appendChild(dinput)
//        })
//        .catch(err => {
//            alert(err)
//        })
//    }
//

