import { setUrlParam,showLoader,getUrlParam,getParamStr,resetUrlParams } from './helpers.js';
var api_url = document.getElementById('endpoint_url').textContent
var test_data1 = {
	"cmd": "./icmlt search -c ^ICM_Internal$",
	"results": {
		"cp_exit_code": 0,
		"data": [
			"Alex",
			"Bernie",
			"SamsungAE"
		],
		"data_category": "group_list",
		"return_code": 0
	}
}
var test_data2 = {
	"cmd": "./icmlt search -c ^ICM_Internal$",
	"results": {
		"cp_exit_code": 0,
		"data": [
			"Server1",
			"Server2"
		],
		"data_category": "host_list",
		"return_code": 0
	}
}

function fillCustList(data){
    cleanSlate()
    var display_div = document.getElementById('item_panel')
    //popTable(display_div,data)
    popTable({'pobj':display_div, 'data':data, 'append':true})
}

function cleanSlate(){
    var display_board = document.getElementById('display_board')
    const item_list = ['item_panel', 'info_panel', 'action_panel']
    item_list.forEach(function(item){
        var checker = document.getElementById(item)
        if (checker != null) {
            checker.remove()
        }
        var item_panel = document.createElement('div')
        item_panel.id = item
        display_board.appendChild(item_panel)
    })
}

function popTable(argdict){
    var parent_object = argdict['pobj']
    var data_category = argdict['data']['results']['data_category']
    var table = document.createElement('table');
    table.id = data_category
    var hrow = document.createElement('tr');
    var h1 = document.createElement('th')
    var h1_text = document.createTextNode(data_category)
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
            return function(pevent){
                console.log(pevent.path)
                //###
                resetUrlParams()
                var script_name = getUrlParam('script')
                var customer = setUrlParam('customer',obj_name)
                var full_call_url = api_url + "/search/" + getUrlParam('script') + "?" +getParamStr()
                popTable({'pobj':pevent.srcElement, 'data':test_data1, 'append':false})
//                popTable(pevent.srcElement, test_data1)
//                fetch(full_call_url,
//                    {
//                        "method": "GET"
//                    })
//                .then(response => response.json())
//                .then(data => {
//                    fillCustList(data)
//                    showLoader(false)
//                })
//                .catch(err => {
//                    console.error(err)
//                    showLoader(false)
//                })
                //###
            }
        case 'group_list':
            return function(){
                console.log('group ' + obj_name)
            }
        case 'host_list':
            return function(){
                console.log('host ' + obj_name)
            }
        default:
            return function(){}
    }
}

export { fillCustList }