function changeBackground() {
  const backgroundUrl = localStorage.getItem('backgroundUrl') || "url(/static/images/background_default.jpg)"
  document.body.style.backgroundImage = backgroundUrl;
}

export {changeBackground}