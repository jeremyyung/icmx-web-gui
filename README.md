# icmx-web-gui
Example on how to make an API for a CLI utility, then slap a web gui onto it.

The license portal contains two FLASK applications:
icmx-api: Accepts REST requests to run licensing scripts (icmlt / icmgdpxlt).
icmx-site: The actual GUI that sends requests to icmx-api.

Example REST Requests
Show a list of all customers
GET http://192.168.1.30:8080/search/icmlt
RESPONSE JSON:
{
  "cmd": "./icmlt search ",
  "results": {
    "cp_exit_code": 0,
    "data": [
      "AMD",
      "Analog_Value",
      ...
      "Xilinx"
    ],
    "data_category": "client_list",
    "return_code": 0
  }
}

Update Expiration Date
POST http://192.168.1.30:8080/renew/icmlt?customer=ICM_Internal&group=jeremy
Data JSON:
{
  "expiration":"2030/03/15",
  "users":30
}

RESPONSE JSON:
{
  "cmd": "./icmlt renew -c ^ICM_Internal$ -g jeremy -e 2030/03/15 -u 30",
  "results": {
    "cp_exit_code": 0,
    "data": " [y/N]: n\r\nExiting . . . \r\n",
    "data_category": "noprompt",
    "return_code": 0
  }
}


Ideally, this should run in two docker containers. Required files are in the license_dkr directory.

