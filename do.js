/**
 * Created by HENG on 2015/5/22.
 */
var https = require("https");
var fs = require("fs");
var path = require("path");

var key = "CR25kPWD2NV8sViEjfgY7JEPuhWt_TmF";


module.exports = function (filePath, callback) {
	var input = fs.createReadStream(filePath);
	var fileExt = path.extname(filePath);
	var fileName = path.basename(filePath, fileExt);
	var output = fs.createWriteStream("test/" + fileName + ".mini" + fileExt);

	/* Uncomment below if you have trouble validating our SSL certificate.
	   Download cacert.pem from: http://curl.haxx.se/ca/cacert.pem */
	// var boundaries = /-----BEGIN CERTIFICATE-----[\s\S]+?-----END CERTIFICATE-----\n/g
	// var certs = fs.readFileSync(__dirname + "/cacert.pem").toString()
	// https.globalAgent.options.ca = certs.match(boundaries);

	var options = require("url").parse("https://api.tinify.com/shrink");
	options.auth = "api:" + key;
	options.method = "POST";

	var request = https.request(options, function(response) {
		if (response.statusCode === 201) {
			/* Compression was successful, retrieve output from Location header. */
			https.get(response.headers.location, function(response) {
				response.pipe(output);
				callback();
			});
		} else {
			/* Something went wrong! You can parse the JSON body for details. */
			console.log("Compression failed");
		}
	});

	input.pipe(request);
};