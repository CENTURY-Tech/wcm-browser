console.log("Loaded wrapper-c, dependency:", WrapperB);

__extends(WrapperC, HTMLElement);

function WrapperC () {
  return HTMLElement.apply(this, arguments) || this;
}

WrapperC.prototype.connectedCallback = function () {
  var elm = document.createElement("DIV");
  elm.innerHTML = "<wrapper-b></wrapper-b>";
  this.appendChild(elm);
}

customElements.define("wrapper-c", WrapperC);
