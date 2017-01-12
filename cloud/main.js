
Parse.Cloud.define('hello', function(req, res) {
  res.success('Hi');
});


Parse.Cloud.define('pushAll', function (request, response) {
    // THIS METHOD NO LONGER WORKS
    // Parse.Cloud.useMasterKey();

    var query = new Parse.Query(Parse.Installation);
    query.exists('user');
    Parse.Push.send({
        where: query,
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


Parse.Cloud.define('pushUserId', function (request, response) {
    // THIS METHOD NO LONGER WORKS
    // Parse.Cloud.useMasterKey();

    var query = new Parse.Query(Parse.Installation);
    query.equalTo("user", {
            __type: "Pointer",
            className: "_User",
            objectId: request.params.where
        });
    Parse.Push.send({
        where: query,
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


Parse.Cloud.define('pushUserName', function (request, response) {
    var query = new Parse.Query(Parse.Installation);
    query.include("user.username");
    query.equalTo("user.username", request.params.where);
    Parse.Push.send({
        where: query,
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

