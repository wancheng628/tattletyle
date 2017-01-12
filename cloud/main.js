
Parse.Cloud.define('hello', function(req, res) {
  res.success('Hi');
});


Parse.Cloud.define('push', function (request, response) {
    // THIS METHOD NO LONGER WORKS
    // Parse.Cloud.useMasterKey();

    Parse.Push.send({
        data: request.params.data
    }, {
        // ADD THE `useMasterKey` TO THE OPTIONS OBJECT
        useMasterKey: true,
        success: function () {
            response.success('Success!');
        },
        error: function (error) {
            response.error('Error! ' + error.message);
        }
    });
});
