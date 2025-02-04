import { Store, Dispatcher, miniFramework, render } from "../src/framework.js";

// --- Estado Inicial y Reducer ---
const initialState = {
  items: [],
  word:''
};

const todoReducer = (state, action) => {
  switch (action.type) {
    case "ADD_ITEM":
      return { ...state, items: [...state.items, action.payload] };
    case "DELETE_ITEM":
      return { ...state, items: [...state.items.filter((_, i) => i !== action.payload) ]}
    case "input":
      return { ...state, word: action.payload }
    default:
      return state;
  }
};

// --- Crear Store y Registrarlo en Dispatcher ---
const todoStore = new Store(initialState, todoReducer);
Dispatcher.register(todoStore);

// --- Componentes ---
const ItemList = () => {
  const state = todoStore.getState();

  const handleAddItem = () => {
    const inputElement = document.getElementById("taskInput");
    const newTask = inputElement.value.trim();

    if (newTask) {
      Dispatcher.dispatch({ type: "ADD_ITEM", payload: newTask });
      inputElement.value = ""; 
    }
  };

  const deleteItem = (index) => {
    Dispatcher.dispatch({ type: "DELETE_ITEM", payload: index})
  }

  const handleInput = (event) => {
    const word = event.target.value
    Dispatcher.dispatch({ type: "input", payload: word})
  }

  return miniFramework.createElement(
    "div",
    null,
    miniFramework.createElement("h1", null, "To-do List"),
    miniFramework.createElement("ul", null, ...state.items.map((item, index) =>
      miniFramework.createElement("li", { key: index }, item, 
      miniFramework.createElement("button", { onClick: () => deleteItem(index) }, "delete")
      ),
    )),
    miniFramework.createElement("div", 
      {className: "input-container" },
      miniFramework.createElement("input", {
        id: "taskInput",
        type: "text",
        placeholder: "Enter a new task",
      }),
      miniFramework.createElement("button", { onClick: handleAddItem }, "+")
    ),
    miniFramework.createElement('input', 
      {
        value: state.word,
        type: 'text',
        placeholder: 'texto live coding',
        oninput : () => handleInput(event)
      }
    ),
    miniFramework.createElement('h2', null, state.word )
  );
};

// --- Renderizar Aplicación ---
const renderApp = () => {
  const container = document.getElementById("root");
  container.innerHTML = "";
  render(ItemList(), container);
};

// Suscribirse al Store y Renderizar
todoStore.subscribe(renderApp);
renderApp();
