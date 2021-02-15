const scrollDown = document.getElementById("scroll-down");

addEventListener("scroll", () => {
  if (scrollY <= 0) scrollDown.style.display = "initial";
  else scrollDown.style.display = "none";
});
