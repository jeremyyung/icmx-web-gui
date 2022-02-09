import subprocess, os
from flask import Flask, request, jsonify
from flask_restful import Resource, Api
from flask_cors import CORS
from datachecker import checkResult, checkPropVal
app = Flask(__name__)

#Add module that prevents cross-origin requests from getting blocked in javascript
cors = CORS(app)
app.config['CORS_HEADERS'] = 'Content-Type'
api = Api(app)

script_dir = "/home/jeremy/Documents/p4_stuff/license_scripts"
os.chdir(script_dir)

input_prefix = "echo 'q' |" #bypass input prompts during icmx cmds
nonotify_prefix = "echo 'N' |" #Avoid sending email after renew command
notify_prefix = "echo 'y' |" #Avoid sending email after renew command
add_prefix = "echo -e 'y\nn' |" #Adding customer, avoid sending notice

class Search(Resource):
    def get(self, script_name):
        param_str = argsToFlags(request.args)
        script_str = "%s ./%s search %s" % (input_prefix, script_name, param_str)
        return runCmd(script_str)

class Renew(Resource):
    def post(self, script_name):
        param_str = argsToFlags(request.args)
        param_str = dataToFlags(request.json, param_str)
        script_str = "%s ./%s renew %s" % (nonotify_prefix, script_name, param_str)
        return runCmd(script_str)

class Notify(Resource):
    def post(self, script_name):
        param_str = argsToFlags(request.args)
        script_str = "%s ./%s notify %s" % (notify_prefix, script_name, param_str)
        return runCmd(script_str)

class Propval(Resource):
    def __init__(self):
        self.script_name = "icmgdpxlt"

    def get(self):
        #Gets all propvals with multiple cmds, combine results.
        param_str = argsToFlags(request.args)
        script_str = "./%s propval %s" % (self.script_name, param_str)
        return runCmd(script_str,prop_check=True)

    def post(self):
        param_str = argsToFlags(request.args)
        param_str = dataToFlags(request.json, param_str)
        script_str = "./icmgdpxlt propval %s" % (param_str)
        return runCmd(script_str,prop_check=True)

class Clone(Resource):
    def post(self, script_name):
        param_str = argsToFlags(request.args)
        script_str = "%s ./%s clone %s" % (nonotify_prefix, script_name, param_str)
        return runCmd(script_str)

class Add(Resource):
    def post(self, script_name):
        param_str = argsToFlags(request.args)
        param_str = dataToFlags(request.json, param_str)
        script_str = "%s ./%s add %s" % (add_prefix, script_name, param_str)
        return runCmd(script_str)

class Delete(Resource):
    def post(self, script_name):
        param_str = argsToFlags(request.args)
        script_str = "./%s delete %s" % (script_name, param_str)
        return runCmd(script_str)

def runCmd(cmdstr, prop_check=False):
    process = subprocess.Popen(cmdstr, shell=True, stdout=subprocess.PIPE, stderr=subprocess.PIPE)
    stdout, stderr = process.communicate()
    if prop_check:
        if not process.returncode:
            result_json = checkPropVal(stdout.decode('UTF-8'),cmdstr)
        else:
            result_json = {}
            result_json['return_code'] = process.returncode
            result_json['data'] = stdout.decode('UTF-8')
            result_json['data_category'] = 'error'
    else:
        result_json = checkResult(stdout.decode('UTF-8'))
    return fmtOutput(cmd=cmdstr,stdout=result_json,stderr=stderr.decode('UTF-8'),proc_code=process.returncode)

def fmtOutput(cmd="",stdout="",stderr="",proc_code=0):
    response = jsonify({"cmd":cmd, "results":stdout, "stderr":stderr,"proc_code":0})
    response.headers.add('Access-Control-Allow-Origin', '*')
    return response

def argsToFlags(req_args):
    param_str = ""
    if "customer" in req_args.keys():
        param_str = "-c ^%s$" % req_args['customer']
    if "group" in req_args.keys():
        param_str = param_str + " -g %s" % req_args['group']
    if "host" in req_args.keys():
        param_str = param_str + " -d %s" % req_args['host']
    if "propval" in req_args.keys():
        param_str = param_str + " -p %s" % req_args['propval']
    return param_str

def dataToFlags(data, param_str):
    if "expiration" in data.keys():
        param_str = param_str + " -e %s" % data['expiration']
    if "users" in data.keys():
        param_str = param_str + " -u %s" % data['users']
    if "property_value" in data.keys():
        param_str = param_str + " -l %s" % data['property_value']
    if "administrators" in data.keys():
        param_str = param_str + " -a %s" % data['administrators']
    return param_str

api.add_resource(Search,'/search/<string:script_name>')
api.add_resource(Renew,'/renew/<string:script_name>')
api.add_resource(Notify,'/notify/<string:script_name>')
api.add_resource(Add,'/add/<string:script_name>')
api.add_resource(Clone,'/clone/<string:script_name>')
api.add_resource(Delete,'/delete/<string:script_name>')
api.add_resource(Propval,'/propval')

