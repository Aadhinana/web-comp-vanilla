let modalTemplate = document.createElement("template");
modalTemplate.innerHTML = `
<style>
        #backdrop{
            position: fixed;
            top:0;
            left:0;
            width: 100%;
            height: 100vh;
            background: rgba(0,0,0,0.5);
            z-index: 90;
            opacity: 0;
            pointer-events: none;
        }
        #modal {
            position: absolute;
            background: white;
            padding: 0.25rem;
            top: 15vh;
            left: 25%;
            width: 50%;
            border-radius: 10px;
            box-shadow: 0 2px 5px #333;
            z-index: 100;
            display: flex;
            flex-direction: column;
            justify-content: space-around;
            opacity: 0;
            pointer-events: none;
          }
          :host([opened]) #backdrop,
          :host([opened]) #modal{
              opacity: 1;
              pointer-events: all;
          }
          #content{
              font-size: 1.25rem;
              margin-bottom: 0.25rem
          }
          #actions{
              border-top: 1px solid grey;
              padding: 1rem;
              display: flex;
              justify-content:flex-end;
          }
          #actions button{
              margin: 0 0.25rem 0;
              padding: 0.25rem;
              background: white;
              color:black;
              cursor: pointer;
          }
    </style>
    <div id="backdrop"></div>
    <div id="modal">
          <slot name="header">
            <h1>This is the modal header</h1>
          </slot>
          <section id="content">
            <slot>Default slot goes here</slot>
          </section>
          <section id="actions">
            <button id="confirm">Confirm</button>
            <button id="cancel">Cancel</button>
          </section>
    </div>
`;
class Modal extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this.shadowRoot.appendChild(modalTemplate.content.cloneNode(true));

    this.confirmEvent = new CustomEvent("confirm", {
      bubbles: true,
      composed: true,
    });
    this.cancelEvent = new CustomEvent("cancel", {
      bubbles: true,
      composed: true,
    });
  }

  // To open and close the modal
  open() {
    this.setAttribute("opened", "");
  }

  close(status) {
    this.removeAttribute("opened");
    if (status === "confirm") {
      this.dispatchEvent(this.confirmEvent);
    } else {
      this.dispatchEvent(this.cancelEvent);
    }
  }

  connectedCallback() {
    const confirmBtn = this.shadowRoot.querySelectorAll("button")[0];
    const cancelBtn = this.shadowRoot.querySelectorAll("button")[1];
    
    const backdrop = this.shadowRoot.querySelector("#backdrop");

    cancelBtn.addEventListener("click", () => {
      console.log("Cancel clicked! Closing Modal");
      this.close("cancel");
    });
    backdrop.addEventListener("click", () => {
      console.log("Backdrop clicked! Closing Modal");
      this.close("cancel");
    });
    confirmBtn.addEventListener("click", () => {
      console.log("Confirm clicked! Closing Modal");
      this.close("confirm");
    });
  }
}

customElements.define("my-modal", Modal);
