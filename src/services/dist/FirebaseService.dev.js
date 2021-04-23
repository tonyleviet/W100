"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.FirebaseService = void 0;

var _md = _interopRequireDefault(require("md5"));

var _app = _interopRequireDefault(require("firebase/app"));

require("firebase/auth");

require("firebase/firestore");

var _nodeUuid = _interopRequireDefault(require("node-uuid"));

var _FirebaseApp = require("./FirebaseApp");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var FirebaseService =
/*#__PURE__*/
function () {
  function FirebaseService() {
    _classCallCheck(this, FirebaseService);
  }

  _createClass(FirebaseService, null, [{
    key: "signIn",

    /* Initialize Firebase */
    value: function signIn(idToken, accessToken) {
      var credential;
      return regeneratorRuntime.async(function signIn$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              credential = _app["default"].auth.GoogleAuthProvider.credential(idToken, accessToken);
              console.log('FirebaseService credential', credential);
              _context.next = 4;
              return regeneratorRuntime.awrap(_FirebaseApp.FirebaseApp.auth().signInWithCredential(credential));

            case 4:
              return _context.abrupt("return", _context.sent);

            case 5:
            case "end":
              return _context.stop();
          }
        }
      });
    }
  }, {
    key: "signOut",
    value: function signOut() {
      return regeneratorRuntime.async(function signOut$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              _context2.next = 2;
              return regeneratorRuntime.awrap(_FirebaseApp.FirebaseApp.auth().signOut());

            case 2:
              return _context2.abrupt("return", _context2.sent);

            case 3:
            case "end":
              return _context2.stop();
          }
        }
      });
    }
  }, {
    key: "addProduct",
    value: function addProduct(userId, imageUrls, city, cityName, district, districtName, name, price, phone, address, description, color, size, active) {
      var datetime = new Date();
      description = description || '';
      var productToAdd = {
        userId: userId,
        imageUrls: imageUrls,
        city: city,
        cityName: cityName,
        district: district,
        districtName: districtName,
        name: name,
        price: price,
        phone: phone,
        address: address,
        description: description,
        color: color,
        size: size,
        active: active,
        lastUpdate: datetime
      };
      console.log("addProduct userId:" + userId + "-productToAdd-", productToAdd);
      return this.productsCollection().add(productToAdd);
    }
  }, {
    key: "setProduct",
    value: function setProduct(id, userId, imageUrls, city, cityName, district, districtName, name, price, phone, address, description, color, size, active) {
      //  console.log("setProduct :",productToUpdate);
      description = description || '';
      var datetime = new Date();
      var productToUpdate = {
        userId: userId,
        imageUrls: imageUrls,
        city: city,
        cityName: cityName,
        district: district,
        districtName: districtName,
        name: name,
        price: price,
        phone: phone,
        address: address,
        description: description,
        color: color,
        size: size,
        active: active,
        lastUpdate: datetime
      };
      return this.productsCollection().doc(id).set(productToUpdate);
    }
  }, {
    key: "deleteProduct",
    value: function deleteProduct(id) {
      return this.productsCollection().doc(id)["delete"]();
    }
  }, {
    key: "getProduct",
    value: function getProduct(productId) {
      return this.productsCollection().doc(productId);
    }
  }, {
    key: "productsCollection",
    value: function productsCollection() {
      return _FirebaseApp.FirebaseApp.firestore().collection('products');
    }
  }, {
    key: "settingsCollection",
    value: function settingsCollection() {
      return _FirebaseApp.FirebaseApp.firestore().collection('settings');
    }
  }, {
    key: "activeProductsCollection",
    value: function activeProductsCollection(pageIndex, pageSize, cityID, districtID) {
      cityID = parseInt(cityID);
      districtID = parseInt(districtID); //let pageSize = 10;

      var date = new Date();
      var year = date.getFullYear();
      var month = date.getMonth();
      var day = date.getDate();
      districtID = 0;
      var last30Days = new Date(year, month - 1, day); // Subtract 1 MONTH

      var nextTotalItems = pageIndex * pageSize; //console.log("activeProductsCollection skip:", nextTotalItems, " pageSize:", pageSize)

      console.log('service activeProductsCollection', pageIndex, '--', pageSize, 'cityID:', cityID, ' districtID: ', districtID, ' nextTotalItems-', nextTotalItems); //const total =   this.productsCollection().get().then(res => console.log(res.size));
      //console.log("total", total);
      //if(nextTotalItems>total){
      //  nextTotalItems=total; 
      //}

      if (districtID !== 0) {
        return this.productsCollection().where("active", "==", true).where("city", "==", cityID).where("district", "==", districtID).orderBy("lastUpdate", "desc") //.startAt(skip) 
        .limit(nextTotalItems);
      } else {
        return this.productsCollection().where("active", "==", true).where("city", "==", cityID).orderBy("lastUpdate", "desc") //.startAt(skip) 
        .limit(nextTotalItems);
      }
    }
  }, {
    key: "productsCollectionByUser",
    value: function productsCollectionByUser(userId, pageIndex, pageSize) {
      var nextTotalItems = pageIndex * pageSize;
      console.log("productsCollectionByUser nextTotalItems", nextTotalItems, ' userId ', userId);
      return this.productsCollection().where("userId", "==", '109490188028640126173').orderBy("lastUpdate", "desc").limit(nextTotalItems);
      ;
    }
  }, {
    key: "allProductsCollectionByUser",
    value: function allProductsCollectionByUser(userId) {
      return this.productsCollection().where("userId", "==", userId);
    }
  }, {
    key: "citiesCollection",
    value: function citiesCollection() {
      return _FirebaseApp.FirebaseApp.firestore().collection('city').orderBy('Order');
    }
  }, {
    key: "districtsCollection",
    value: function districtsCollection() {
      return _FirebaseApp.FirebaseApp.firestore().collection('district').orderBy('Order');
    }
  }, {
    key: "userCollectionById",
    value: function userCollectionById(userId) {
      return _FirebaseApp.FirebaseApp.firestore().collection('users').where("userId", "==", userId);
    }
  }, {
    key: "adduser",
    value: function adduser(userId, name, email, phone, cityID, districtID, wardID, address, datetime) {
      //console.log("addProduct :"+userId+"-");
      return _FirebaseApp.FirebaseApp.firestore().collection('users').add({
        userId: userId,
        name: name,
        email: email,
        phone: phone,
        cityID: cityID,
        districtID: districtID,
        wardID: wardID,
        address: address,
        lastUpdate: datetime
      });
    }
  }, {
    key: "setUser",
    value: function setUser(docId, userId, name, email, phone, cityID, districtID, wardID, address, datetime) {
      console.log("setProduct :" + docId + "-" + userId + "-" + datetime + "-");
      return _FirebaseApp.FirebaseApp.firestore().collection('users').doc(docId).set({
        userId: userId,
        name: name,
        email: email,
        phone: phone,
        cityID: cityID,
        districtID: districtID,
        wardID: wardID,
        address: address,
        lastUpdate: datetime
      });
    }
  }, {
    key: "uploadImage",
    value: function uploadImage(path) {
      var id = imageId();
      var metadata = {
        cacheControl: 'public,max-age=604800',
        contentType: 'image/jpeg'
      };
      return _FirebaseApp.FirebaseApp.storage().ref("/products/images/".concat(id, ".jpg")).putFile(path, metadata);
    }
  }, {
    key: "uploadImageBase64",
    value: function uploadImageBase64(base64) {
      var id = imageId();
      var metadata = {
        cacheControl: 'public,max-age=604800',
        contentType: 'image/jpeg'
      };
      console.log('uploadImageBase64 base64', base64);
      return _FirebaseApp.FirebaseApp.storage().ref("/products/images/".concat(id, ".jpg")).putString(base64.substring(23), 'base64', {
        contentType: 'image/jpg'
      });
    }
  }]);

  return FirebaseService;
}(); // used only to generate a unique id
// ideally, the server would generate this unique id


exports.FirebaseService = FirebaseService;

function imageId() {
  var uniqueID = _nodeUuid["default"].v4();

  ;
  var date = Date.parse(Date());
  return (0, _md["default"])("".concat(uniqueID, "-").concat(date));
}