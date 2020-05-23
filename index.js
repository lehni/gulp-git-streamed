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
        var args = Array.prototype.slice.call(arguments, 0, func.length - 1);
        return through.obj(
            function(file, enc, cb) {
                // Provide a callback function for the original gulp-git method
                // as its last expected argument, and call the through2
                // transform callback from it when the git method completed.
                args[func.length - 1] = function(err) {
                    // No transformation is performed on the file, it is just
                    // passed through.
                    cb(err, file);
                };
                func.apply(git, args);
            }
        );
    }
});

module.exports = git;
