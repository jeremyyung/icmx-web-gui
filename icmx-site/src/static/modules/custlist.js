import { setUrlParam,showLoader,getUrlParam,getParamStr,resetUrlParams,deleteObj,wipeDisplay,chainParams,fmtUrlParams,sendGet } from './helpers.js'
import { postLicInfo } from './infopanel.js'
import { updateCmdLog } from './cmdlog.js'

var api_url = document.getElementById('endpoint_url').textContent

function fillCustList(data){
    wipeDisplay({div_id_list:['item_panel', 'info_panel', 'action_panel']})
    var display_div = document.getElementById('item_panel')
    popTable({'pobj':display_div, 'data':data, 'append':true})
}

function popTable(argdict){
    var parent_object = argdict['pobj']
    var data_category = argdict['data']['results']['data_category']
    var table = document.createElement('table');
    table.id = data_category
    var hrow = document.createElement('tr');
    var h1 = document.createElement('th')
    var h1_text = document.createTextNode(data_category)
    deleteObj(table.id)
    h1.appendChild(h1_text)
    hrow.appendChild(h1)
    table.appendChild(hrow)

    var obj_list = argdict['data']['results']['data']
    var c_list = document.createElement('ul')
    obj_list.forEach(function(obj_name){
        var listitem = document.createElement('li')
        var textnode = document.createTextNode(obj_name)
        listitem.id = obj_name
        listitem.class = data_category
        var p_chain = parent_object.getAttribute('id_chain')
        listitem.setAttribute('id_chain', fmtIdChain(p_chain,data_category,obj_name))
        listitem.onclick = getCellFn(data_category,obj_name)
        listitem.appendChild(textnode)
        c_list.appendChild(listitem)
    })
    table.appendChild(c_list)
    if (argdict['append']){
        parent_object.appendChild(table)
    }
    else {
        parent_object.after(table)
    }
}

function getCellFn(data_category,obj_name){
    switch(data_category){
        case 'client_list':
        case 'group_list':
            return function(pevent){
                resetUrlParams()
                chainParams(pevent.srcElement.getAttribute('id_chain'))
                var full_call_url = api_url + "/search/" + fmtUrlParams()
                sendGet(full_call_url)
                .then(data => {
                    deleteObj('lic_form')
                    deleteObj('clone_form')
                    var result_category = data['results']['data_category']
                    if(result_category == 'client_license' || result_category == 'noprompt'){
                        //If a license is returned, show the license info
                        postLicInfo(data)
                        //GDP & GDPXL use different category names, ensures the url params are set correctly.
                        var selected_host = data['results']['data']['host']
                        if (selected_host == null) {
                            var selected_host = data['results']['data']['Hostname']
                        }
                        setUrlParam('host', selected_host)

                        //For GDPXL, need to ensure group param is always set, lots of commands require it
                        var selected_group = data['results']['data']['Group:']
                        if (selected_group != null){
                            setUrlParam('group', selected_group)
                        }
                    }
//                    else if(result_category == 'noprompt'){
//                        //noprompt category means unexpected results
//                        //alert(data['results']['data'])
//                    }
                    else {
                        //If a group/host list is returned, populate sub-table
                        popTable({'pobj':pevent.srcElement, 'data':data, 'append':false})
                    }
                })
                .catch(error => {alert(error)})
            }
        case 'host_list':
            return function(pevent){
                deleteObj('clone_form')
                resetUrlParams()
                chainParams(pevent.srcElement.getAttribute('id_chain'))
                var full_call_url = api_url + "/search/" + fmtUrlParams()
                sendGet(full_call_url)
                .then(data => {
                    postLicInfo(data)
                })
                .catch(error => {alert(error)})
            }
        default:
            return function(){ alert("Error assigning cell function.")}
    }
}

function fmtIdChain(parent_id_chain,data_category,obj_name){
    switch(data_category){
        case 'client_list':
            return "customer=" + obj_name
        case 'group_list':
            return parent_id_chain + "&group=" + obj_name
        case 'host_list':
            return parent_id_chain + "&host=" + obj_name
        default:
            return ""
    }
}

export { fillCustList }