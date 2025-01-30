// --- Store ---
export class Store {
  constructor(initialState, reducer) {
    this.state = initialState;
    this.reducer = reducer;
    this.listeners = [];
  }

  getState() {
    return this.state;
  }

  subscribe(listener) {
    this.listeners.push(listener);
  }

  dispatch(action) {
    this.state = this.reducer(this.state, action);
    this.listeners.forEach(listener => listener());
  }
}

// --- Dispatcher ---
export const Dispatcher = {
  stores: [],
  
  register(store) {
    this.stores.push(store);
  },

  dispatch(action) {
    this.stores.forEach(store => store.dispatch(action));
  }
};

// --- Mini Framework (UI Rendering) ---
export const miniFramework = {
  createElement(type, props, ...children) {
    return {
      type,
      props: { ...props, children }
    };
  }
};

export const render = (frameworkEl, container) => {
  if (!container) return;
  diff(container._virtualDOM, frameworkEl, container);
  container._virtualDOM = frameworkEl;
};

function createRealDOM(node) {
  if (typeof node === 'string' || typeof node === 'number') {
    return document.createTextNode(node);
  }

  const domElement = document.createElement(node.type);

  Object.keys(node.props)
    .filter((key) => key !== 'children')
    .forEach((prop) => {
      if (prop.startsWith('on')) {
        domElement.addEventListener(prop.substring(2).toLowerCase(), node.props[prop]);
      } else {
        domElement[prop] = node.props[prop];
      }
    });

  node.props.children.forEach(child => domElement.appendChild(createRealDOM(child)));
  return domElement;
}

function diff(oldNode, newNode, container) {
  if (!oldNode && newNode) {
    container.appendChild(createRealDOM(newNode));
    return;
  }

  if (!newNode) {
    container.removeChild(oldNode);
    return;
  }

  if (typeof oldNode !== typeof newNode || oldNode.type !== newNode.type) {
    container.replaceChild(createRealDOM(newNode), oldNode);
    return;
  }

  if (typeof newNode === 'string' || typeof newNode === 'number') {
    if (oldNode.nodeValue !== newNode) {
      oldNode.nodeValue = newNode;
    }
    return;
  }

  const oldChildren = oldNode.childNodes || [];
  const newChildren = newNode.props.children || [];

  newChildren.forEach((child, i) => {
    if (oldChildren[i]) {
      diff(oldChildren[i], child, oldNode);
    } else {
      container.appendChild(createRealDOM(child));
    }
  });
}
