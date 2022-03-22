from flask import Flask, request, render_template

app = Flask(__name__)

#Return static page
@app.route('/',methods=['GET'])
def test():
    if request.method == "GET":
        return render_template('static.html')