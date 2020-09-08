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

let rootInstance = null;

function render(element, container) {
  prevInstance = rootInstance;
  const nextInstance = reconcile(container, prevInstance, element);
  console.log(nextInstance);
  rootInstance = nextInstance;
}

function reconcile(parentDom, instance, element) {
  const newInstance = instantiate(element);
  parentDom.appendChild(newInstance.dom);
  return newInstance;
}

function instantiate(element) {
  const { type, props } = element;

  let dom;
  if (type === TEXT_ELEMENT) {
    dom = document.createTextNode("");
  } else {
    dom = document.createElement(type);
  }

  updateDomProperties(dom, {}, props);

  const childElements = props.children || [];
  const childInstances = childElements.map(instantiate);

  childInstances.forEach((instance) => {
    dom.appendChild(instance.dom);
  });

  return {
    element,
    dom,
    childInstances,
  };
}

function updateDomProperties(dom, prevProps, nextProps) {
  Object.keys(prevProps);
  // Remove properties
  const prevOnlyProps = Object.keys(prevProps).filter(isRegularProp);
  prevOnlyProps.forEach(() => {
    dom[propName] = null;
  });

  // Remove event listeners
  const prevEventListeners = Object.keys(prevProps).filter(
    propsIsEventListener
  );
  prevEventListeners.forEach((eventName) => {
    const eventType = eventName.toLowerCase().substring(2);
    dom.removeEventListener(eventType, prevProps[name]);
  });

  // Set properties
  const onlyProps = Object.keys(nextProps).filter(isRegularProp);
  onlyProps.forEach((propName) => {
    dom[propName] = nextProps[propName];
  });

  // Set event listeners
  const eventListeners = Object.keys(nextProps).filter(propsIsEventListener);
  eventListeners.forEach((eventName) => {
    const eventType = eventName.toLowerCase().substring(2);
    dom.addEventListener(eventType, nextProps[eventName]);
  });
}

// App
function tick() {
  const root = document.getElementById("root");
  const time = new Date().toISOString();
  const element = (
    <span onClick={() => console.log("clicked!")}>Hola mundo</span>
  );
  render(element, root);
}

tick();

setTimeout(() => {
  tick();
}, 1000);
