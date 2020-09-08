/** @jsx createElement */

function propsIsEventListener(propName) {
  return propName.startsWith("on");
}

function isRegularProp(propName) {
  return propName !== "children" && !propsIsEventListener(propName);
}

// Our Own React Implementation
const TEXT_ELEMENT = "TEXT ELEMENT";

function createElement(type, props, ...children) {
  return {
    type: type,
    props: {
      ...props,
      children: children.map((children) => {
        if (typeof children === "string") {
          return createTextElement(children);
        } else {
          return children;
        }
      }),
    },
  };
}

function createTextElement(value) {
  return {
    type: TEXT_ELEMENT,
    props: {
      nodeValue: value,
    },
  };
}

function render(element, parentDom) {
  const { type, props } = element;

  let dom;

  if (type === "TEXT ELEMENT") {
    dom = document.createTextNode("");
  } else {
    dom = document.createElement(type);
  }

  // Set event listeners
  const eventListeners = Object.keys(props).filter(propsIsEventListener);
  eventListeners.forEach((eventName) => {
    const eventType = eventName.toLowerCase().substring(2);
    dom.addEventListener(eventType, props[eventName]);
  });

  // Set properties
  const onlyProps = Object.keys(props).filter(isRegularProp);
  onlyProps.forEach((propName) => {
    dom[propName] = props[propName];
  });

  // Render children
  (props.children || []).forEach((element) => {
    render(element, dom);
  });

  parentDom.appendChild(dom);
}

// App
const root = document.getElementById("root");
const element = (
  <span onClick={() => console.log("Text clicked!")}>Hola mundo!</span>
);

render(element, root);
