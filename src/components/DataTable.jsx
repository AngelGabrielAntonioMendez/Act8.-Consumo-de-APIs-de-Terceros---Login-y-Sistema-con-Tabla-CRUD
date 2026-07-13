import { useState, useEffect } from 'react';

export const DataTable = () => {
  const getParams = () => new URLSearchParams(window.location.search);
  const [page, setPage] = useState(Number(getParams().get('page')) || 1);
  const [limit, setLimit] = useState(Number(getParams().get('limit')) || 10);
  const [products, setProducts] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [categories, setCategories] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [formData, setFormData] = useState({ title: '', price: '', category: '' });

  useEffect(() => {
    const url = new URL(window.location);
    url.searchParams.set('page', page);
    url.searchParams.set('limit', limit);
    window.history.pushState({}, '', url);
  }, [page, limit]);

  useEffect(() => {
    fetch('https://dummyjson.com/products/categories')
      .then((res) => res.json())
      .then((data) => setCategories(data))
      .catch((fetchError) => console.error('Error cargando categorias:', fetchError));
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError('');

      const skip = (page - 1) * limit;
      let url = `https://dummyjson.com/products?limit=${limit}&skip=${skip}`;

      if (search) {
        url = `https://dummyjson.com/products/search?q=${search}&limit=${limit}&skip=${skip}`;
      } else if (category) {
        url = `https://dummyjson.com/products/category/${category}?limit=${limit}&skip=${skip}`;
      }

      try {
        const response = await fetch(url);
        if (!response.ok) throw new Error('Error al obtener los datos');
        const data = await response.json();
        setProducts(data.products);
        setTotal(data.total);
      } catch (fetchError) {
        setError(fetchError.message);
      } finally {
        setLoading(false);
      }
    };

    const timeoutId = setTimeout(() => {
      fetchData();
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [page, limit, search, category]);

  const handleDelete = async (id) => {
    if (!window.confirm('Estas seguro de eliminar este producto?')) return;

    try {
      await fetch(`https://dummyjson.com/products/${id}`, { method: 'DELETE' });
      setProducts(products.filter((product) => product.id !== id));
      setTotal(total - 1);
      alert('Registro eliminado exitosamente.');
    } catch {
      alert('Error al eliminar');
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!window.confirm(`Estas seguro de ${editingProduct ? 'editar' : 'agregar'} este registro?`)) return;

    try {
      if (editingProduct) {
        const res = await fetch(`https://dummyjson.com/products/${editingProduct.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData),
        });
        const updatedProduct = await res.json();

        setProducts(products.map((product) => (
          product.id === editingProduct.id ? { ...product, ...updatedProduct } : product
        )));
        alert('Registro actualizado.');
      } else {
        const res = await fetch('https://dummyjson.com/products/add', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData),
        });
        const newProduct = await res.json();

        newProduct.id = Date.now();

        setProducts([newProduct, ...products]);
        setTotal(total + 1);
        alert('Registro agregado.');
      }
      setIsModalOpen(false);
    } catch {
      alert('Error al guardar el registro');
    }
  };

  const openModal = (product = null) => {
    setEditingProduct(product);
    setFormData(
      product
        ? { title: product.title, price: product.price, category: product.category }
        : { title: '', price: '', category: '' }
    );
    setIsModalOpen(true);
  };

  const totalPages = Math.ceil(total / limit);

  return (
    <div className="table-module">
      <div className="table-header-actions">
        <div>
          <h3>Productos</h3>
          <p>Consulta, filtra y administra productos desde la API.</p>
        </div>

        <div className="filters">
          <input
            type="text"
            placeholder="Buscar producto..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setCategory('');
              setPage(1);
            }}
          />
          <select
            value={category}
            onChange={(e) => {
              setCategory(e.target.value);
              setSearch('');
              setPage(1);
            }}
          >
            <option value="">Todas las categorias</option>
            {categories.map((cat, idx) => (
              <option key={idx} value={cat.slug || cat}>{cat.name || cat}</option>
            ))}
          </select>
          <button onClick={() => openModal()} className="btn-primary small-button">Nuevo producto</button>
        </div>
      </div>

      {loading && <div className="loading-state">Cargando datos...</div>}
      {error && <div className="error-alert">{error}</div>}

      {!loading && !error && (
        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Producto</th>
                <th>Categoria</th>
                <th>Precio</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {products.length > 0 ? products.map((product) => (
                <tr key={product.id}>
                  <td>{product.id}</td>
                  <td>{product.title}</td>
                  <td className="capitalize">{product.category}</td>
                  <td>${product.price}</td>
                  <td className="table-actions">
                    <button onClick={() => openModal(product)} className="btn-edit">Editar</button>
                    <button onClick={() => handleDelete(product.id)} className="btn-delete">Eliminar</button>
                  </td>
                </tr>
              )) : (
                <tr><td colSpan="5" className="text-center">No se encontraron resultados.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      <div className="pagination">
        <div className="limit-selector">
          Mostrar:
          <select value={limit} onChange={(e) => {
            setLimit(Number(e.target.value));
            setPage(1);
          }}>
            <option value={10}>10</option>
            <option value={20}>20</option>
            <option value={40}>40</option>
            <option value={50}>50</option>
          </select>
        </div>
        <div className="page-controls">
          <button disabled={page === 1} onClick={() => setPage(page - 1)}>Anterior</button>
          <span>Pagina {page} de {totalPages || 1}</span>
          <button disabled={page >= totalPages} onClick={() => setPage(page + 1)}>Siguiente</button>
        </div>
      </div>

      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>{editingProduct ? 'Editar producto' : 'Nuevo producto'}</h2>
            <form onSubmit={handleSave} className="crud-form">
              <div className="form-group">
                <label>Nombre del producto</label>
                <input required type="text" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} />
              </div>
              <div className="form-group">
                <label>Precio ($)</label>
                <input required type="number" step="0.01" value={formData.price} onChange={(e) => setFormData({ ...formData, price: e.target.value })} />
              </div>
              <div className="form-group">
                <label>Categoria</label>
                <input required type="text" value={formData.category} onChange={(e) => setFormData({ ...formData, category: e.target.value })} />
              </div>
              <div className="modal-actions">
                <button type="button" onClick={() => setIsModalOpen(false)} className="btn-cancel">Cancelar</button>
                <button type="submit" className="btn-primary">Guardar</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
