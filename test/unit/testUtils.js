"use strict";

function log(message) {
  /*eslint-disable*/
  console.log("TEST> " + message);
  /*eslint-enable*/
}

function setupMockSchema(mockSchema, firebaseRoot, userId) {
  var $firebaseArray;
  var $firebaseObject;

  inject(function (_$firebaseArray_, _$firebaseObject_) {
    $firebaseArray = _$firebaseArray_;
    $firebaseObject = _$firebaseObject_;
  });

  mockSchema.getRoot.and.callFake(function () {
    return firebaseRoot;
  });
  mockSchema.getObject.and.callFake(function (ref) {
    return $firebaseObject(ref);
  });
  mockSchema.getArray.and.callFake(function (ref) {
    return $firebaseArray(ref);
  });
  mockSchema.status = { userId: userId };
}

function expectRefChildToEqual(ref, childPosition, expectedValue) {
  expect(getRefChild(ref, childPosition))
    .toEqual(expectedValue);
}

function expectRefChildToContain(ref, childPosition, expectedValue) {
  expect(getRefChild(ref, childPosition))
    .toEqual(jasmine.objectContaining(expectedValue));
}

function getRefChild(ref, childPosition) {
  // Slightly convoluted process to get object added to
  // firebase reference as we don't know the keys created
  var key = ref.getKeys()[childPosition];
  return key && ref.getData()[key];
}

function assertListEquals(actual, expected) {
  expect(actual.length).toEqual(expected.length, "list length");

  for (var i = 0; i < actual.length; i++) {
    expect(actual[i])
      .toEqual(jasmine.objectContaining(expected[i]), "element #" + i);
  }
}

function addQuerySupport(firebaseRef) {
  var childKey = ".";

  firebaseRef.orderByChild = jasmine.createSpy("orderByChild").and.callFake(mockOrderByChild);

  function mockOrderByChild(key) {
    childKey = key;

    var queryResults = firebaseRef.root().child(firebaseRef.key + "-orderByChild(" + childKey + ")");
    queryResults.autoFlush(true);

    var data = firebaseRef.getData();
    var keys = firebaseRef.getKeys();

    keys.sort(function (a, b) {
      return compare(data[a][childKey], data[b][childKey]);
    });

    // Use priority to get required order
    angular.forEach(keys, function (key, index) {
      queryResults.child(key).setWithPriority(data[key], index);
    });

    queryResults.on("child_added", resync);
    queryResults.on("child_changed", resync);

    // Brute force to reflect changes in query results to original
    function resync() {
      angular.forEach(queryResults.getData(), function (item, key) {
        firebaseRef.child(key).set(item);
      });
    }

    queryResults.equalTo = jasmine.createSpy("equalTo").and.callFake(mockEqualTo);

    return queryResults;

    function mockEqualTo(value) {
      angular.forEach(queryResults.getData(), function (item, key) {
        if (item[childKey] !== value) {
          queryResults._removeChild(key);
        }
      });

      return queryResults;
    }
  }

  function compare(a, b) {
    if (angular.isNumber(a)) {
      return a - b;
    }
    else if (angular.isString(a)) {
      return a.localeCompare(b);
    }
    else {
      return 0;
    }
  }

}

module.exports = {
  expectRefChildToEqual: expectRefChildToEqual,
  expectRefChildToContain: expectRefChildToContain,
  getRefChild: getRefChild,
  addQuerySupport: addQuerySupport,
  assertListEquals: assertListEquals,
  log: log,
  setupMockSchema: setupMockSchema
};
