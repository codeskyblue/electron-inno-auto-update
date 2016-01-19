# innobox
This is an example [electron](http://electron.atom.io/) app to show how to update self using [innoSetup](http://www.jrsoftware.org/isinfo.php).

The name `innobox` is the demo name.

## Usage
```
# install dependencies
npm install

# run app
npm start
```

## Package
```
npm i -g gulp
gulp inno
```

This command will package innobox to file `release/innobox-setup.exe`

## More
File `inno-update.js` implement API which defines in <http://electron.atom.io/docs/v0.36.4/api/auto-updater/>

## PS
是不是很简单，坑爹的我花了好长时间才想起来可以这么做。

## License [CC0 (Public Domain)](LICENSE.md)
