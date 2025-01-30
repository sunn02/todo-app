

# 🎯 Todo App

Este es un ejemplo de aplicación de lista de tareas (To-Do) utilizando un **framework simple** que implementa los principios de arquitectura **FLUX** y un **Virtual DOM** para gestionar el estado y renderizar la interfaz de usuario.

## 🌟 **Características**

- Añadir tareas a la lista.
- Mostrar tareas guardadas en la lista.
- Mantener el estado de las tareas utilizando el patrón **FLUX**.
- Utilizar un **Virtual DOM** para una renderización eficiente de la interfaz.

## 🛠️ **Estructura del Proyecto**

1. **Store**: Contiene el estado de la aplicación y maneja las actualizaciones a través de un `reducer`.
2. **Dispatcher**: Envía las acciones a los **Stores** registrados.
3. **miniFramework**: Un sistema simple para crear elementos y renderizar la interfaz de usuario.

## 🚀 **Guía Rápida: Cómo Usar Todo App**

### **1. Crear un Store**

El `Store` mantiene el estado de la aplicación. En este caso, contiene una lista de tareas.

```js
const initialState = {
  items: [],
};

const todoReducer = (state, action) => {
  switch (action.type) {
    case "ADD_ITEM":
      return { ...state, items: [...state.items, action.payload] };
    default:
      return state;
  }
};

const todoStore = new Store(initialState, todoReducer);
```

### **2. Registrar el Store en el Dispatcher**

Para que el **Dispatcher** pueda enviar las acciones al `Store`, lo registramos así:

```js
Dispatcher.register(todoStore);
```

### **3. Crear un Componente**

Usamos `miniFramework.createElement` para crear un componente que renderiza una lista de tareas.

```js
const ItemList = () => {
  const state = todoStore.getState();
  return miniFramework.createElement(
    "ul",
    null,
    ...state.items.map(item =>
      miniFramework.createElement("li", null, item)
    )
  );
};
```

### **4. Agregar Tareas**

Para agregar una tarea, utilizamos el método `dispatch` del `Dispatcher` con una acción.

```js
const addItem = (item) => {
  Dispatcher.dispatch({ type: "ADD_ITEM", payload: item });
};
```

### **5. Renderizar la Aplicación**

Finalmente, renderizamos el componente `TodoList` en el contenedor de la interfaz de usuario:

```js
const renderApp = () => {
  const container = document.getElementById("root");
  container.innerHTML = "";
  render(TodoList(), container);
};

todoStore.subscribe(renderApp);
renderApp();
```
