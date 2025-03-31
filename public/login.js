document.getElementById("loginForm").addEventListener("submit", function (e) {
  e.preventDefault(); // Prevent default form submission

  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value.trim();
  const error = document.getElementById("error");

  const users = [
    { email: "antonia.wittrin@gmail.com", password: "Musikerin911" },
    { email: "linus.wittrin@gmail.com", password: "Mindstorms1!" },
    { email: "shanayalim06@gmail.com", password: "Hund123" }
  ];

  const userMatch = users.find(
    (user) => user.email === email && user.password === password
  );

  if (userMatch) {
    const username = userMatch.email.split("@")[0]; // z. B. antonia.wittrin
    window.location.href = `/dashboard/${encodeURIComponent(username)}`;
  } else {
    error.textContent = "Wrong email or password!";
    error.style.color = "#d9534f"; // Bootstrap-like red
  }
});