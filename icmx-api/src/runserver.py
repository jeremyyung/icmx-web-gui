from icmapi import app

if __name__ == '__main__':
    PORT = 8080
    app.config['DEBUG'] = True
    app.run(host='0.0.0.0', port=PORT)