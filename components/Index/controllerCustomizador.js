// $(".button-collapse").sideNav({ edge: 'right' });
// $(".icon-menu").sideNav({ edge: 'left' });

menutelas.addEventListener("click", controlWidthView, false);

if ($("#navGears")[0]) {
  $("#navGears")[0].addEventListener("click", controlWidthView, false);
  $("#navGears")[0].addEventListener("click", function (e) {
    $(".nav-settings")[0].classList.toggle("active");
  }, false);
}

function controlWidthView(e, elm) {
  // Encontrar o elemento
  if (elm) elm = elm;
  else {
    elm = event.target
    if (event.target.tagName == "I") elm = elm.parentElement;
  }

  elm.classList.toggle("menu-ativo");

  if (elm.id == "navGears") {
    if (elm.classList.contains("menu-ativo")) {
      if ($('#menutelas')[0].classList.contains("menu-ativo")) $('#view')[0].style.width = "50%";
      else $('#view')[0].style.width = "63.2%";
    }
    else {
      if ($('#menutelas')[0].classList.contains("menu-ativo")) $('#view')[0].style.width = "83.2%";
      else $('#view')[0].style.width = "96.2%";
    }
  }
  else {
    if (elm.classList.contains("menu-ativo")) {
      if (!$('#navGears')[0]) $('#view')[0].style.width = "83.2%";
      else {
        if ($('#navGears')[0].classList.contains("menu-ativo")) $('#view')[0].style.width = "50%";
        else $('#view')[0].style.width = "83.2%";
      }
    }
    else {
      if (!$('#navGears')[0]) $('#view')[0].style.width = "96.2%";
      else {
        if ($('#navGears')[0].classList.contains("menu-ativo")) $('#view')[0].style.width = "63.2%";
        else $('#view')[0].style.width = "96.2%";
      }
    }
  }
  // }
};