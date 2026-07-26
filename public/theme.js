(function() {
  try {
    var stored = localStorage.getItem('theme');
    var hour = new Date().getHours();
    var isNightTime = hour >= 22 || hour < 6;
    var theme = stored || (isNightTime ? 'dark' : 'light');
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  } catch (e) {}
})();
