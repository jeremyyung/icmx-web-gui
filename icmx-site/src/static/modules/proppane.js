import { setUrlParam,showLoader,getUrlParam,getParamStr,resetUrlParams,deleteObj,wipeDisplay,chainParams,fmtUrlParams,sendPost,sendGet } from './helpers.js'
import { updateCmdLog } from './cmdlog.js'
import { newTextField } from './uitemplates.js'
var api_url = document.getElementById('endpoint_url').textContent

function setPropPane(){
    deleteObj('prop_form')
    var license_form = document.getElementById('lic_form')
    var prop_form = document.createElement('form')
    prop_form.id = 'prop_form'

    //###Search for all inputs with "changed" class, submit the appropriate propval update commands
    prop_form.onsubmit = function(pevent) {
        try {
            var mod_inputs = document.querySelectorAll('input[type=text].changed')
            mod_inputs.forEach(function(ele){
                var propval_type = ele.id
                var full_call_url = api_url + "/propval" + fmtUrlParams(false,['host']) + "&propval=" + propval_type
                var post_json = {'property_value':ele.value}
                sendPost(full_call_url, post_json)
            })
        }
        catch (err){
            console.log(err)
            return false
        }
        return false
    }
    getPropVals()
    license_form.after(prop_form)
}

async function getPropVals() {
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
}

function fetchProp(tprop){
    var full_call_url = api_url + '/propval' + fmtUrlParams(false,['host']) + '&propval=' + tprop
    return sendGet(full_call_url)
    .then(data => {
        addPropField(data, tprop)
    })
    .catch(error => {alert(error)})
}

function addPropField(data, tprop) {
    var prop_form_obj = document.getElementById('prop_form')
    var label = document.createElement('label')
    label.innerHTML = tprop
    var dinput = newTextField({field_id:tprop})
    dinput.value = data['results']['data']
    prop_form_obj.appendChild(label)
    prop_form_obj.appendChild(dinput)
}

function hasChanged(pevent){
    var changed_obj = pevent.srcElement
    changed_obj.className = "changed"
}

export { setPropPane, hasChanged }