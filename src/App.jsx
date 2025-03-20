// App.jsx
import React, { useState, useEffect } from 'react';
import { db } from './firebaseconfig.jsx';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc } from 'firebase/firestore';
import './App.css';

function App() {
  const [items, setItems] = useState([]);
  const [newItem, setNewItem] = useState("");

  // Referencia a la colección "items"
  const itemsCollectionRef = collection(db, "items");

  // Función para crear un nuevo documento
  const createItem = async () => {
    if (newItem.trim() === "") return;
    try {
      await addDoc(itemsCollectionRef, { name: newItem });
      setNewItem("");
      getItems();
    } catch (error) {
      console.error("Error al crear item: ", error);
    }
  };

  // Función para obtener todos los documentos de la colección
  const getItems = async () => {
    try {
      const data = await getDocs(itemsCollectionRef);
      setItems(data.docs.map(doc => ({ ...doc.data(), id: doc.id })));
    } catch (error) {
      console.error("Error al obtener items: ", error);
    }
  };

  // Función para actualizar un documento específico
  const updateItem = async (id, newName) => {
    if (!newName || newName.trim() === "") return;
    try {
      const itemDoc = doc(db, "items", id);
      await updateDoc(itemDoc, { name: newName });
      getItems();
    } catch (error) {
      console.error("Error al actualizar item: ", error);
    }
  };

  // Función para eliminar un documento
  const deleteItem = async (id) => {
    try {
      const itemDoc = doc(db, "items", id);
      await deleteDoc(itemDoc);
      getItems();
    } catch (error) {
      console.error("Error al eliminar item: ", error);
    }
  };

  // Se ejecuta una vez al cargar el componente para obtener los items existentes
  useEffect(() => {
    getItems();
  }, []);

  return (
    <div className="background-wrapper">
      <div className="floating-objects">
        <div className="flying-object"></div>
        <div className="flying-object"></div>
        <div className="flying-object"></div>
        <div className="flying-object"></div>
        <div className="flying-object"></div>
      </div>
      <div className="app-container">
        <h1 className="app-title">CRUD con Firestore</h1>
        <div className="input-group">
          <input 
            type="text"
            value={newItem}
            onChange={(e) => setNewItem(e.target.value)}
            placeholder="Nuevo item"
            className="input-field"
          />
          <button onClick={createItem} className="btn add-btn">Agregar</button>
        </div>
        <ul className="item-list">
          {items.map(item => (
            <li key={item.id} className="item">
              <span className="item-name">{item.name}</span>
              <div className="button-group">
                <button 
                  onClick={() => {
                    const newName = prompt("Ingresa el nuevo nombre:", item.name);
                    if (newName) updateItem(item.id, newName);
                  }}
                  className="btn update-btn"
                >
                  Actualizar
                </button>
                <button onClick={() => deleteItem(item.id)} className="btn delete-btn">
                  Eliminar
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default App;
