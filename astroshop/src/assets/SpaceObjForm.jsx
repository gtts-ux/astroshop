import { useEffect, useState } from 'react';

const emptyObject = { name: '', type: 'Planeta', equipment: 'Teleskop', isPhotographed: false };

export default function SpaceObjectForm({ initialData, onSubmit, onCancel }) {
  const [form, setForm] = useState(initialData || emptyObject);
  const [error, setError] = useState('');

  useEffect(() => setForm(initialData || emptyObject), [initialData]);

  const change = event => {
    const { name, value, type, checked } = event.target;
    setForm({ ...form, [name]: type === 'checkbox' ? checked : value });
  };

  const submit = event => {
    event.preventDefault();
    if (!form.name.trim()) {
      setError('Nazwa jest wymagana.');
      return;
    }
    onSubmit({ ...form, name: form.name.trim() });
  };

  return (
    <form onSubmit={submit}>
      <label className="form-group">Nazwa
        <input name="name" value={form.name} onChange={change} placeholder="np. Jowisz" />
      </label>
      {error && <p className="error">{error}</p>}
      <label className="form-group">Typ
        <select name="type" value={form.type} onChange={change}>
          <option>Planeta</option><option>Galaktyka</option><option>Księżyc</option><option>Mgławica</option><option>Gromada</option>
        </select>
      </label>
      <fieldset className="form-group"><legend>Sprzęt</legend>
        {['Gołe oko', 'Lornetka', 'Teleskop'].map(option => <label className="radio-label" key={option}><input type="radio" name="equipment" value={option} checked={form.equipment === option} onChange={change} />{option}</label>)}
      </fieldset>
      <label className="check-label"><input type="checkbox" name="isPhotographed" checked={form.isPhotographed} onChange={change} /> Mam zdjęcie obiektu</label>
      <div className="form-actions"><button type="button" className="btn-secondary" onClick={onCancel}>Anuluj</button><button className="btn-primary">Zapisz</button></div>
    </form>
  );
}
