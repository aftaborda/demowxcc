const users = {
  "1000": {
    id: "1000",
    name: "Joaquim Santos"
  },
  "1001": {
    id: "1001",
    name: "Genoveva Pascoal"
  },
  "1002": {
    id: "1002",
    name: "Hermenegildo Balsemão"
  },
  "1003": {
    id: "1003",
    name: "Teotónio Pires-Veloso"
  },
  "1004": {
    id: "1004",
    name: "Eulália Quaresma"
  },
  "1005": {
    id: "1005",
    name: "Zulmira Labareda"
  },
  "1006": {
    id: "1006",
    name: "Floripes Incarnação"
  },
  "1007": {
    id: "1007",
    name: "Custódio Melancia"
  },
  "1008": {
    id: "1008",
    name: "Anacleto Riba-Tua"
  },
  "1009": {
    id: "1009",
    name: "Olegário Boavida"
  },
  "1010": {
    id: "1010",
    name: "Sidónia Castanheira"
  }
};

const loginForm = document.getElementById("loginForm");

if (loginForm) {
  loginForm.addEventListener("submit", function (event) {
    event.preventDefault();

    const userId = document
      .getElementById("userId")
      .value
      .trim();

    const errorMessage = document.getElementById("loginError");

    if (users[userId]) {
      sessionStorage.setItem(
        "portalITUser",
        JSON.stringify(users[userId])
      );

      window.location.href = "dashboard.html";
    } else {
      errorMessage.textContent =
        "Invalid Employee ID. Please try again.";
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

function displayUser() {
  const user = loadUser();

  if (!user) return;

  const userNameElements =
    document.querySelectorAll("#userName");

  const userIdElements =
    document.querySelectorAll("#userIdDisplay");

  const welcomeName =
    document.getElementById("welcomeName");

  userNameElements.forEach(function (element) {
    element.textContent = user.name;
  });

  userIdElements.forEach(function (element) {
    element.textContent = "ID: " + user.id;
  });

  if (welcomeName) {
    welcomeName.textContent =
      user.name.split(" ")[0];
  }
}

function logout() {
  sessionStorage.removeItem("portalITUser");
  window.location.href = "index.html";
}

if (!loginForm) {
  displayUser();
}
