import { AppStore, Actions, miniFramework, render } from "./src/framework.js";
const ItemList = () => {
  const state = AppStore.getState();

  // Función para manejar el cambio del valor en el input
  const handleInputChange = event => {
    const newValue = event.target.value;
    AppStore.setState({
      newTask: newValue
    });
  };

  // Función para agregar el ítem a la lista
  const handleAddItem = () => {
    const newTask = state.newTask;
    if (newTask) {
      Actions.addItem(newTask);
      AppStore.setState({
        newTask: ""
      });
    }
  };
  return miniFramework.createElement("div", null, miniFramework.createElement("h1", null, "To-do List"), miniFramework.createElement("ul", null, ...state.items.map((item, index) => miniFramework.createElement("li", {
    key: index
  }, item))), miniFramework.createElement("input", {
    id: "newTaskInput",
    type: "text",
    placeholder: "Enter a new task",
    value: state.newTask || "",
    onChange: handleInputChange
  }), miniFramework.createElement("button", {
    onClick: handleAddItem
  }, "Add Item"));
};

// Función para renderizar la aplicación
const renderApp = () => {
  const container = document.getElementById("root");
  container.innerHTML = "";
  render(ItemList(), container);
};

// Suscribirse a los cambios de estado
AppStore.subscribe(renderApp);
renderApp();

// // Usando JSX para crear el árbol del DOM virtual
// const element = (
//   <h1>
//     Hello, <span>MiniFramework!</span>
//   </h1>
// );

// console.log(element);  // Verás la estructura del Virtual DOM en la consola

// // Renderizar el elemento en el contenedor
// const container = document.getElementById("root");
// render(element, container);
