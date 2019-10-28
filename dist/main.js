/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./src/index.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./src/index.js":
/*!**********************!*\
  !*** ./src/index.js ***!
  \**********************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _services_adapter__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./services/adapter */ "./src/services/adapter.js");
/* harmony import */ var _record__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./record */ "./src/record.js");




const API = new _services_adapter__WEBPACK_IMPORTED_MODULE_0__["default"]();
// --------------- Selectors -----------------------------------//
const recordsContainer = document.querySelector('.records-container');
const navBar = document.querySelector('.nav-bar');
const formDiv = document.querySelector('.new-record-form');
const searchBar = document.getElementById('search-bar');
const modalBtn = document.getElementById('modal-button');
const body = document.querySelector('body');
const userRecords = [];
let filtered;
// ---------------- RENDERS -------------------------//


function renderRecord(record){
  const newRecord = new _record__WEBPACK_IMPORTED_MODULE_1__["default"](record);
  newRecord.renderCard(recordsContainer);
};

function renderAllRecords(){
  navBar.style.display = "block";
  recordsContainer.style.display = "flex";
  recordsContainer.innerHTML = '';
  
  API.fetchRecords()
  .then(records => {
    records.forEach(record => {
      renderRecord(record)
    });
  });
};

function renderCollection(){
  if(userRecords.length > 0){
    userRecords.forEach(userRecord => {
      renderRecord(userRecord);
    })
  } else {
    API
    .getUser(localStorage.getItem('userId'))
    .then(user => {
      user.records.forEach(userRecord => {
        renderRecord(userRecord);
      });
    });
  };
};

function renderFilteredRecords(filtered){
  recordsContainer.innerHTML = '';
  filtered.forEach(record => {
    record.renderCard(recordsContainer);
  });
};


function renderLogin(){
  navBar.style.display = 'none';
  recordsContainer.style.display = 'none';

  const landing = document.createElement('div');
  landing.setAttribute('class', 'landing');
  landing.innerHTML = `
  <h1 class="login-title">R-Collector</h1>
  <h3 class="login-text">Log-in</h3>
  <input class="login-div" id="log-in" placeholder="Enter Email"></input>
  <button class="login-div" data-action="login">Log-in</button><br>
  <div></div>
  `;
  body.appendChild(landing);


  landing.addEventListener('click', e => {
    if (e.target.dataset.action === "login") {
      const logInInput = document.querySelector('#log-in').value;

      API.postUser(logInInput)
      .then(user => {
        localStorage.userId = user.id;
        user.records.forEach(r => userRecords.push(r));
        landing.remove();
        renderAllRecords();
      });
    };
  });
};


//-----------EVENT LISTENERS------------------------//
if(localStorage.userId){
  renderAllRecords();
} else {
  renderLogin();
};

recordsContainer.addEventListener('click', (e) => {
  if(e.target.innerText === "Add to Collection") {
    let recordId = parseInt(e.target.dataset.recordId);
    const sucessModal = document.getElementById('succesModal');
    postToCollection(localStorage.userId, recordId);

    setTimeout(function() {
      succesModal.click()
    }, 1500)
  }

  if(e.target.innerText === "Remove from Collection"){
    const collectionId = e.target.dataset.collectionId
    removeFromCollection(collectionId)
    .then(() => {
      const recordDiv = e.target.parentNode;
      recordDiv.remove();
    })
  }
});

navBar.addEventListener('click', (e) => {
  if (e.target.innerText === 'My Collection') {
    recordsContainer.innerHTML = '';
    renderCollection();
  } else if (e.target.innerText === 'All Records') {
    renderAllRecords();
  };

  if (e.target.dataset.action === 'flip'){
      const cards = document.querySelectorAll(".flip-card");
      cards.forEach(card => {
        card.classList.remove('flipped');
      });
  };

  if(e.target.dataset.action === "logout"){
    localStorage.removeItem("userId");
    renderLogin();
  }
});

