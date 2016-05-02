var git = require('gulp-git'),
    through = require('through2');

var methods = [
    'addRemote', 'removeRemote', 'addSubmodule', 'updateSubmodule',
    'push', 'pull', 'fetch', 'clone', 'tag', 'branch', 'checkout', 'merge',
    'reset', 'clean', 'exec'
];

methods.forEach(function(method) {
    // Get the original gulp-git function. `func.length` will be its expected
    // parameter count, and we'll use it to pass the callback function last.
    var func = git[method];
    // Override the method with one that returns a stream and handles the
    // callback and errors for us.
    git[method] = function() {
        // Convert arguments to an array, and make sure we have the expected
        // amount of parameters.
        var args = Array.prototype.slice.call(arguments, 0, func.length);
        return through.obj(function(file, enc, cb) {
            // No transformation needed, just pass it through without errors.
            cb(null, file);
        }, function(cb) {
            // Define the callback function as the last expected argument,
            // and call the original gulp-git function with it.
            args[func.length - 1] = function(err) {
                if (err)
                    this.emit('error', err);
                cb();
            }.bind(this);
            func.apply(git, args);
        });
    }
});

module.exports = git;
