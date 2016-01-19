var innoUpdater = require('./inno-updater');

window.onload = function(){
	document.getElementById('quit-install').onclick = function(){
		innoUpdater.quitAndInstall()
	}
	document.getElementById('check-update').onclick = function(){
		innoUpdater.checkForUpdates()
	}
	document.getElementById('later').onclick = function(){
		document.getElementById('update-downloaded').style.display = 'none';
	}
	document.getElementById('close').onclick = function(){
		document.getElementById('update-not-avaliable').style.display = 'none';
	}
	document.getElementById('changelog').onclick = function(){
		alert(window.releaseNotes);
	}

	innoUpdater.setFeedURL('https://raw.githubusercontent.com/codeskyblue/electron-quick-start/master/example-feed.json')
	innoUpdater.on('checking-for-update', function(){
		console.log("INFO: Checking update")
	})
	innoUpdater.on('update-downloaded', function(data){
		console.log("INFO: Update file downloaded.", data)
		window.releaseNotes = data.releaseNotes;
		document.getElementById('update-downloaded').style.display = '';
	})
	innoUpdater.on('update-not-available', function(){
		document.getElementById('update-not-avaliable').style.display = '';
		console.log("INFO: Update not avaliable")
	})
	innoUpdater.on('update-avaliable', function(){
		console.log("INFO: Update avaliable")
	})
}