export default function Pagination({ currentPage, totalPages, onPageChange }) {
  if (totalPages < 2) return null;

  return (
    <nav className="pagination" aria-label="Paginacja">
      <button onClick={() => onPageChange(currentPage - 1)} disabled={currentPage === 1}>Poprzednia</button>
      <span>Strona {currentPage} z {totalPages}</span>
      <button onClick={() => onPageChange(currentPage + 1)} disabled={currentPage === totalPages}>Następna</button>
    </nav>
  );
}
