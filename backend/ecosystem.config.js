module.exports = {
	  apps : [
	      {
	        name: "InviECom_Server_Dev",
	        script: "./server.js",
	        instances: 1,
	        exec_mode: "fork",
	        watch: false,
	        increment_var : 'PORT',
	        env: {
	            "PORT": 5000,
	            "NODE_ENV": "production"
	        }
	      }
	  ]
	}
