var wget = require('wget');
var targz = require('tar.gz');
var fs = require('fs-extra');
var chmodr = require('chmodr');
var path = require('path');

var deleteFolderRecursive = function(path) {
  if ( fs.existsSync(path) ) {
    fs.readdirSync(path).forEach(function(file,index) {
      var curPath = path + "/" + file;
      if ( fs.lstatSync(curPath).isDirectory() ) { // recurse
        deleteFolderRecursive(curPath);
      } else { // delete file
        fs.unlinkSync(curPath);
      }
    });
    fs.rmdirSync(path);
  }
};

var firstDownload = true;
var src = 'https://www.magentocommerce.com/downloads/assets/1.8.1.0/magento-1.8.1.0.tar.gz';
var output = 'magento.tar.gz';

var download = wget.download(src, output);
download.on('progress', function(progress) {
	if (firstDownload) {
    	console.log('Downloading...');
    	firstDownload = false;
    }
});

download.on('error', function(err) {
    console.log('Download error: '+err);
});

download.on('end', function(output) {
	var compress = new targz().extract('magento.tar.gz', __dirname, function(err) {
	    if (err) {
	        console.log(err);
	    }

	    fs.copy(__dirname+'/magento/', __dirname, function (err) {
			if (err) {
				console.error(err);
			} else {
			  	fs.chmod(__dirname+'/app/etc','0777');
				fs.chmod(__dirname+'/var','0777');
				fs.chmod(__dirname+'/var/package','0777');
				fs.chmod(__dirname+'/media','0777');
				fs.chmod(__dirname+'/media/customer','0777');
				fs.chmod(__dirname+'/media/dhl','0777');
				fs.chmod(__dirname+'/media/downloadable','0777');
				fs.chmod(__dirname+'/media/xmlconnect','0777');
				fs.chmod(__dirname+'/media/xmlconnect/','0777');
				fs.chmod(__dirname+'/media/xmlconnect/custom','0777');
				fs.chmod(__dirname+'/media/xmlconnect/original','0777');
				fs.chmod(__dirname+'/media/xmlconnect/system','0777');
				
				deleteFolderRecursive( __dirname+ 'node_modules');
				deleteFolderRecursive( __dirname+ 'magento');
				deleteFolderRecursive(__dirname+output);
				console.log('You can running at localhost/'+path.basename(__dirname));
		  	}
		});
	});
});



