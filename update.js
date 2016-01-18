// file: update.js
// author: codeskyblue
// created: 2016-01-18
// API reference: http://electron.atom.io/docs/v0.36.4/api/auto-updater/

var EventEmitter = require('events').EventEmitter;
var app = require('remote').app;

var updateEvent = new EventEmitter();
var feedURL = null;

module.exports = updateEvent;

module.exports.setFeedURL = function(url){
	feedURL = url;
}

module.exports.checkForUpdates = function(){
	updateEvent.emit('checking-for-update')
	// updateEvent.emit('update-not-available')
	// updateEvent.emit('update-downloaded')
	// updateEvent.emit('error', 'test error')
}

module.exports.quitAndInstall = function(){
	app.exit(7)
}
