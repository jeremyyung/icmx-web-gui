import { setUrlParam,showLoader,resetUrlParams,sendGet,wipeDisplay,deleteObj,sendPost } from './helpers.js';
import { addInputField } from './uitemplates.js'
var api_url = document.getElementById('endpoint_url').textContent

function getAddForm(){
    var panel_ids = ['item_panel', 'info_panel', 'action_panel']
    panel_ids.forEach(element => deleteObj(element))
    var parent_obj = document.getElementById('display_board')
    var add_form = document.createElement('form')
    add_form.id = 'prop_form'

    var sel_label = document.createElement('label')
    sel_label.innerHTML = "License Type"
    var script_select = document.createElement('select')
    script_select.id = 'sel_script'
    var script_list = ['GDP','GDPXL']
    script_list.forEach(element => {
        var temp_option = document.createElement('option')
        if (element == 'GDP'){
            temp_option.value = 'icmlt'
        }
        if (element == 'GDPXL'){
            temp_option.value = 'icmgdpxlt'
        }
        temp_option.innerHTML = element
        script_select.appendChild(temp_option)
    })
    script_select.style = "display:block"
    add_form.appendChild(sel_label)
    add_form.appendChild(script_select)

    var input_elements = ['customer','group','host','users','expiration','administrators']
    input_elements.forEach(element => {
        var ilabel = document.createElement('label')
        ilabel.innerHTML = element
        var ifield = addInputField({ field_id: element })
        if (element == "expiration") {
            ifield.pattern = "[0-9]{4}/[0-9]{2}/[0-9]{2}"
            ifield.title = "YYYY/MM/DD"
        }
        if (element == "administrators") {
            ifield.pattern = "[a-zA-Z0-90-9_]+@.+"
            ifield.title = "a@aol.com,b@aol.com"
        }
        if (element == "group") { ifield.value = 'icmanage' }
        ifield.required = true
        add_form.appendChild(ilabel)
        add_form.appendChild(ifield)
    })
    parent_obj.appendChild(add_form)

    var add_button = document.createElement('input')
    add_button.type = 'submit'
    add_form.appendChild(add_button)

    add_form.onsubmit = function(pevent) {
        try {
            var full_call_url = api_url + "/add/" + document.querySelector('select').value + "?"
            var data_payload = {}
            var all_inputs = document.querySelectorAll('input')
            all_inputs.forEach(function(ele){
                switch (ele.id){
                    case 'customer':
                    case 'group':
                    case 'host':
                        full_call_url = full_call_url + ele.id + "=" + ele.value + "&"
                        break
                    case 'users':
                    case 'expiration':
                    case 'administrators':
                        data_payload[ele.id] = ele.value
                        break
                }

            })
            sendPost(full_call_url,data_payload)
            return false
        }
        catch(err){
            console.log(err)
            return false
        }

    }
}

export { getAddForm }