let darkBtn = document.getElementById("dark-mode-toggle");

const isDark = () => document.body.classList.contains('darkMode');

function updateBtn() {
  darkBtn.textContent = isDark() ? 'Light-Mode' : 'Dark-Mode';
}

if (localStorage.getItem('darkMode') === 'true') {
  document.body.classList.add('darkMode');
}
updateBtn();

darkBtn.addEventListener('click', () => {
  document.body.classList.toggle('darkMode');
  localStorage.setItem('darkMode', isDark());
  updateBtn();
});

const toggle = document.getElementById('hamburger-toggle');
const nav = document.getElementById('hamburger-nav');

toggle.addEventListener('click', () => {
  const isOpen = nav.classList.toggle('open');
  toggle.innerHTML = isOpen ? '&#10005;' : '&#9776;';
});