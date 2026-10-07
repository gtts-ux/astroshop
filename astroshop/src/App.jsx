import { useState } from 'react';
import { initialObjects } from './data';
import Dialog from './components/Dialog';
import Pagination from './components/Pagination';
import SpaceObjectCard from './assets/SpaceObjCard';
import SpaceObjectForm from './assets/SpaceObjForm';
import './app.css';

const ITEMS_PER_PAGE = 5;

export default function App() {
  const [objects, setObjects] = useState(initialObjects);
  const [search, setSearch] = useState('');
  const [filterType, setFilterType] = useState('');
  const [sortBy, setSortBy] = useState('name_asc');
  const [currentPage, setCurrentPage] = useState(1);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingObject, setEditingObject] = useState(null);
  const [objectToDelete, setObjectToDelete] = useState(null);

  let shownObjects = objects.filter((object) => {
    return object.name.toLowerCase().includes(search.toLowerCase());
  });

  if (filterType !== '') {
    shownObjects = shownObjects.filter((object) => object.type === filterType);
  }

  shownObjects.sort((a, b) => a.name.localeCompare(b.name));
  if (sortBy === 'name_desc') {
    shownObjects.reverse();
  }

  const totalPages = Math.ceil(shownObjects.length / ITEMS_PER_PAGE);

  let page = currentPage;
  if (page > totalPages) {
    page = totalPages;
  }
  if (page < 1) {
    page = 1;
  }

  const start = (page - 1) * ITEMS_PER_PAGE;
  const pageObjects = shownObjects.slice(start, start + ITEMS_PER_PAGE);

  function openAdd() {
    setEditingObject(null);
    setIsFormOpen(true);
  }

  function openEdit(object) {
    setEditingObject(object);
    setIsFormOpen(true);
  }

  function handleSave(objectData) {
    if (objectData.id) {
      const updatedObjects = objects.map((object) => {
        if (object.id === objectData.id) {
          return objectData;
        }
        return object;
      });
      setObjects(updatedObjects);
    } else {
      setObjects([...objects, { ...objectData, id: Date.now() }]);
    }
    setIsFormOpen(false);
  }

  function confirmDelete() {
    setObjects(objects.filter((object) => object.id !== objectToDelete.id));
    setObjectToDelete(null);
  }

  function handleSearchChange(event) {
    setSearch(event.target.value);
    setCurrentPage(1);
  }

  function handleFilterChange(event) {
    setFilterType(event.target.value);
    setCurrentPage(1);
  }

  function handleSortChange(event) {
    setSortBy(event.target.value);
  }

  let formTitle = 'Dodaj obiekt';
  if (editingObject !== null) {
    formTitle = 'Edytuj obiekt';
  }

  let deleteName = '';
  if (objectToDelete !== null) {
    deleteName = objectToDelete.name;
  }

  return (
    <main className="container">
      <header>
        <h1>Obiekty kosmiczne</h1>
        <button onClick={openAdd} className="btn-primary">+ Dodaj obiekt</button>
      </header>

      <div className="controls">
        <input type="text" placeholder="Szukaj po nazwie" value={search} onChange={handleSearchChange} />

        <select value={filterType} onChange={handleFilterChange}>
          <option value="">Wszystkie typy</option>
          <option value="Planeta">Planeta</option>
          <option value="Galaktyka">Galaktyka</option>
          <option value="Księżyc">Księżyc</option>
          <option value="Mgławica">Mgławica</option>
          <option value="Gromada">Gromada</option>
        </select>

        <select value={sortBy} onChange={handleSortChange}>
          <option value="name_asc">Nazwa A-Z</option>
          <option value="name_desc">Nazwa Z-A</option>
        </select>
      </div>

      {pageObjects.length === 0 && (
        <div className="empty-message">Brak obiektów spełniających kryteria.</div>
      )}

      <div className="list">
        {pageObjects.map((object) => (
          <SpaceObjectCard
            key={object.id}
            object={object}
            onEdit={openEdit}
            onDelete={setObjectToDelete}
          />
        ))}
      </div>

      <Pagination currentPage={page} totalPages={totalPages} onPageChange={setCurrentPage} />

      <Dialog isOpen={isFormOpen} title={formTitle} onClose={() => setIsFormOpen(false)}>
        <SpaceObjectForm
          initialData={editingObject}
          onSubmit={handleSave}
          onCancel={() => setIsFormOpen(false)}
        />
      </Dialog>

      <Dialog isOpen={objectToDelete !== null} title="Usunąć obiekt?" onClose={() => setObjectToDelete(null)}>
        <p>Usuwasz: <strong>{deleteName}</strong>.</p>
        <div className="form-actions">
          <button onClick={confirmDelete} className="btn-danger">Usuń</button>
          <button onClick={() => setObjectToDelete(null)} className="btn-secondary">Anuluj</button>
        </div>
      </Dialog>
    </main>
  );
}