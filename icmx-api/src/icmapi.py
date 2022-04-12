import os
from flask import Flask, request, jsonify
from flask_restful import Resource, Api
from flask_cors import CORS
from datachecker import runExpect
app = Flask(__name__)

#Add module that prevents cross-origin requests from getting blocked in javascript
cors = CORS(app)
app.config['CORS_HEADERS'] = 'Content-Type'
api = Api(app)

script_dir = "/home/jeremy/Documents/p4_stuff/license_scripts"
os.chdir(script_dir)

class Search(Resource):
    def get(self, script_name):
        param_str = argsToFlags(request.args)
        script_str = "./%s search %s" % (script_name, param_str)
        return runCmd(script_str)

class Renew(Resource):
    def post(self, script_name):
        param_str = argsToFlags(request.args)
        param_str = dataToFlags(request.json, param_str)
        script_str = "./%s renew %s" % (script_name, param_str)
        return runCmd(script_str, notify=False)

class Notify(Resource):
    def post(self, script_name):
        param_str = argsToFlags(request.args)
        script_str = "./%s notify %s" % (script_name, param_str)
        return runCmd(script_str, notify=True)

class Propval(Resource):
    def __init__(self):
        self.script_name = "icmgdpxlt"

    def get(self):
        param_str = argsToFlags(request.args)
        script_str = "./%s propval %s" % (self.script_name, param_str)
        return runCmd(script_str)

    def post(self):
        param_str = argsToFlags(request.args)
        param_str = dataToFlags(request.json, param_str)
        script_str = "./%s propval %s" % (self.script_name,param_str)
        return runCmd(script_str)

class Clone(Resource):
    def post(self, script_name):
        param_str = argsToFlags(request.args)
        script_str = "./%s clone %s" % (script_name, param_str)
        return runCmd(script_str, notify=False)

class Add(Resource):
    def post(self, script_name):
        param_str = argsToFlags(request.args)
        param_str = dataToFlags(request.json, param_str)
        script_str = "./%s add %s" % (script_name, param_str)
        return runCmd(script_str, notify=False)

class Delete(Resource):
    def post(self, script_name):
        param_str = argsToFlags(request.args)
        script_str = "./%s delete %s" % (script_name, param_str)
        return runCmd(script_str)

def runCmd(cmdstr, **kwargs):
    result_json = runExpect(cmdstr,**kwargs)
    return fmtOutput(cmd=cmdstr, result=result_json)

def fmtOutput(cmd="", result=None):
    response = jsonify({"cmd":cmd, "results":result})
    response.headers.add('Access-Control-Allow-Origin', '*')
    return response

def argsToFlags(req_args):
    param_str = ""
    if "customer" in req_args.keys():
        param_str = "-c %s" % req_args['customer']
    if "group" in req_args.keys():
        param_str = param_str + " -g %s" % req_args['group']
    if "host" in req_args.keys():
        param_str = param_str + " -d %s" % req_args['host']
    if "propval" in req_args.keys():
        param_str = param_str + " -p %s" % req_args['propval']
    return param_str

def dataToFlags(data, param_str):
    data_keys = data.keys()
    for exp_label in ['expiration','expires','Expiration']: #Different field name for GDP/GDPXL
        if exp_label in data_keys:
            param_str = param_str + " -e %s" % data[exp_label]
    for usr_label in ['users', 'Users']:
        if usr_label in data_keys:
            param_str = param_str + " -u %s" % data[usr_label]
    if "property_value" in data.keys():
        param_str = param_str + " -l \'%s\'" % data['property_value']
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

