let template = document.createElement("template");
template.innerHTML = `
<style>
*{
  color:red;
  font-size: 2rem;
}
// applies to the shadow root if "open" is passed as attribute
:host([open]) *{
  color: purple;
}
</style>
<h3>This is from the template and the below is added!</h3>
<!-- The slot is where the props.children is inserted, if not found then default this is -->
This <slot></slot> is from the tempalte
<p>
<!-- This is for named slots, not provided then default taken -->
<slot name="message">Default for message if nothing passed in from HTML</slot>
</p>
`;

class Tooltip extends HTMLElement {
  // Not attached to the DOM here
  constructor() {
    super();

    this.attachShadow({ mode: "open" });
    this.shadowRoot.appendChild(template.content.cloneNode(true));

    // this.shadowRoot.querySelector("h3").innerHTML = "Hello";
    // Get the attribute(s)
    const attr = this.constructor.ObservedAttributes[0];
    console.log(this.getAttribute(attr));
  }

  // Element is attached from the DOM here
  connectedCallback() {
    // get the props attached to the element with getAttribute()
    // console.log(this.getAttribute("helper"));
    // Listen to click on element
    this.shadowRoot.addEventListener("click", () => {
      alert("I got clicked");
    });
  }

  // Element is detached from the DOM here
  disconnectedCallback() {}

  // When attributes change
  attributeChangedCallback(name, oldValue, newValue) {
    console.log(name, oldValue, newValue);
  }

  // To get all attributes mentioned on the custom ele
  static get ObservedAttributes() {
    return ["helper"];
  }
}

// Name your custom element with `my-{customEleName}` format
customElements.define("my-tooltip", Tooltip);
