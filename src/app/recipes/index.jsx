import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useDebounce } from "use-debounce";
import useFetch from "../../hooks/useFetch";
import { FiPlus, FiShare2 } from "react-icons/fi";
import { Pagination } from "@mui/material";
import SearchAndFilters from "./components/SearchAndFilters";
import RecipeCard from "./components/RecipeCard";
import EditRecipeDialog from "./components/EditRecipeDialog";
import { DragDropContext, Droppable } from "react-beautiful-dnd";

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

const ITEMS_PER_PAGE = 9

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
  const [page, setPage] = useState(parseInt(searchParams.get("page")) || 1);

  const [debouncedSearch] = useDebounce(searchTerm, 500);
  const [editingRecipe, setEditingRecipe] = useState(null);
  const [recipes, setRecipes] = useState([]);
  const [selectedRecipes, setSelectedRecipes] = useState(new Set());
  const [orderMap, setOrderMap] = useState({});

  const { data, loading, error } = useFetch("http://localhost:3001/recipes");

  useEffect(() => {
    const params = new URLSearchParams();
    if (debouncedSearch) params.set("search", debouncedSearch);
    if (filterDifficulty !== "all") params.set("difficulty", filterDifficulty);
    if (filterTag !== "all") params.set("tag", filterTag);
    if (sortBy !== "newest") params.set("sort", sortBy);
    if (page > 1) params.set("page", page.toString());
    setSearchParams(params);
  }, [debouncedSearch, filterDifficulty, filterTag, sortBy, page, setSearchParams]);

  useEffect(() => {
    if (data) {
      const initialOrderMap = data.reduce((acc, recipe, index) => {
        acc[recipe.id] = recipe.order || index;
        return acc;
      }, {});
      setOrderMap(initialOrderMap);
      setRecipes(data.sort((a, b) => (initialOrderMap[a.id] - initialOrderMap[b.id])));
    }
  }, [data]);

  useEffect(() => {
    setPage(1);
  }, [debouncedSearch, filterDifficulty, filterTag]);

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

  const handleToggleSelect = (recipeId) => {
    setSelectedRecipes((prev) => {
      const newSelected = new Set(prev);
      if (newSelected.has(recipeId)) {
        newSelected.delete(recipeId);
      } else {
        newSelected.add(recipeId);
      }
      return newSelected;
    });
  };

  const handleShare = () => {
    if (selectedRecipes.size === 0) {
      toast.warning("Please select at least one recipe to share");
      return;
    }

    console.log(selectedRecipes);
    const recipesToShare = recipes.filter((recipe) =>
      selectedRecipes.has(recipe.id)
    );
    const recipesJson = JSON.stringify(recipesToShare, null, 2);
    const mailtoLink = `mailto:?subject=Shared Recipes&body=${encodeURIComponent(
      recipesJson
    )}`;

    window.open(mailtoLink);
  };

  const handlePageChange = (event, newPage) => {
    setPage(newPage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDragEnd = async (result) => {
    if (!result.destination) return;

    const sourceIndex = result.source.index;
    const destinationIndex = result.destination.index;

    const startIdx = (page - 1) * ITEMS_PER_PAGE;
    const sourceGlobalIndex = startIdx + sourceIndex;
    const destinationGlobalIndex = startIdx + destinationIndex;

    const newRecipes = Array.from(recipes);
    const [removed] = newRecipes.splice(sourceGlobalIndex, 1);
    newRecipes.splice(destinationGlobalIndex, 0, removed);

    const updatedRecipes = newRecipes.map((recipe, index) => ({
      ...recipe,
      order: index
    }));

    setRecipes(updatedRecipes);

    try {
      const minIndex = Math.min(sourceGlobalIndex, destinationGlobalIndex);
      const maxIndex = Math.max(sourceGlobalIndex, destinationGlobalIndex);
      const affectedRecipes = updatedRecipes.slice(minIndex, maxIndex + 1);

      await Promise.all(
        affectedRecipes.map(recipe =>
          fetch(`http://localhost:3001/recipes/${recipe.id}`, {
            method: 'PATCH',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ order: recipe.order }),
          })
        )
      );
      toast.success('Recipe order updated successfully');
    } catch (error) {
      toast.error('Failed to update recipe order');
      console.error('Error updating recipe order:', error);
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

  const totalPages = Math.ceil(filteredAndSortedRecipes.length / ITEMS_PER_PAGE);
  const paginatedRecipes = filteredAndSortedRecipes.slice(
    (page - 1) * ITEMS_PER_PAGE,
    page * ITEMS_PER_PAGE
  );

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
        <div className="flex gap-4">
          {selectedRecipes.size > 0 && (
            <button
              onClick={handleShare}
              className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors"
            >
              <FiShare2 /> Share ({selectedRecipes.size})
            </button>
          )}
          <button
            onClick={() => navigate("/recipes/create")}
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
          >
            <FiPlus /> Create Recipe
          </button>
        </div>
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

      <DragDropContext >
        <Droppable droppableId="recipes">
          {(provided) => (
            <div
              {...provided.droppableProps}
              ref={provided.innerRef}
              id="recipes"
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8"
              style={{ display: 'grid' }}
            >
              {paginatedRecipes.map((recipe, index) => (
                <RecipeCard
                  key={recipe.id}
                  recipe={recipe}
                  index={index}
                  onEdit={setEditingRecipe}
                  onDelete={handleDelete}
                  isSelected={selectedRecipes.has(recipe.id)}
                  onToggleSelect={handleToggleSelect}
                />
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>

      {totalPages > 1 && (
        <div className="flex justify-center mt-6 mb-8">
          <Pagination
            count={totalPages}
            page={page}
            onChange={handlePageChange}
            color="primary"
            size="large"
            showFirstButton
            showLastButton
          />
        </div>
      )}

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
