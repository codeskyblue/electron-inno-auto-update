'use strict'
// file: update.js
// author: codeskyblue
// created: 2016-01-18
// API reference: http://electron.atom.io/docs/v0.36.4/api/auto-updater/

// changelog:
// 2016-08-01:
//  author: Qquanwei
//  API reference: http://electron.atom.io/docs/api/auto-updater/
//  upgrade to electronv1.3.1
//  download to temp dictory as default

const EventEmitter = require('events').EventEmitter;
const remote = require('electron').remote;
const app = (remote && remote.app) || require('electron').app;
const cproc = require('child_process');
const path = require('path');
const https = require('follow-redirects').https;
const http = require('follow-redirects').http;
const fs = require('fs')
const parseUrl = require('url').parse

const updater = new EventEmitter();
let feedURL;
let errCancel = new Error("cancel");
let setupPath = path.join(process.env.TEMP|| app.getPath('temp'), 'innobox-upgrade.exe');

function makeRequest(url){
  let p = parseUrl(url)
  let module = (p.protocol === 'https:' ? https : http)

  let req = module.request({
    method: 'GET',
    host: p.host,
    path: p.path,
    maxRedirect: 3
  })
  return req;
}

/**
 * @param {String} url
 * @return {Promise}
 */
function request(url) {
  return new Promise(function(resolve, reject) {
    let req = makeRequest(url);

    req.on('response', function(res) {
      let chunks = []
      res.on('data', function(chunk) {
        chunks.push(chunk)
      })
      res.on('end', function() {
        resolve({
          statusCode: res.statusCode,
          body: Buffer.concat(chunks).toString('utf-8')
        })
      })
    })
    req.end()
    req.on('error', function(error) {
      reject(error)
    })
  })
}

function download(url, dst){
  return new Promise(function(resolve, reject){
    let file = fs.createWriteStream(dst)
    let req = makeRequest(url)
    req.on('response', function(res){
      res.pipe(file)
    })
    req.on('error', function(err){
      reject(err)
    })
    req.end()
    
    file.on('finish', function(){
      resolve(dst)
    })
  })
}

updater.setFeedURL = function(url){
  feedURL = url;
}

updater.checkForUpdates = function(isForce){
  if (!feedURL) {
    updater.emit('error', 'need to call before setFeedURL')
    return;
  }
  updater.emit('checking-for-update')

  request(feedURL)
    .then(res => {
      if (res.statusCode != 200 && response.statusCode != 204){
        throw new Error('invalid status code: ' + response.statusCode)
      }
      if (res.statusCode == 204) {
        this.emit('update-not-available')
        return Promise.reject(errCancel)
      }

      let data = JSON.parse(res.body)
      this.emit('update-avaliable')
      return data;
    })
    .then(data => {
      // check if needed to update
      if (!isForce && data.version === '0.0.2'){//app.getVersion()){
        this.emit('update-not-available')
        return Promise.reject(errCancel)
      }
      this.feedData = data;
      return download(data.updateURL, setupPath);
    })
    .then(dest =>{
      var data = this.feedData;
      this.emit('update-downloaded', {
        releaseNotes: data.changelog,
        releaseName: data.name,
        releaseDate: data.date,
        updateURL: data.updateURL,
      })
    })
    .catch(err => {
      if (err === errCancel){
        console.log("Cancel")
      } else {
        this.emit('error', err)
      }
    })
}

updater.quitAndInstall = function(){
  cproc.spawn(setupPath, ['/SILENT'], {
    detached: true,
    stdio: ['ignore', 'ignore', 'ignore']
  }).unref()

  app.quit();
}

module.exports = updater
