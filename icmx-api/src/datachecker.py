import json, re

def checkResult(raw_output):
    #Data categories = client_license, client_list, group_list, host_list, error]
    result_json = {'return_code': 0, 'data': '', 'data_category':'' }
    if (raw_output.__contains__('Client License:')):
        sanitized = raw_output.strip("Client License:").replace("\n", "")
        result_json['data'] = json.loads(sanitized)
        result_json['data_category'] = 'client_license'
    elif (raw_output.__contains__('GDPXL License:')):
        sanitized = raw_output.strip("GDPXL License:").replace("\n", "")
        result_json['data'] = json.loads(sanitized)
        result_json['data_category'] = 'client_license'
    elif(raw_output.__contains__('Customer (\"q\" to quit): None found')):
        client_list = reduceStr(raw_output)
        client_list.remove('Customer (\"q\" to quit): None found')
        result_json['data'] = client_list
        result_json['data_category'] = 'client_list'
    elif(raw_output.__contains__('Server Group (\"q\" to quit): None found')):
        group_list = reduceStr(raw_output)
        group_list.remove('Server Group (\"q\" to quit): None found')
        result_json['data'] = group_list
        result_json['data_category'] = 'group_list'
    elif(raw_output.__contains__('Server Hostname (\"q\" to quit): None found')):
        host_list = reduceStr(raw_output)
        host_list.remove('Server Hostname (\"q\" to quit): None found')
        result_json['data'] = host_list
        result_json['data_category'] = 'host_list'
    elif(raw_output.__contains__('Would you like to send these licenses to the customer?')):
        result_json['data'] = raw_output
        result_json['data_category'] = 'notify'
    elif (raw_output == ""):
        result_json['data'] = raw_output
        result_json['data_category'] = 'blank'
    else:
        result_json['data'] = raw_output
        result_json['data_category'] = 'error'
        result_json['return_code'] = 1
    return result_json

def checkPropVal(raw_output,cmdstr):
    result_json = {'return_code': 0, 'data': raw_output, 'data_category': 'propval'}
    if (raw_output.__contains__("Couldn't find")):
        result_json['return_code'] = 1
        result_json['data_category'] = 'error'
    if (cmdstr.__contains__("Uuid")):
        result_json['data_category'] = 'Uuid'
    if (cmdstr.__contains__("Quotas")):
        result_json['data_category'] = 'Quotas'
    return result_json

def reduceStr(raw_str):
    trimmed_str = re.sub('\d+ +','',raw_str)
    trimmed_str = re.sub('\r', '', trimmed_str)
    trimmed_str = trimmed_str.strip().split("\n")
    return trimmed_str
