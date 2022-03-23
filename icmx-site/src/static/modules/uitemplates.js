function newTextField({field_type='text',field_id='',default_value=''} = {}) {
    var dinput = document.createElement('input')
    dinput.type = field_type
    dinput.name = field_id
    dinput.id = field_id
    dinput.value = default_value
    dinput.addEventListener('input',setChClass)
    return dinput
}

function setChClass(pevent){
    var changed_obj = pevent.srcElement
    changed_obj.className = "changed"
}

export{ newTextField }