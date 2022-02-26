import subprocess
from flask import Flask, request, render_template
from flask_restful import Resource, Api

app = Flask(__name__)

#Return static test page
@app.route('/',methods=['GET'])
def test():
    if request.method == "GET":
        return render_template('static.html')