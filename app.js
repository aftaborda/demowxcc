let chatWidget = null;
const users = {
  1000: {
    id: "1000",
    name: "Joaquim Santos",
  },
  1001: {
    id: "1001",
    name: "Genoveva Pascoal",
  },
  1002: {
    id: "1002",
    name: "Hermenegildo Balsemão",
  },
  1003: {
    id: "1003",
    name: "Teotónio Pires-Veloso",
  },
  1004: {
    id: "1004",
    name: "Eulália Quaresma",
  },
  1005: {
    id: "1005",
    name: "Zulmira Labareda",
  },
  1006: {
    id: "1006",
    name: "Floripes Incarnação",
  },
  1007: {
    id: "1007",
    name: "Custódio Melancia",
  },
  1008: {
    id: "1008",
    name: "Anacleto Riba-Tua",
  },
  1009: {
    id: "1009",
    name: "Olegário Boavida",
  },
  1010: {
    id: "1010",
    name: "Sidónia Castanheira",
  },
};

const loginForm = document.getElementById("loginForm");

if (loginForm) {
  loginForm.addEventListener("submit", function (event) {
    event.preventDefault();

    const userId = document.getElementById("userId").value.trim();
    const showWidget = document.getElementById("show-widget");

    const errorMessage = document.getElementById("loginError");

    if (users[userId]) {
      sessionStorage.setItem("portalITUser", JSON.stringify(users[userId]));

      sessionStorage.setItem("showWidget", showWidget.checked);

      window.location.href = "dashboard.html";
    } else {
      errorMessage.textContent = "Invalid Employee ID. Please try again.";
    }
  });
}

function loadUser() {
  const storedUser = sessionStorage.getItem("portalITUser");

  if (!storedUser) {
    const isLoginPage =
      window.location.pathname.endsWith("index.html") ||
      window.location.pathname.endsWith("/");

    if (!isLoginPage) {
      window.location.href = "index.html";
    }

    return null;
  }

  return JSON.parse(storedUser);
}

function getShowWidget() {
  return sessionStorage.getItem("showWidget") === true;
}

function setShowWidget(value) {
  console.log(`[Custom Integration] setShowWidget(${value})`);
  const show = !!value;
  sessionStorage.setItem("showWidget", show);
  if (chatWidget) {
    console.log(`[Custom Integration] Show widget? ${show}`);
    if (show) chatWidget.show();
    else chatWidget.hide();
  }
}

function displayUser() {
  const user = loadUser();

  if (!user) return;

  const userNameElements = document.querySelectorAll("#userName");

  const userIdElements = document.querySelectorAll("#userIdDisplay");

  const welcomeName = document.getElementById("welcomeName");

  userNameElements.forEach(function (element) {
    element.textContent = user.name;
  });

  userIdElements.forEach(function (element) {
    element.textContent = "ID: " + user.id;
  });

  if (welcomeName) {
    welcomeName.textContent = user.name.split(" ")[0];
  }
}

function logout() {
  sessionStorage.removeItem("portalITUser");
  window.location.href = "index.html";
}

function showWidget() {
  setShowWidget(true);
}

function hideWidget() {
  setShowWidget(false);
}

if (!loginForm) {
  displayUser();
}

(function () {
  let attempts = 0;
  const maxAttempts = 50;

  const checkWidget = setInterval(() => {
    attempts++;

    if (window.imichatwidget && typeof window.imichatwidget.on === "function") {
      clearInterval(checkWidget);
      console.log("[Custom Integration] Webex Widget detetado com sucesso!");
      chatWidget = window.imichatwidget;
      initializeChatListeners();
    } else if (attempts >= maxAttempts) {
      clearInterval(checkWidget);
      console.warn(
        "[Custom Integration] O widget do Webex demorou demasiado tempo a carregar.",
      );
    }
  }, 100); // Executa a verificação a cada 100 milissegundos

  function updateChatWidget() {
    const user = loadUser();
    const show = getShowWidget();

    if (!user) return;

    console.log(`[Custom Integration] update widget for user ${user.id}`);
    const data = `{"custom_chat_fields": {"customerName": "${user.name}", "customerId": "${user.id}"}}`;
    window.imichatwidget.update(data, function (response) {
      console.log(
        `[Custom Integration] User id: ${user.id}, Resposta do widget update: ${JSON.stringify(response)}`,
      );
      setShowWidget(show);
    });
  }

  function initializeChatListeners() {
    window.imichatwidget.on("imichat-widget:ready", function () {
      console.log("[Custom Integration] O widget está pronto!");
      updateChatWidget();
    });
  }
})();
