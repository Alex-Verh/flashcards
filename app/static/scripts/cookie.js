const setCookie = (name, value, exdays = 30) => {
  const date = new Date();
  date.setTime(date.getTime() + (exdays * 24 * 60 * 60 * 1000));
  let expires = "expires=" + date.toUTCString();
  document.cookie = name + "=" + value + ";" + expires + ";path=/";
}


const parseCookie = () => {
  const decodedCookies = decodeURIComponent(document.cookie).split('; ');
  const cookiesObject = {}
  decodedCookies.forEach((cookie) => {
    const [cookieName, cookieValue] = cookie.split('=')
    cookiesObject[cookieName] = cookieValue
  });
  return cookiesObject
}

export {setCookie, parseCookie}