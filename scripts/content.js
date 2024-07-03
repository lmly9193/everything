document.addEventListener(
  "mousedown",
  function (event) {
    if (window.getSelection().toString().length > 0) {
      const button = document.querySelector("#everything-search");
      if (button && event.target === button) {
        event.preventDefault();
      }
    }
  },
  false
);

document.addEventListener("mouseup", function (event) {
  const delay = 10;
  const offsetX = 16;
  const offsetY = 23;
  setTimeout(function () {
    const gtx = document.querySelector("#gtx-trans");
    if (window.getSelection().toString().length > 0) {
      const button = document.querySelector("#everything-search");
      if (!button) {
        const range = window
          .getSelection()
          .getRangeAt(0)
          .getBoundingClientRect();
        const el = $el("div", {
          id: "everything-search",
          style: `left: ${event.clientX + offsetX}px; top: ${
            range.top + window.scrollY + offsetY
          }px;`,
        });
        if (gtx) {
          el.style.left = gtx.style.left + offsetX;
          el.style.top = gtx.style.top;
        }
        document.body.appendChild(el);
      }
    }
  }, delay);
});

document.addEventListener("selectionchange", function () {
  if (window.getSelection().toString().trim() === "") {
    const button = document.getElementById("everything-search");
    if (button) button.remove();
  }
});

document.addEventListener("click", function (event) {
  const button = document.querySelector("#everything-search");
  if (button && event.target === button) {
    const query = encodeURIComponent(window.getSelection().toString());
    chrome.runtime.sendMessage(
      { action: "processQuery", query: query },
      function (response) {
        if (response && response.result) {
            console.info(`Everything Search: ${response.result}`);
        }
      }
    );
  }
});

function $el(tag, props) {
  return Object.assign(document.createElement(tag), props);
}
