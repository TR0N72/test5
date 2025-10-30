
import { useFavorites } from '../context/FavoritesContext';
import { ResepMakanan } from '../data/makanan';
import { ResepMinuman } from '../data/minuman';

const FavoritesPage = () => {
  const { favorites, removeFavorite } = useFavorites();

  const getRecipeDetails = (item) => {
    const source = item.type === 'makanan' ? ResepMakanan.resep : ResepMinuman.resep;
    return Object.values(source).find(recipe => recipe.id === item.id);
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Favorite Recipes</h1>
      {favorites.length === 0 ? (
        <p>You haven't added any favorite recipes yet.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {favorites.map((item) => {
            const recipe = getRecipeDetails(item);
            return (
              <div key={`${item.type}-${item.id}`} className="bg-white rounded-lg shadow-md p-4">
                <img src={recipe.image_url} alt={recipe.name} className="w-full h-48 object-cover rounded-t-lg" />
                <div className="p-4">
                  <h2 className="text-xl font-bold">{recipe.name}</h2>
                  <button
                    onClick={() => removeFavorite(item.id, item.type)}
                    className="mt-2 bg-red-500 text-white px-4 py-2 rounded-lg"
                  >
                    Remove from Favorites
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default FavoritesPage;
