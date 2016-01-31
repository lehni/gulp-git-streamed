# gulp-git-streamed

A simple wrapper around [gulp-git](https://www.npmjs.com/package/gulp-git) (the Git plugin for gulp), making all commands return streams for better chainability:

```js
var gulp = require('gulp'),
    git = require('gulp-git-streamed'),
    bump = require('gulp-bump');

gulp.task('publish', function() {
    var version = '1.2.3',
    	message = 'Release version ' + version;
    return gulp.src([ 'package.json', 'component.json' ])
        .pipe(bump({ version: version }))
        .pipe(git.add())
        .pipe(git.commit(message))
        .pipe(git.tag('v' + version, message));
});
```

Copyright © 2016, Jürg Lehni.
