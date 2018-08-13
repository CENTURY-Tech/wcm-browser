console.log("Loaded wrapper-a");

__extends(WrapperA, HTMLElement);

function WrapperA () {
  return HTMLElement.apply(this, arguments) || this;
}

WrapperA.prototype.connectedCallback = function () {
  var elm = document.createElement("DIV");
  elm.innerHTML = "<test-component msg='Done'></test-component>";
  this.appendChild(elm);
}

customElements.define("wrapper-a", WrapperA);
