console.log("Loaded wrapper-b, dependency:", WrapperA);

__extends(WrapperB, HTMLElement);

function WrapperB () {
  return HTMLElement.apply(this, arguments) || this;
}

WrapperB.prototype.connectedCallback = function () {
  var elm = document.createElement("DIV");
  elm.innerHTML = "<wrapper-a></wrapper-a>";
  this.appendChild(elm);
}

customElements.define("wrapper-b", WrapperB);
