// App.jsx
import React, { useState, useEffect } from 'react';
import { db } from './firebaseconfig.jsx';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc } from 'firebase/firestore';
import './App.css';

function Modal({ title, children, onClose }) {
  return (
    <div className="modal-overlay">
      <div className="modal">
        <h2 className="modal-title">{title}</h2>
        {children}
        <button className="btn modal-close" onClick={onClose}>Cerrar</button>
      </div>
    </div>
  );
}

function App() {
  const [items, setItems] = useState([]);
  const [newItem, setNewItem] = useState("");

  // Modales
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);

  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [itemToUpdate, setItemToUpdate] = useState(null);
  const [updatedName, setUpdatedName] = useState("");

  // Referencia a la colección "items"
  const itemsCollectionRef = collection(db, "items");

  // Crear un nuevo documento
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

  // Obtener todos los documentos
  const getItems = async () => {
    try {
      const data = await getDocs(itemsCollectionRef);
      setItems(data.docs.map(doc => ({ ...doc.data(), id: doc.id })));
    } catch (error) {
      console.error("Error al obtener items: ", error);
    }
  };

  // Actualizar
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

  // Eliminar
  const deleteItem = async (id) => {
    try {
      const itemDoc = doc(db, "items", id);
      await deleteDoc(itemDoc);
      getItems();
    } catch (error) {
      console.error("Error al eliminar item: ", error);
    }
  };

  // Modal de eliminación
  const handleDeleteClick = (item) => {
    setItemToDelete(item);
    setShowDeleteModal(true);
  };

  const confirmDelete = () => {
    if (itemToDelete) {
      deleteItem(itemToDelete.id);
      setShowDeleteModal(false);
      setItemToDelete(null);
    }
  };

  // Modal de actualización
  const handleUpdateClick = (item) => {
    setItemToUpdate(item);
    setUpdatedName(item.name);
    setShowUpdateModal(true);
  };

  const confirmUpdate = () => {
    if (itemToUpdate && updatedName.trim() !== "") {
      updateItem(itemToUpdate.id, updatedName);
      setShowUpdateModal(false);
      setItemToUpdate(null);
      setUpdatedName("");
    }
  };

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

      {/* Contenedor principal único */}
      <div className="app-container">
        <h1 className="app-title">✨DIARIO DE SUEÑOS✨</h1>
        
        {/* Input para crear nuevo item */}
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

        {/* Lista de items (todos en un solo contenedor) */}
        <ul className="item-list">
          {items.map(item => (
            <li key={item.id} className="item">
              <span className="item-name">{item.name}</span>
              <div className="button-group">
                <button
                  onClick={() => handleUpdateClick(item)}
                  className="btn update-btn"
                >
                  Actualizar
                </button>
                <button
                  onClick={() => handleDeleteClick(item)}
                  className="btn delete-btn"
                >
                  Eliminar
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>

      {/* Modal de eliminación */}
      {showDeleteModal && (
        <Modal title="Confirmar Eliminación" onClose={() => setShowDeleteModal(false)}>
          <p>
            ¿Estás seguro de eliminar el item: <strong>{itemToDelete?.name}</strong>?
          </p>
          <button className="btn delete-btn" onClick={confirmDelete}>Sí, eliminar</button>
        </Modal>
      )}

      {/* Modal de actualización */}
      {showUpdateModal && (
        <Modal title="Actualizar Item" onClose={() => setShowUpdateModal(false)}>
          <input
            type="text"
            value={updatedName}
            onChange={(e) => setUpdatedName(e.target.value)}
            className="input-field"
            style={{ marginBottom: '10px' }}
          />
          <button className="btn update-btn" onClick={confirmUpdate}>Guardar cambios</button>
        </Modal>
      )}
    </div>
  );
}

export default App;
