import { setUrlParam,showLoader,resetUrlParams } from './helpers.js';
import { fillCustList } from './custlist.js';
import { updateCmdLog } from './cmdlog.js'

var api_url = document.getElementById('endpoint_url').textContent
var test_data = {
	"cmd": "./icmlt search ",
	"results": {
		"cp_exit_code": 0,
		"data": [
			"AMD",
			"Finisar",
			"Xilinx"
		],
		"data_category": "client_list",
		"return_code": 0
	}
}

function makeBtns(){
    getGDP()
    getGDPXL()
}

function getGDP(){ //Button to fetch all GDP customers
    var gdp_btn = btnSkeleton('GDP', 'b_container', 'btn_gdp')
    gdp_btn.onclick = getSearchFn(gdp_btn,'icmlt')
    gdp_btn.name = 'icmlt'
}

function getGDPXL(){ //Button to fetch all GDPXL customers
    var gdpxl_btn = btnSkeleton('GDPXL', 'b_container', 'btn_gdpxl')
    gdpxl_btn.onclick = getSearchFn(gdpxl_btn,'icmgdpxlt')
    gdpxl_btn.name = 'icmgdpxlt'
}

function btnSkeleton(title, parent_div, btn_id){
    var tr1 = document.getElementById('b_row')
    var td1 = document.createElement('td')
    var btn1 = document.createElement('button')
    var btext =  document.createTextNode(title)
    btn1.id = btn_id
    btn1.append(btext)
    td1.appendChild(btn1)
    tr1.appendChild(td1)
    document.getElementById(parent_div).appendChild(tr1)

    return btn1
}

function getSearchFn(dom_button, script_name) {
    return function() {
        showLoader(true)
        document.querySelectorAll("button").forEach(function(node) {
            node.value=""
        })
        dom_button.value = 'selected'
        resetUrlParams()
        setUrlParam('script',script_name)
        var full_call_url = api_url + "/search/" + script_name

        //**temp
//        fillCustList(test_data)
//        updateCmdLog(test_data)
//        showLoader(false)
        //**

        fetch(full_call_url,
            {
                "method": "GET"
            })
        .then(response => response.json())
        .then(data => {
            fillCustList(data)
            updateCmdLog(data)
            showLoader(false)
        })
        .catch(err => {
            alert(err)
            showLoader(false)
        })
    }
}

export { makeBtns }