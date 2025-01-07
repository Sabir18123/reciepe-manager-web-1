import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useDebounce } from "use-debounce";
import useFetch from "../../hooks/useFetch";
import { FiPlus } from "react-icons/fi";
import SearchAndFilters from "./components/SearchAndFilters";
import RecipeCard from "./components/RecipeCard";
import EditRecipeDialog from "./components/EditRecipeDialog";

export const AVAILABLE_TAGS = [
  "Breakfast",
  "Lunch",
  "Dinner",
  "Dessert",
  "Vegetarian",
  "Vegan",
  "Gluten-free",
  "Snack",
  "Appetizer",
  "Main course",
  "Soup",
  "Salad",
];

const Recipes = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  const [searchTerm, setSearchTerm] = useState(
    searchParams.get("search") || ""
  );
  const [filterDifficulty, setFilterDifficulty] = useState(
    searchParams.get("difficulty") || "all"
  );
  const [filterTag, setFilterTag] = useState(searchParams.get("tag") || "all");
  const [sortBy, setSortBy] = useState(searchParams.get("sort") || "newest");

  const [debouncedSearch] = useDebounce(searchTerm, 500);
  const [editingRecipe, setEditingRecipe] = useState(null);
  const [recipes, setRecipes] = useState([]);

  const { data, loading, error } = useFetch("http://localhost:3001/recipes");

  useEffect(() => {
    const params = new URLSearchParams();
    if (debouncedSearch) params.set("search", debouncedSearch);
    if (filterDifficulty !== "all") params.set("difficulty", filterDifficulty);
    if (filterTag !== "all") params.set("tag", filterTag);
    if (sortBy !== "newest") params.set("sort", sortBy);
    setSearchParams(params);
  }, [debouncedSearch, filterDifficulty, filterTag, sortBy, setSearchParams]);

  useEffect(() => {
    if (data) {
      setRecipes(data);
    }
  }, [data]);

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this recipe?")) {
      try {
        const response = await fetch(`http://localhost:3001/recipes/${id}`, {
          method: "DELETE",
        });

        if (response.ok) {
          setRecipes(recipes.filter((recipe) => recipe.id !== id));
          toast.success("Recipe deleted successfully");
        }
      } catch (error) {
        toast.error("Error deleting recipe");
        console.error("Error:", error);
      }
    }
  };

  const handleUpdate = async (updatedRecipe) => {
    try {
      const response = await fetch(
        `http://localhost:3001/recipes/${updatedRecipe.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            ...updatedRecipe,
            updatedAt: new Date().toISOString(),
          }),
        }
      );

      if (response.ok) {
        const updatedData = await response.json();
        setRecipes(
          recipes.map((recipe) =>
            recipe.id === updatedData.id ? updatedData : recipe
          )
        );
        setEditingRecipe(null);
        toast.success("Recipe updated successfully");
      }
    } catch (error) {
      toast.error("Error updating recipe");
      console.error("Error:", error);
    }
  };

  const filteredAndSortedRecipes = recipes
    .filter((recipe) => {
      const matchesSearch =
        recipe.title.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
        recipe.description
          .toLowerCase()
          .includes(debouncedSearch.toLowerCase()) ||
        recipe.ingredients.some((ing) =>
          ing.toLowerCase().includes(debouncedSearch.toLowerCase())
        );

      const matchesDifficulty =
        filterDifficulty === "all" || recipe.difficulty === filterDifficulty;
      const matchesTag = filterTag === "all" || recipe.tags.includes(filterTag);

      return matchesSearch && matchesDifficulty && matchesTag;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "newest":
          return new Date(b.createdAt) - new Date(a.createdAt);
        case "oldest":
          return new Date(a.createdAt) - new Date(b.createdAt);
        case "title":
          return a.title.localeCompare(b.title);
        case "difficulty":
          const difficultyOrder = { easy: 1, medium: 2, hard: 3 };
          return difficultyOrder[a.difficulty] - difficultyOrder[b.difficulty];
        default:
          return 0;
      }
    });

  if (loading)
    return (
      <div className="flex justify-center items-center h-screen">
        Loading...
      </div>
    );
  if (error)
    return (
      <div className="flex justify-center items-center h-screen text-red-500">
        Error: {error}
      </div>
    );

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Recipes</h1>
        <button
          onClick={() => navigate("/recipes/create")}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
        >
          <FiPlus /> Create Recipe
        </button>
      </div>

      <SearchAndFilters
        searchTerm={searchTerm}
        filterDifficulty={filterDifficulty}
        filterTag={filterTag}
        sortBy={sortBy}
        setSearchTerm={setSearchTerm}
        setFilterDifficulty={setFilterDifficulty}
        setFilterTag={setFilterTag}
        setSortBy={setSortBy}
        AVAILABLE_TAGS={AVAILABLE_TAGS}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredAndSortedRecipes.map((recipe) => (
          <RecipeCard
            key={recipe.id}
            recipe={recipe}
            onEdit={setEditingRecipe}
            onDelete={handleDelete}
          />
        ))}
      </div>

      <EditRecipeDialog
        editingRecipe={editingRecipe}
        setEditingRecipe={setEditingRecipe}
        onUpdate={handleUpdate}
        AVAILABLE_TAGS={AVAILABLE_TAGS}
      />
    </div>
  );
};

export default Recipes;