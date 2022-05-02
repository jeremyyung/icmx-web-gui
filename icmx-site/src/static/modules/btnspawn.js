import { setUrlParam,resetUrlParams,sendGet,setActiveBtn } from './helpers.js';
import { fillCustList } from './custlist.js';
import { getAddForm } from './addform.js'

var api_url = document.getElementById('endpoint_url').textContent

function makeBtns(){
    getGDP()
    getGDPXL()
    getAdd()
    getHelp()
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

function getAdd(){ //Button to create a new host
    var add_btn = btnSkeleton('ADD', 'b_container', 'btn_add')
    add_btn.onclick = function(){ getAddForm(add_btn) }
    add_btn.name = 'addhost'
}

function getHelp(){ //Button to create a new host
    var add_btn = btnSkeleton('HELP', 'b_container', 'btn_help')
    add_btn.onclick = function(){ 
      alert(
        "--GDP/GDPXL--: Select GDP or GDPXL database.\n" +
        "--ADD--: This is for creating a new customer. If customer already exists, drill down in client_list.\n" +
        "--RENEW--: Update expiration date and user count.\n" +
        "--NOTIFY--: Send license email to customer.\n" +
        "--PROPVALS--: Modify 'UUID' and 'QUOTAS' values; GDPXL only.\n" +
        "--CLONE--: Adds a new host to the selected cusomter."
      ) 
    }
    add_btn.name = 'helpalert'
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
        setActiveBtn(dom_button)
        setUrlParam('script',script_name)
        var full_call_url = api_url + "/search/" + script_name
        sendGet(full_call_url)
        .then(data =>{
            fillCustList(data)
        })
        .catch(error => {alert(error)})
    }
}

export { makeBtns }
