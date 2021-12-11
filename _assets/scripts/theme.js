var themeConfig = {
  dark: {
    accent: '#42b983',
    toogleBackground: '#ffffff',
    background: '#091a28',
    textColor: '#b4b4b4',
    codeTextColor: '#ffffff',
    codeBackgroundColor: '#0e2233',
    borderColor: '#0d2538',
    blockQuoteColour: '#858585',
    highlightColor: '#d22778',
    sidebarSublink: '#b4b4b4',
    codeTypeColor: '#ffffff',
    coverBackground: 'linear-gradient(to left bottom, hsl(118, 100%, 85%) 0%,hsl(181, 100%, 85%) 100%)',
    toogleImage: 'url(https://cdn.jsdelivr.net/npm/docsify-darklight-theme@latest/icons/sun.svg)'
  },
  light: {
    accent: '#42b983',
    toogleBackground: '#091a28',
    background: '#ffffff',
    textColor: '#34495e',
    codeTextColor: '#525252',
    codeBackgroundColor: '#f8f8f8',
    borderColor: 'rgba(0, 0, 0, 0.07)',
    blockQuoteColor: '#858585',
    highlightColor: '#d22778',
    sidebarSublink: '#505d6b',
    codeTypeColor: '#091a28',
    coverBackground: 'linear-gradient(to left bottom, hsl(118, 100%, 85%) 0%,hsl(181, 100%, 85%) 100%)',
    toogleImage: 'url(https://cdn.jsdelivr.net/npm/docsify-darklight-theme@latest/icons/moon.svg)'
  }
}

var defaultTheme = 'dark';

localStorage.setItem('DARK_LIGHT_THEME', 'dark')

var setTheme = (theme) => {
  localStorage.setItem('DARK_LIGHT_THEME', theme);

  if (theme === "light") {
    for (var [key, value] of Object.entries(themeConfig.light))
      document.documentElement.style.setProperty('--' + key, value)
  } else if (theme == "dark") {
    for (var [key, value] of Object.entries(themeConfig.dark))
      document.documentElement.style.setProperty('--' + key, value)
  }

  document.documentElement.style.setProperty('color-scheme', theme)

  document.getElementById('docsify-darklight-theme')
    .setAttribute('aria-pressed', theme === 'dark');
}

window.$docsify.plugins = [].concat((hook, vm) => {
  hook.afterEach(function (html, next) {
    var darkEl = `<div id="docsify-darklight-theme" aria-label="Dark mode"></div>`
    html = `${darkEl}${html}`
    next(html);
  })

  hook.doneEach(function () {
    var savedTheme = localStorage.getItem('DARK_LIGHT_THEME') || defaultTheme;
    setTheme(savedTheme)

    document.getElementById('docsify-darklight-theme').addEventListener('click', function () {
      var savedTheme = localStorage.getItem('DARK_LIGHT_THEME') || defaultTheme;
      savedTheme === 'light' ? setTheme('dark') : setTheme('light')
    });
  })
}, window.$docsify.plugins);