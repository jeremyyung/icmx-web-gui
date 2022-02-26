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
//    //Make table skeleton
//    var table = document.createElement('table');
//    table.id = "tbl_customer"
//    var hrow = document.createElement('tr');
//    var h1 = document.createElement('th')
//    var h1_text = document.createTextNode("Customer")
//    h1.appendChild(h1_text)
//    hrow.appendChild(h1)
//    table.appendChild(hrow)
//
//    //Populate table
//    var cust_list = data['results']['data']
//        cust_list.forEach(function(custname){
//        var datarow = document.createElement('tr')
//        var datacell = document.createElement('td')
//        datacell.id = custname
//        datacell.onclick = function() {
//            setURLParams('customer',custname)
//            var selected_script = getURLParam('script')
//            var selected_customer = datacell.id
//            var full_callurl = api_url + "/" + selected_script//#####
//            console.log(getParamStr())
////            fetch(api_callurl, {"method": "GET"})
////            .then(response => response.json())
////            .then(data => {
////                textBox(data['stdout'][0], api_endpoint)
////            })
////            .catch(err => console.error(err));
//        }
//
//        var datatext = document.createTextNode(custname)
//        datacell.appendChild(datatext)
//        datarow.appendChild(datacell)
//        table.appendChild(datarow)
//    })

    var display_div = document.getElementById('item_panel')
    //display_div.appendChild(table)
    popTable(display_div,data)
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

function popTable(pobject, data){
    var data_category = data['results']['data_category']
    var table = document.createElement('table');
    table.id = data_category
    var hrow = document.createElement('tr');
    var h1 = document.createElement('th')
    var h1_text = document.createTextNode(data_category)
    h1.appendChild(h1_text)
    hrow.appendChild(h1)
    table.appendChild(hrow)

    var obj_list = data['results']['data']
        obj_list.forEach(function(obj_name){
            var datarow = document.createElement('tr')
            var datacell = document.createElement('td')
            var datatext = document.createTextNode(obj_name)
            datacell.id = obj_name
            datacell.class = data_category
            datacell.onclick = getCellFn(data_category,obj_name)
            datacell.appendChild(datatext)
            datarow.appendChild(datacell)
            table.appendChild(datarow)
        })

    pobject.appendChild(table)
}

function getCellFn(data_category,obj_name){
    switch(data_category){
        case 'client_list':
            return function(pnt_event){
                console.log(pnt_event.path)
                //###
                resetUrlParams()
                var script_name = getUrlParam('script')
                var customer = setUrlParam('customer',obj_name)
                var full_call_url = api_url + "/search/" + getUrlParam('script') + "?" +getParamStr()
                popTable(pnt_event.srcElement, test_data1)

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