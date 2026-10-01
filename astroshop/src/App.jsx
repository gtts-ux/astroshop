import { useEffect, useMemo, useState } from 'react';
import { initialObjects } from './data';
import Dialog from './components/Dialog';
import Pagination from './components/Pagination';
import SpaceObjectCard from './assets/SpaceObjCard';
import SpaceObjectForm from './assets/SpaceObjForm';
import './app.css';

export default function App() {
  const [objects, setObjects] = useState(initialObjects);
  const [search, setSearch] = useState('');
  const [filterType, setFilterType] = useState('');
  const [sortBy, setSortBy] = useState('name_asc');
  const [currentPage, setCurrentPage] = useState(1);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [editingObject, setEditingObject] = useState(null);
  const [objectToDelete, setObjectToDelete] = useState(null);

  const ITEMS_PER_PAGE = 5;

  const processedObjects = useMemo(() => {
    let result = objects.filter(object => object.name.toLowerCase().includes(search.toLowerCase()));
    if (filterType) result = result.filter(object => object.type === filterType);
    result.sort((a, b) => {
      const direction = sortBy === 'name_asc' ? 1 : -1;
      return direction * a.name.localeCompare(b.name);
    });
    return result;
  }, [objects, search, filterType, sortBy]);

  const totalPages = Math.ceil(processedObjects.length / ITEMS_PER_PAGE);
  useEffect(() => {
    if (totalPages === 0) setCurrentPage(1);
    else if (currentPage > totalPages) setCurrentPage(totalPages);
  }, [currentPage, totalPages]);
  const paginatedObjects = processedObjects.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handleSave = (objectData) => {
    if (objectData.id) {
      setObjects(objects.map(object => object.id === objectData.id ? objectData : object));
    } else {
      setObjects([...objects, { ...objectData, id: Date.now() }]);
    }
    setIsFormOpen(false);
  };

  const confirmDelete = () => {
    setObjects(objects.filter(object => object.id !== objectToDelete.id));
    setIsDeleteOpen(false);
    setObjectToDelete(null);
  };

  const openEdit = (object) => {
    setEditingObject(object);
    setIsFormOpen(true);
  };

  const openAdd = () => {
    setEditingObject(null);
    setIsFormOpen(true);
  };

  const resetPage = setter => event => { setter(event.target.value); setCurrentPage(1); };

  return (
    <main className="container">
      <header>
        <div><h1>Obiekty kosmiczne</h1></div>
        <button onClick={openAdd} className="btn-primary">+ Dodaj obiekt</button>
      </header>

      <div className="controls">
        <input type="text" placeholder="Szukaj po nazwie" value={search} onChange={resetPage(setSearch)} />
        <select value={filterType} onChange={resetPage(setFilterType)}>
          <option value="">Wszystkie typy</option>
          <option>Planeta</option><option>Galaktyka</option><option>Księżyc</option><option>Mgławica</option><option>Gromada</option>
        </select>
        <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
          <option value="name_asc">Nazwa A-Z</option>
          <option value="name_desc">Nazwa Z-A</option>
        </select>
      </div>

      {paginatedObjects.length > 0 ? (
        <div className="list">
          {paginatedObjects.map(object => <SpaceObjectCard key={object.id} object={object} onEdit={openEdit} onDelete={objectToRemove => { setObjectToDelete(objectToRemove); setIsDeleteOpen(true); }} />)}
        </div>
      ) : (
        <div className="empty-message">Brak obiektów spełniających kryteria.</div>
      )}

      <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />

      <Dialog isOpen={isFormOpen} title={editingObject ? 'Edytuj obiekt' : 'Dodaj obiekt'} onClose={() => setIsFormOpen(false)}>
        <SpaceObjectForm initialData={editingObject} onSubmit={handleSave} onCancel={() => setIsFormOpen(false)} />
      </Dialog>

      <Dialog isOpen={isDeleteOpen} title="Usunąć obiekt?" onClose={() => setIsDeleteOpen(false)}>
        <p>Usuwasz: <strong>{objectToDelete?.name}</strong>.</p>
        <div className="form-actions"><button onClick={confirmDelete} className="btn-danger">Usuń</button><button onClick={() => setIsDeleteOpen(false)} className="btn-secondary">Anuluj</button></div>
      </Dialog>
    </main>
  );
}