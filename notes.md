#### Vanilla Web Components

We can write custom HTML elements with this tech.

BTS these help to achieve this:
1. Register your own HTML elements
2. Shadow DOM to encapsulate your CSS
3. Template and slots to insert dynamic content

A basic example to get started, this gets your started off with a shadow DOM and attaches a template to it.
```js
let template = document.createElement("template");
template.innerHTML = `
<style>
	// All your styles for this compo can go here
</style>
// ALl HTML goes here
`;

class Tooltip extends HTMLElement {
	constructor() {
		super();
		this.attachShadow({ mode: "open" });
		this.shadowRoot.
			appendChild(template.content.cloneNode(true));
	}
}

// Name your elements this way
customElements.define("my-tooltip", Tooltip);
```

`this.attachShadow({ mode: open })` makes it attach a shadow DOM here that is responsible for all this magic. This also returns a shadowRoot to which stuff can be added in.

Then you append stuff to the `shadowRoot` to get stuff into the shadow DOM

We can also extend built in components too like `a` tag etc. Use `HTMLAnchorElement` instead of the normal `HTMLElement`

Now you can use `my-tooltip` in your HTML as a normal tag.

---
#### Lifecycle of a web component

1. `Constructor()` -> Run when the component sets up, include attaching of shadow DOM, creating events here etc.
2. `connectedCallback()` -> Run when the element is attached to the DOM
3. `disconnectedCallback()` -> Run when the element gets detached from the DOM
4. `attributesChangedCallback(name, oldValue, newValue)` -> Run when the attributes passed to the element get changed. Calls `static get ObservedAttributes()` internally.

---
#### Template and Slots

We can add stuff inside the components dynamically and expect them to show up or have placeholders if they are not provided like `prop.children` in react land.

```js
// web component file
let template = document.createElement("template");
template.innerHTMl = `
<h1> hello, this is there by deafult </h1>
<p> And this is stuff 
// => 1
<slot></slot>
passed inside it from the component </p>
// => 2
<slot name="message"> This is fallback for
message slot </slot>
`;

// HTML file
<my-tooltip>
<h2> Hello from the HTML </h2> // => 1
<p slot="message">This will override the message in slot</p>
</my-tooltip> // => 2
```

We can define a template with default and named slots as show above.

The slot at `=> 1` will be treated as the default one and anything inside our custom component will be written here. If nothing is passed in our custom component then the default value is used.

While the named slot `=> 2` takes a name and the corresponding same name can be used there to insert stuff there.

---
#### Events

Listen to button click by listening to events on the `shadowRoot` as the elements inside the shadow root cannot be accessed outside.

Say we have  a custom `my-modal` component

```js
class Modal extends HTMLElement {
	constructor() {
		super();
		this.attachShadow({ mode: "open" });
		// modalTemplate has all the necessary code 
		this.shadowRoot.
			appendChild(modalTemplate.content.cloneNode(true));
		}
		
		// open fn to open the modal
		// close fn to close the modal
		// open close handled with CSS
		
	connectedCallback() {
		const confirmBtn = this.shadowRoot.
							querySelectorAll("button")[0];
		confirmBtn.addEventListener("click", () => {
			console.log("Confirm clicked! Closing Modal");
			this.close("confirm");
			});
		}
	}
customElements.define("my-modal", Modal);
```

We can have events attached to the elements inside the `connectedCallback` as that's where it would be available for use.

Now how to send events back to the real DOM? We need to create events in the `constructor` and emit them when required.

```js
constructor(){
this.confirmEvent = new CustomEvent("confirm", {
	bubbles: true,
	composed: true,
	});
}
```

`bubbles`, `composed` makes sure the events bubbles up normally and it crosses the shadow DOM into the real DOM too.

Emit the events like this.
```js
this.dispatchEvent(this.confirmEvent);
```

Listen to these events in your HTML file where you used these web components
```js
const modal = document.getElementsByTagName("my-modal");

modal.addEventListener("confirm", () => {
	console.log("modal returned confirm");
});
```

---