// change to a submit event
formDiv.addEventListener('click', (e) => {
  e.preventDefault();
  const title = document.querySelector(".record-title").value;
  const artist = document.querySelector(".record-artist").value;
  const genre = document.querySelector(".record-genre").value;
  const image = document.querySelector(".record-img").value;

  if (e.target.innerText === "Create Record") {
    API.postRecord(title, artist, genre, image)
    .then(record => renderRecord(record))
    document.querySelector(".record-title").value = "";
    document.querySelector(".record-artist").value = "";
    document.querySelector(".record-genre").value = "";
    document.querySelector(".record-img").value = "";
  }
});

searchBar.addEventListener('input', (e) => {
  const searchInput = searchBar.value.toLowerCase();
  filtered = _record__WEBPACK_IMPORTED_MODULE_1__["default"].all.filter(({ title, artist, genre}) => {
    return (title.toLowerCase().includes(searchInput) 
    || artist.toLowerCase().includes(searchBar.value.toLowerCase(searchInput)) 
    || genre.toLowerCase().includes(searchBar.value.toLowerCase(searchInput)))
  });

  renderFilteredRecords(filtered);
});


/***/ }),

/***/ "./src/record.js":
/*!***********************!*\
  !*** ./src/record.js ***!
  \***********************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
class Record {
  constructor({id, title, artist, genre, image_url}){
    this.id = id;
    this.title = title;
    this.artist = artist;
    this.genre = genre;
    this.image_url = image_url;

    if(!Record.all.find(record => record.id === id)){
      Record.all.push(this);
    };
  };
  
  renderCard(container){ 
    const {id, title, artist, genre, image_url} = this;
    const html = `
      <div class="flip-card-inner">
        <div class="flip-card-front">
          <img class="card-image" src=${image_url} alt="Album Art" data-user-id=${localStorage.userId}>
        </div>
        <div class="flip-card-back">
          <div>
            <h1 class="record-title">${title}</h1>
            <h2 class="record-artist">${artist}</h2>
            <h3 class="record-genre">${genre}</h3>
          </div>
          <button 
            id="modal-success-button" 
            class="record-button" 
            data-user-id=${localStorage.userId} 
            data-record-id=${id} 
            data-toggle="modal" 
            data-target="#succesModal">
            Add to Collection
          </button>
        </div>
      </div>
     `;

    this.card = document.createElement('div');
    this.card.className = "flip-card"
    this.card.addEventListener('click', () => {
      if (this.card.classList.value.includes('flipped')){
        this.card.classList.remove('flipped')
      } else {
        this.card.classList.add('flipped')
      }
    })
    this.card.insertAdjacentHTML('beforeend', html);
    container.insertAdjacentElement('beforeend', this.card);
  }
  
}

Record.all = [];

/* harmony default export */ __webpack_exports__["default"] = (Record);

/***/ }),

/***/ "./src/services/adapter.js":
/*!*********************************!*\
  !*** ./src/services/adapter.js ***!
  \*********************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
class APICommunicator {
    constructor(endpoint = "http://localhost:3000/"){
        this.endpoint = endpoint;
        this.headers = {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        };
    }

    fetchRecords(){
        return fetch(this.endpoint + "records")
        .then(res => res.json())
    };

    postRecord(title, artist, genre, image) {
        return fetch(this.endpoint + "users", {
            method: "POST",
            headers: this.headers,
            body: JSON.stringify({
                title: title,
                artist: artist,
                genre: genre,
                image_url: image
            })
        }).then(resp => resp.json())
    };

    postUser(email) {
        return fetch(this.endpoint + "users", {
            method: "POST",
            headers: this.headers,
            body: JSON.stringify({
                email: email
            })
        })
        .then(resp => resp.json());
    };

    removeFromCollection(collectionId) {
      return fetch(this.endpoint + `collections/${collectionId}`, { method: "DELETE" })
    };

    postToCollection(userId, recordId) {
        return fetch(this.endpoint + "collections", {
            method: "POST",
            headers: this.headers,
            body: JSON.stringify({
                user_id: userId,
                record_id: recordId
            })
        })
    };

    getUser(userId){
        return fetch(this.endpoint + `/users/${userId}`)
        .then(resp => resp.json());
    };

};


/* harmony default export */ __webpack_exports__["default"] = (APICommunicator);



/***/ })

/******/ });