console.log("Loaded wrapper-e, dependency:", WrapperD);

__extends(WrapperE, HTMLElement);

function WrapperE () {
  return HTMLElement.apply(this, arguments) || this;
}

WrapperE.prototype.connectedCallback = function () {
  var elm = document.createElement("DIV");
  elm.innerHTML = "<wrapper-d></wrapper-d>";
  this.appendChild(elm);
}

customElements.define("wrapper-e", WrapperE);
