import { useSearchParams } from 'react-router-dom';

export default function Pagination({ page, pages }) {
  const [searchParams, setSearchParams] = useSearchParams();

  if (pages <= 1) return null;

  const goToPage = (p) => {
    const params = new URLSearchParams(searchParams);
    if (p > 1) {
      params.set('page', p);
    } else {
      params.delete('page');
    }
    setSearchParams(params);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const getPageNumbers = () => {
    const nums = [];
    const start = Math.max(1, page - 2);
    const end = Math.min(pages, page + 2);
    for (let i = start; i <= end; i++) nums.push(i);
    return nums;
  };

  return (
    <div className="flex items-center justify-center gap-2 mt-12">
      <button
        onClick={() => goToPage(page - 1)}
        disabled={page === 1}
        className="btn-glass text-sm disabled:opacity-30 disabled:cursor-not-allowed"
      >
        Previous
      </button>
      <div className="hidden sm:flex items-center gap-1">
        {getPageNumbers().map((p) => (
          <button
            key={p}
            onClick={() => goToPage(p)}
            className={`w-10 h-10 rounded-full text-sm font-medium transition-all ${
              p === page
                ? 'bg-[var(--color-accent)] text-white shadow-sm'
                : 'bg-[var(--color-bg)] border border-[var(--color-border)] hover:bg-[var(--color-card)] text-[var(--color-text-secondary)]'
            }`}
          >
            {p}
          </button>
        ))}
      </div>
      <span className="sm:hidden text-sm text-[var(--color-text-secondary)]">Page {page} of {pages}</span>
      <button
        onClick={() => goToPage(page + 1)}
        disabled={page === pages}
        className="btn-glass text-sm disabled:opacity-30 disabled:cursor-not-allowed"
      >
        Next
      </button>
    </div>
  );
}
