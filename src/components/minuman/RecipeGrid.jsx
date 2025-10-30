// src/components/minuman/RecipeGrid.jsx
import { Clock, Star, ChefHat } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import { useFavorites } from '../../context/FavoritesContext';

// PERUBAHAN 1: Terima prop 'onRecipeClick'
export default function RecipeGrid({ recipes, onRecipeClick }) {
  const [visibleCards, setVisibleCards] = useState(new Set());
  const cardRefs = useRef([]);
  const { addFavorite, removeFavorite, isFavorite } = useFavorites();

  // 🔹 PAGINATION (TAMBAHAN)
  const PAGE_SIZE = 6;
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.max(1, Math.ceil(recipes.length / PAGE_SIZE));
  const startIdx = (currentPage - 1) * PAGE_SIZE;
  const endIdx = startIdx + PAGE_SIZE;
  const pagedRecipes = recipes.slice(startIdx, endIdx);

  useEffect(() => { setCurrentPage(1); }, [recipes]);

  

  useEffect(() => {
    cardRefs.current = cardRefs.current.slice(0, pagedRecipes.length);
    
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const index = parseInt(entry.target.dataset.index);
          setTimeout(() => {
            setVisibleCards(prev => new Set(prev).add(index));
          }, (index % 3) * 150); 
        }
      });
    }, { threshold: 0.1 });

    cardRefs.current.forEach((ref, index) => {
      if (ref) {
        ref.dataset.index = index;
        observer.observe(ref);
      }
    });

    return () => observer.disconnect();
  }, [pagedRecipes, currentPage]);

  const gotoPage = (p) => setCurrentPage(Math.min(Math.max(1, p), totalPages));

  return (
    <section>
      <h1 className="text-3xl md:text-5xl font-bold text-slate-800 text-center mb-4">
        Jelajahi Resep Minuman
      </h1>
      <p className="text-center text-slate-500 max-w-2xl mx-auto mb-8">
        Temukan minuman segar, hangat, dan kekinian. Mulai dari kopi hingga jus buah, semua ada di sini.
      </p>

      <div className="flex items-center justify-between text-xs md:text-sm text-slate-500 mb-3">
        <span>{recipes.length} resep • Halaman {currentPage} / {totalPages}</span>
        <span>Per halaman: {PAGE_SIZE}</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-8">
        {pagedRecipes.map((recipe, index) => (
          <div 
            key={recipe.id} 
            ref={el => cardRefs.current[index] = el}
            className={`group transform transition-all duration-700 ${
              visibleCards.has(index) 
                ? 'translate-y-0 opacity-100' 
                : 'translate-y-8 opacity-0'
            }`}
            // PERUBAHAN 2: Tambahkan event onClick di sini
            onClick={() => onRecipeClick(recipe)}
          >
            <div className="relative bg-white/15 backdrop-blur-xl border border-white/25 rounded-2xl md:rounded-3xl overflow-hidden shadow-lg md:shadow-2xl shadow-green-500/5 hover:shadow-green-500/15 transition-all duration-500 cursor-pointer group-hover:scale-105 group-hover:bg-white/20">
              <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-green-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="relative h-32 md:h-56 overflow-hidden">
                <img 
                  src={recipe.image_url}
                  alt={recipe.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />
              </div>
              <div className="relative z-10 p-4 md:p-8">
                <div className="flex items-center justify-between mb-3 md:mb-4">
                  <span className="text-xs font-semibold text-green-700 bg-green-100/90 px-2 md:px-3 py-1 md:py-1.5 rounded-full">
                    Minuman
                  </span>
                  <div className="flex items-center space-x-1 bg-white/90 px-2 py-1 rounded-full">
                    <Star className="w-3 h-3 md:w-4 md:h-4 text-yellow-500 fill-current" />
                    <span className="text-xs md:text-sm font-semibold text-slate-700">4.7</span>
                  </div>
                </div>
                <h3 className="font-bold text-slate-800 mb-3 md:mb-4 text-base md:text-xl group-hover:text-green-600 transition-colors duration-200 line-clamp-2">
                  {recipe.name}
                </h3>

                {/* 🔹 TOMBOL FAVORIT */}
                <button 
                  onClick={(e) => { 
                    e.stopPropagation(); 
                    if (isFavorite(recipe.id, 'minuman')) {
                      removeFavorite(recipe.id, 'minuman');
                    } else {
                      addFavorite(recipe, 'minuman');
                    }
                  }}
                  className="mb-3 text-xs md:text-sm px-3 py-1 rounded-full border bg-white hover:bg-green-50 transition"
                >
                  {isFavorite(recipe.id, 'minuman') ? "★ Favorit" : "☆ Favorit"}
                </button>

                <div className="flex items-center justify-between text-xs md:text-sm text-slate-600">
                  <div className="flex items-center space-x-1 md:space-x-2 bg-white/70 px-2 md:px-3 py-1 md:py-2 rounded-full">
                    <Clock className="w-3 h-3 md:w-4 md:h-4" />
                    <span className="font-medium">{recipe.ingredients.length} bahan</span>
                  </div>
                  <div className="flex items-center space-x-1 md:space-x-2 bg-white/70 px-2 md:px-3 py-1 md:py-2 rounded-full">
                    <ChefHat className="w-3 h-3 md:w-4 md:h-4" />
                    <span className="font-medium">{recipe.steps.length} langkah</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {recipes.length > PAGE_SIZE && (
        <div className="flex items-center justify-center gap-2 mt-8">
          <button
            onClick={() => gotoPage(currentPage - 1)}
            disabled={currentPage === 1}
            className="px-3 py-1 rounded-full border bg-white disabled:opacity-40"
          >
            Prev
          </button>

          {Array.from({ length: totalPages }).map((_, i) => {
            const page = i + 1;
            const isEdge = page === 1 || page === totalPages;
            const isNear = Math.abs(page - currentPage) <= 1;
            if (totalPages <= 7 || isEdge || isNear || (page === 3 && currentPage <= 3) || (page === totalPages - 2 && currentPage >= totalPages - 2)) {
              return (
                <button
                  key={page}
                  onClick={() => gotoPage(page)}
                  className={`px-3 py-1 rounded-full border ${page === currentPage ? 'bg-green-600 text-white' : 'bg-white'}`}
                >
                  {page}
                </button>
              );
            }
            if ((page === 2 && currentPage > 3) || (page === totalPages - 1 && currentPage < totalPages - 2)) {
              return <span key={page} className="px-2">…</span>;
            }
            return null;
          })}

          <button
            onClick={() => gotoPage(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="px-3 py-1 rounded-full border bg-white disabled:opacity-40"
          >
            Next
          </button>
        </div>
      )}

      {recipes.length === 0 && (
        <div className="text-center py-16">
          <p className="text-slate-500">Minuman tidak ditemukan. Coba kata kunci lain.</p>
        </div>
      )}
    </section>
  );
}
