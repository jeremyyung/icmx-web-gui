# icmx-web-gui
Example on how to make an API for a CLI utility, then slap a web gui onto it.

The license portal contains two FLASK applications:
icmx-api: Accepts REST requests to run licensing scripts (icmlt / icmgdpxlt).
icmx-site: The actual GUI that sends requests to icmx-api.

Example REST Requests

Show a list of all customers <br />
GET http://licportal:8080/search/icmlt <br />
RESPONSE JSON: <br />
{ <br />
  "cmd": "./icmlt search ", <br />
  "results": { <br />
    "cp_exit_code": 0, <br />
    "data": [ <br />
      "AMD", <br />
      "Analog_Value", <br />
      ... <br />
      "Xilinx" <br />
    ], <br />
    "data_category": "client_list", <br />
    "return_code": 0 <br />
  } <br />
} <br />

Update Expiration Date <br />
POST http://licportal:8080/renew/icmlt?customer=ICM_Internal&group=jeremy <br />
Data JSON: <br />
{ <br />
  "expiration":"2030/03/15", <br />
  "users":30 <br />
} <br />

RESPONSE JSON: <br />
{ <br />
  "cmd": "./icmlt renew -c ^ICM_Internal$ -g jeremy -e 2030/03/15 -u 30", <br />
  "results": { <br />
    "cp_exit_code": 0, <br />
    "data": " [y/N]: n\r\nExiting . . . \r\n", <br />
    "data_category": "noprompt", <br />
    "return_code": 0 <br />
  } <br />
} <br />

Ideally, this should run in two docker containers. Required files are in the license_dkr directory. <br />
