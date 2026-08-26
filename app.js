let chatWidget = null;
const users = {
  1000: {
    id: "1000",
    name: "Joaquim Santos",
    email: "joaquim.santos@mail.local",
    phone: "+351900111222",
    language: "pt-PT",
  },
  1001: {
    id: "1001",
    name: "Genoveva Pascoal",
    email: "genoveva.p@mail.local",
    phone: "+351966111333",
    language: "pt-PT",
  },
  1002: {
    id: "1002",
    name: "Hermenegildo Balsemão",
    email: "hermenegildo.b@mail.local",
    phone: "+351910001122",
    language: "pt-PT",
  },
  1003: {
    id: "1003",
    name: "Teotónio Pires-Veloso",
    email: "teotonio.pv@mail.local",
    phone: "+351966000111",
    language: "pt-PT",
  },
  1004: {
    id: "1004",
    name: "Eulália Quaresma",
    email: "eulalia.q@mail.local",
    phone: "+351910555444",
    language: "en-GB",
  },
  1005: {
    id: "1005",
    name: "Zulmira Labareda",
    email: "zulmira.l@mail.local",
    phone: "+351220777888",
    language: "en-GB",
  },
  1006: {
    id: "1006",
    name: "Floripes Incarnação",
    email: "floripes.i@mail.local",
    phone: "+351922888999",
    language: "en-GB",
  },
  1007: {
    id: "1007",
    name: "Custódio Melancia",
    email: "custodio.m@mail.local",
    phone: "+351933777666",
    language: "en-GB",
  },
  1008: {
    id: "1008",
    name: "Anacleto Riba-Tua",
    email: "anacleto.r@mail.local",
    phone: "+351210444555",
    language: "es-ES",
  },
  1009: {
    id: "1009",
    name: "Olegário Boavida",
    email: "olegario.b@mail.local",
    phone: "+351922666777",
    language: "es-ES",
  },
  1010: {
    id: "1010",
    name: "Sidónia Castanheira",
    email: "sidonia.c@mail.local",
    phone: "+351933222111",
    language: "es-ES",
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
      const show = !!showWidget.checked;
      users[userId].show = show;
      sessionStorage.setItem("portalITUser", JSON.stringify(users[userId]));

      console.log(`[Login form submit] Mostrar o widget? ${show}`);
      //sessionStorage.setItem("showWidget", show);

      getShowWidget();

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
  const user = loadUser();
  const show = !!user.show;
  console.log(`[Custom Integration] getShowWidget() returns ${show}`);
  return show;
}

function setShowWidget(value) {
  console.log(`[Custom Integration] setShowWidget(${value})`);
  const show = !!value;
  const user = loadUser();
  user.show = show;
  sessionStorage.setItem("portalITUser", JSON.stringify(user));
  //sessionStorage.setItem("showWidget", show);
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
    const custom_chat_fields = {
      userId: user.id,
      userName: user.name,
      userEmail: user.email,
      userPhone: user.phone,
      userLanguage: user.language,
    };
    //const data = `{"custom_chat_fields": {"customerName": "${user.name}", "customerEmail": "${user.email}", "customerId": "${user.id}"}}`;
    const data = JSON.stringify(custom_chat_fields);
    console.log(data);
    window.imichatwidget.update(data, function (response) {
      console.log(
        `[Custom Integration] User id: ${user.id}, Resposta do widget update: ${JSON.stringify(response)}`,
      );
      setShowWidget(!!user.show);
    });
  }

  function initializeChatListeners() {
    window.imichatwidget.on("imichat-widget:ready", function () {
      console.log("[Custom Integration] O widget está pronto!");
      updateChatWidget();
    });
  }
})();
