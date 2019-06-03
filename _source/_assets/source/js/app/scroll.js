//* ***************************
// SCROLL ACTION
// for scrolling the page
//* ***************************
function scrollPageTo(to, duration) {
  let top;
  console.log(to, duration)
  if (window.scrollY === undefined) {
    top = window.pageYOffset;
  } else {
    top = window.scrollY;
  }

  if (duration <= 0) return;
  const difference = to - top;
  const perTick = (difference / duration) * 10;
  let newTop;
  setTimeout(() => {
    if (window.scrollY === undefined) {
      top = window.pageYOffset;
      newTop = top + perTick;
      document.documentElement.scrollTop = newTop;
    } else {
      top = window.scrollY;
      newTop = top + perTick;
      document.body.scrollTop = newTop;
    }
    console.log(newTop)
    if ((window.pageYOffset || window.scrollY) === to) return;
    scrollPageTo(to, duration - 10);
  }, 10);
}
//* ***************************
//* ***************************

export { scrollPageTo as default };
