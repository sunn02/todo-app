// --- Store ---
export const AppStore = {
    state: {
      items: []
    },
    listeners: [],
    getState() {
      return this.state;
    },
    subscribe(listener) {
      this.listeners.push(listener);
    },
    setState(newState) {
      this.state = { ...this.state, ...newState };
      this.listeners.forEach(listener => listener());
    }
  };
  
  // --- Actions ---
  export const Actions = {
    addItem(item) {
      const currentState = AppStore.getState();
      AppStore.setState({ items: [...currentState.items, item] });
    }
  };

  export const dispatch = (action) => {
    const currentState = AppStore.getState();
    switch (action.type) {
      case "ADD_ITEM":
        AppStore.setState({ items: [...currentState.items, action.payload] });
        break;
      default:
        console.warn("Unknown action:", action);
    }
  };
  

export const miniFramework = {
    createElement(type, props, ...children) {
      return {
        type,
        props: {
          ...props,
          children: children.length ? children : []
        }
      };
    }
  };
  

  export const render = (frameworkEl, container) => {
    if (!container) return;
    diff(container._virtualDOM, frameworkEl, container);
    container._virtualDOM = frameworkEl; // Store the new virtual DOM for diffing later
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
          const event = prop.substring(2).toLowerCase();
          domElement.addEventListener(event, node.props[prop]);
        } else {
          domElement[prop] = node.props[prop];
        }
      });
  
    node.props.children.forEach((child) => {
      domElement.appendChild(createRealDOM(child));
    });
  
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



