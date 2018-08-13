console.log("Loaded wrapper-d, dependency:", WrapperC);

__extends(WrapperD, HTMLElement);

function WrapperD () {
  return HTMLElement.apply(this, arguments) || this;
}

WrapperD.prototype.connectedCallback = function () {
  var elm = document.createElement("DIV");
  elm.innerHTML = "<wrapper-c></wrapper-c>";
  this.appendChild(elm);
}

customElements.define("wrapper-d", WrapperD);
