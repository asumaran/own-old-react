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
  rootInstance = nextInstance;
}

function reconcile(parentDom, instance, element) {
  if (instance === null) {
    const newInstance = instantiate(element);
    parentDom.appendChild(newInstance.dom);
    return newInstance;
  } else if (element === null) {
    parentDom.removeChild(instance.dom);
  } else if (instance.element.type === element.type) {
    updateDomProperties(instance.dom, instance.element.props, element.props);
    instance.childInstances = reconcileChildren(instance, element);
    instance.element = element;
    return instance;
  } else {
    const newInstance = instantiate(element);
    parentDom.replaceChild(newInstance.dom, instance.dom);
    return newInstance;
  }
}

function reconcileChildren(instance, element) {
  dom = instance.dom;
  const childInstances = instance.childInstances;
  const nextChildElements = element.props.children || [];
  const newChildInstances = [];

  const count = Math.max(childInstances.length, nextChildElements.length);
  for (let i = 0; i < count; i++) {
    const childInstance = childInstances[i];
    const childElement = nextChildElements[i];
    const newChildInstance = reconcile(dom, childInstance, childElement);
    newChildInstances.push(newChildInstance);
  }

  return newChildInstances;
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
  prevOnlyProps.forEach((propName) => {
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
function tick(color) {
  const root = document.getElementById("root");
  const time = new Date().toISOString();
  const element = <h1 style={color}>{time}</h1>;
  render(element, root);
}

tick("color: red");

setInterval(() => {
  tick("color: blue");
}, 1000);
