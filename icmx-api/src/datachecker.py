import json, re, pexpect

def runExpect(cmdstr,**kwargs):
    exp_list = [
        pexpect.EOF, #0
        'Client License:',
        'GDPXL License:',
        'Customer \(\"q\" to quit\)\:',
        'Server Group \(\"q\" to quit\)\:', #4
        'Server Hostname \(\"q\" to quit\)\:',
        'Would you like to send these licenses to the customer\?',
        '\w+-\w+-\w+-\w+-\w+',
        'Customer .* already has server groups. +Do you mean to create another\? +\[y\/N\]',  # 8
        'None found',
        'Customer .* does not yet exist. +Create it\? +\[y\/N\]\:',
        'This server group is now empty\. +Delete the group too\?',
        'Would you like to delete group .*\?', #12
        'Would you like to delete customer .*\?',
        '^[\w+-]+=.*'
    ]
    result_json = {'return_code': 0, 'data': '', 'data_category':'', 'cp_exit_code':0}

    try:
        ch_process = pexpect.spawnu(cmdstr)
        while 1:
            index = ch_process.expect(exp_list)
            if index == 1 or index == 2:
                replacers = {'\r\n':'','\n':'','\b':''}
                ch_process.expect("\{.*\}")
                sanitized = ch_process.after
                for pattern,newval in replacers.items():
                    sanitized = sanitized.replace(pattern,newval)
                result_json['data'] = json.loads(sanitized)
                result_json['data_category'] = 'client_license'
                ch_process.sendline("q")
                break
            elif index == 3:
                client_list = reduceStr(ch_process.before)
                result_json['data'] = client_list
                result_json['data_category'] = 'client_list'
                ch_process.sendline("q")
            elif index == 4:
                group_list = reduceStr(ch_process.before)
                result_json['data'] = group_list
                result_json['data_category'] = 'group_list'
                ch_process.sendline("q")
            elif index == 5:
                host_list = reduceStr(ch_process.before)
                result_json['data'] = host_list
                result_json['data_category'] = 'host_list'
                ch_process.sendline("q")
            elif index == 6:
                result_json['data'] = ch_process.before
                if result_json['data_category'] == '':
                    result_json['data_category'] = 'notify'
                if kwargs['notify']:
                    ch_process.sendline("y")
                else:
                    ch_process.sendline("n")
            elif index == 7:
                result_json['data'] = ch_process.after
                result_json['data_category'] = 'uuid'
                break
            #elif index == 8 or index == 10 or index == 11 or index == 12 or index == 13:
            elif index in [8,10,11,12,13]:
                result_json['data_category'] = 'obj_manip'
                ch_process.sendline("y")
            elif index == 9:
                break
            elif index == 14:
                result_json['data'] = re.sub('\r\n', '', ch_process.after)
                result_json['data_category'] = 'quotas'
                break
            elif index == 0: #A catch-all for tricky patterns w/o prompts
                result_json['data'] = ch_process.before
                result_json['data_category'] = 'noprompt'
                break
            else:
                result_json['data'] = "Expect index out of bounds."
                result_json['data_category'] = 'error'
                result_json['return_code'] = 1
                break
        ch_process.close()
        if ch_process.exitstatus == None:
            result_json['cp_exit_code'] = 0
        else:
            result_json['cp_exit_code'] = ch_process.exitstatus
        return result_json
    except Exception as e:
        result_json['data'] = str(e)
        result_json['data_category'] = 'exception'
        result_json['return_code'] = 1
        return result_json

def reduceStr(raw_str):
    trimmed_str = re.sub('\d+ +','',raw_str)
    trimmed_str = re.sub('\r', '', trimmed_str)
    trimmed_str = trimmed_str.strip().split("\n")
    return trimmed_str
