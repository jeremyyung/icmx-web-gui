from icmapi import app as application

if __name__ == '__main__':
    PORT = 8080
    application.config['DEBUG'] = False
    application.run(host='0.0.0.0', port=PORT)