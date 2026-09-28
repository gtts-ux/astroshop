import React from 'react';

export default function SpaceObjectCard({ object, onEdit, onDelete }) {
  return (
    <div className="card">
      <div className="card-info">
        <h3>{object.name}</h3>
        <p>Typ: <strong>{object.type}</strong> | Min. sprzęt: <strong>{object.equipment}</strong></p>
        <p>Uchwycono na zdjęciu: {object.isPhotographed ? '📸 Tak' : '🔭 Jeszcze nie'}</p>
      </div>
      <div className="card-actions">
        <button onClick={() => onEdit(object)}>Edytuj</button>
        <button onClick={() => onDelete(object)} className="btn-danger">Usuń</button>
      </div>
    </div>
  );
}