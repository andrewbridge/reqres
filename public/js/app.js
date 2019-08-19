window.addEventListener(
  "load",
  function() {
    FastClick.attach(document.body);
  },
  false
);
(function() {
  var config = {
    users: {
      url: "users?page=2",
      type: "get",
      data: null
    },
    "users-single": {
      url: "users/2",
      type: "get",
      data: null
    },
    "users-single-not-found": {
      url: "users/23",
      type: "get",
      data: null
    },
    unknown: {
      url: "unknown",
      type: "get",
      data: null
    },
    "unknown-single": {
      url: "unknown/2",
      type: "get",
      data: null
    },
    "unknown-single-not-found": {
      url: "unknown/23",
      type: "get",
      data: null
    },
    post: {
      url: "users",
      type: "post",
      data: {
        name: "morpheus",
        job: "leader"
      }
    },
    put: {
      url: "users/2",
      type: "put",
      data: {
        name: "morpheus",
        job: "zion resident"
      }
    },
    patch: {
      url: "users/2",
      type: "patch",
      data: {
        name: "morpheus",
        job: "zion resident"
      }
    },
    delete: {
      url: "users/2",
      type: "delete",
      data: null
    },
    "register-successful": {
      url: "register",
      type: "post",
      data: {
        email: "eve.holt@reqres.in",
        password: "pistol"
      }
    },
    "register-unsuccessful": {
      url: "register",
      type: "post",
      data: {
        email: "sydney@fife"
      }
    },
    "login-successful": {
      url: "login",
      type: "post",
      data: {
        email: "eve.holt@reqres.in",
        password: "cityslicka"
      }
    },
    "login-unsuccessful": {
      url: "login",
      type: "post",
      data: {
        email: "peter@klaven"
      }
    },
    delay: {
      url: "users?delay=3",
      type: "get",
      data: null
    }
  };

  var consoleEl = document.querySelector("#console");

  var endpointsEl = consoleEl.querySelector("[data-key='endpoints']");

  var endpointEls = endpointsEl.querySelectorAll("[data-key='endpoint']");

  var urlEl = consoleEl.querySelector("[data-key='url']");

  var requestOutputLinkEl = consoleEl.querySelector(
    "[data-key='request-output-link']"
  );

  var responseCodeEl = consoleEl.querySelector("[data-key='response-code']");

  var sendRequestButton = consoleEl.querySelector("[data-key='send-request']");

  var outputRequestEl = consoleEl.querySelector("[data-key='output-request']");

  var outputResponseEl = consoleEl.querySelector(
    "[data-key='output-response']"
  );

  var spinnerEl = consoleEl.querySelector("[data-key='spinner']");

  var timerID = null;

  [].forEach.call(endpointEls, function(element) {
    var key = element.getAttribute("data-id");
    var linkEl = element.querySelector("[data-key='try-link']");
    var finalURL = "/api/" + config[key].url;

    linkEl.href = finalURL;
  });

  [].forEach.call(endpointEls, function(el) {
    el.addEventListener("click", function(e) {
      e.preventDefault();

      var element = e.currentTarget;

      clearTimeout(timerID);
      timerID = setTimeout(function() {
        var adEl = document.querySelector("#carbonads");
        if (adEl && typeof _carbonads !== "undefined") _carbonads.refresh();
      }, 500);

      var element = e.currentTarget;

      var key = element.getAttribute("data-id");

      var settings = config[key];

      var xhr = new XMLHttpRequest();

      for (var i = endpointEls.length - 1; i >= 0; i--) {
        var ep = endpointEls[i];
        ep.classList.remove("active");
      }

      element.classList.add("active");
      outputRequestEl.setAttribute("hidden", true);
      if (settings.data) {
        outputRequestEl.innerHTML = syntaxHighlight(
          JSON.stringify(settings.data, undefined, 4)
        );
        outputRequestEl.removeAttribute("hidden");
      }

      var finalURL = "/api/" + settings.url;
      urlEl.innerHTML = finalURL;
      requestOutputLinkEl.href = finalURL;

      outputResponseEl.innerHTML = "";
      outputResponseEl.setAttribute("hidden", true);
      spinnerEl.removeAttribute("hidden");

      xhr.open(settings.type.toUpperCase(), finalURL, true);
      xhr.setRequestHeader("Content-Type", "application/json");
      xhr.onload = function() {
        responseCodeEl.innerHTML = xhr.status;
        responseCodeEl.classList.remove("bad");
        if (xhr.status !== 200 && xhr.status !== 201) {
          responseCodeEl.classList.add("bad");
        }
        if (xhr.responseText) {
          outputResponseEl.innerHTML = syntaxHighlight(
            JSON.stringify(JSON.parse(xhr.responseText), undefined, 4)
          );
        }
        spinnerEl.setAttribute("hidden", true);
        outputResponseEl.removeAttribute("hidden");
      };
      xhr.send(settings.data ? JSON.stringify(settings.data) : null);
    });
  });

  endpointEls[0].click();

  function syntaxHighlight(json) {
    json = json
      .replace(/&/g, "&")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");
    return json.replace(
      /("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g,
      function(match) {
        var cls = "number";
        if (/^"/.test(match)) {
          if (/:$/.test(match)) {
            cls = "key";
          } else {
            cls = "string";
          }
        } else if (/true|false/.test(match)) {
          cls = "boolean";
        } else if (/null/.test(match)) {
          cls = "null";
        }
        return '<span class="' + cls + '">' + match + "</span>";
      }
    );
  }

  const triggerProBtn = document.querySelector("#trigger-pro");
  const proForm = document.querySelector("#pro-form");
  triggerProBtn &&
    triggerProBtn.addEventListener("click", function() {
      this.style.display = "none";
      proForm.style.display = "block";
    });
})();
