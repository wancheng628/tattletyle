
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
    var usQuery = new Parse.Query("_User");
    usQuery.equalTo("username", request.params.where);
    query.matchesQuery("user", usQuery);
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


Parse.Cloud.define('pushTo', function (request, response) {
    Parse.Cloud.useMasterKey();
    var query = new Parse.Query(Parse.Installation);
    var usQuery = new Parse.Query("_User");
    usQuery.equalTo(request.params.where, request.params.value);
    query.matchesQuery("user", usQuery);
    var pushData = request.params.data
    pushData["click_action"] = "FCM_PLUGIN_ACTIVITY"
    Parse.Push.send({
        where: query,
        data: pushData
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

Parse.Cloud.beforeSave(Parse.Installation, function(request, response) {
  Parse.Cloud.useMasterKey();
  var androidId = request.object.get("androidId");
  var gcmSenderId = request.object.get("GCMSenderId");  
  if (androidId == null || androidId == "" || gcmSenderId == null) {
      console.warn("No androidId found, save and exit");
      response.success();
      return;
  }
  var query = new Parse.Query(Parse.Installation);
  query.equalTo("androidId", androidId);
  query.addAscending("createdAt");
  query.find({ useMasterKey: true}).then(function(results) {
      for (var i = 0; i < results.length; ++i) {
          console.warn("iterating over Installations with androidId= "+ androidId);
          if (results[i].get("installationId") != request.object.get("installationId")) {
              console.warn("Installation["+i+"] and the request have different installationId values. Try to delete. [installationId:" + results[i].get("installationId") + "]");
              results[i].destroy({useMasterKey: true}).then(function() {
                  console.warn("Installation["+i+"] has been deleted");
              },
              function() {
                  console.warn("Error: Installation["+i+"] could not be deleted");
              });
          } else {
              console.warn("Installation["+i+"] and the request has the same installationId value. Ignore. [installationId:" + results[i].get("installationId") + "]");
          }
      }
      console.warn("Finished iterating over Installations. A new Installation will be saved now...");
      response.success();
  },
  function(error) {
      response.error("Error: Can't query for Installation objects.");
  });
});
