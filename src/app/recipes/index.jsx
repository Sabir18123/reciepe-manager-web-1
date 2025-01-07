import { useState, useEffect } from "react";
import { Link, useSearchParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useDebounce } from "use-debounce";
import useFetch from "../../hooks/useFetch";
import {
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Card,
  CardContent,
  Typography,
  Grid,
  Box,
  IconButton,
} from "@mui/material";
import { FiEdit, FiTrash2, FiPlus } from "react-icons/fi";

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
      <Box textAlign="center" py={10}>
        Loading...
      </Box>
    );
  if (error)
    return (
      <Box textAlign="center" py={10} color="error.main">
        Error: {error}
      </Box>
    );

  return (
    <Box sx={{ maxWidth: 1200, mx: "auto", p: 3 }}>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={4}
      >
        <Typography variant="h4" component="h1">
          Recipes
        </Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<FiPlus />}
          onClick={() => navigate("/recipes/create")}
        >
          Create Recipe
        </Button>
      </Box>

      <Grid container spacing={2} mb={4}>
        <Grid item xs={12} md={3}>
          <TextField
            fullWidth
            label="Search recipes"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </Grid>
        <Grid item xs={12} md={3}>
          <FormControl fullWidth>
            <InputLabel>Difficulty</InputLabel>
            <Select
              value={filterDifficulty}
              label="Difficulty"
              onChange={(e) => setFilterDifficulty(e.target.value)}
            >
              <MenuItem value="all">All Difficulties</MenuItem>
              <MenuItem value="easy">Easy</MenuItem>
              <MenuItem value="medium">Medium</MenuItem>
              <MenuItem value="hard">Hard</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} md={3}>
          <FormControl fullWidth>
            <InputLabel>Filter by Tag</InputLabel>
            <Select
              value={filterTag}
              label="Filter by Tag"
              onChange={(e) => setFilterTag(e.target.value)}
            >
              <MenuItem value="all">All Tags</MenuItem>
              {AVAILABLE_TAGS.map((tag) => (
                <MenuItem key={tag} value={tag}>
                  {tag.charAt(0).toUpperCase() + tag.slice(1)}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} md={3}>
          <FormControl fullWidth>
            <InputLabel>Sort By</InputLabel>
            <Select
              value={sortBy}
              label="Sort By"
              onChange={(e) => setSortBy(e.target.value)}
            >
              <MenuItem value="newest">Newest First</MenuItem>
              <MenuItem value="oldest">Oldest First</MenuItem>
              <MenuItem value="title">Title</MenuItem>
              <MenuItem value="difficulty">Difficulty</MenuItem>
            </Select>
          </FormControl>
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        {filteredAndSortedRecipes.map((recipe) => (
          <Grid item xs={12} sm={6} md={4} key={recipe.id}>
            <Card>
              <CardContent>
                <Box
                  display="flex"
                  justifyContent="space-between"
                  alignItems="center"
                  mb={2}
                >
                  <Typography variant="h6" component="h2">
                    {recipe.title}
                  </Typography>
                  <Box>
                    <IconButton
                      onClick={() => setEditingRecipe(recipe)}
                      size="small"
                    >
                      <FiEdit size={18} />
                    </IconButton>
                    <IconButton
                      onClick={() => handleDelete(recipe.id)}
                      size="small"
                      color="error"
                    >
                      <FiTrash2 size={18} />
                    </IconButton>
                  </Box>
                </Box>
                <Typography color="text.secondary" paragraph>
                  {recipe.description}
                </Typography>
                <Box
                  display="flex"
                  justifyContent="space-between"
                  alignItems="center"
                >
                  <Typography
                    variant="caption"
                    sx={{
                      px: 1,
                      py: 0.5,
                      borderRadius: 1,
                      bgcolor:
                        recipe.difficulty.toLowerCase() === "easy"
                          ? "success.light"
                          : recipe.difficulty.toLowerCase() === "medium"
                          ? "warning.light"
                          : "error.light",
                    }}
                  >
                    {recipe.difficulty.toUpperCase()}
                  </Typography>
                  <Box display="flex" gap={0.5}>
                    {recipe.tags.slice(0, 2).map((tag) => (
                      <Typography
                        key={tag}
                        variant="caption"
                        sx={{
                          px: 1,
                          py: 0.5,
                          borderRadius: 1,
                          bgcolor: "primary.light",
                          color: "primary.contrastText",
                        }}
                      >
                        {tag}
                      </Typography>
                    ))}
                    {recipe.tags.length > 2 && (
                      <Typography
                        variant="caption"
                        sx={{ color: "text.secondary" }}
                      >
                        +{recipe.tags.length - 2}
                      </Typography>
                    )}
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Dialog
        open={!!editingRecipe}
        onClose={() => setEditingRecipe(null)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Edit Recipe</DialogTitle>
        <DialogContent dividers>
          {editingRecipe && (
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Title"
                  value={editingRecipe.title}
                  onChange={(e) =>
                    setEditingRecipe({
                      ...editingRecipe,
                      title: e.target.value,
                    })
                  }
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  multiline
                  rows={3}
                  label="Description"
                  value={editingRecipe.description}
                  onChange={(e) =>
                    setEditingRecipe({
                      ...editingRecipe,
                      description: e.target.value,
                    })
                  }
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <FormControl fullWidth>
                  <InputLabel>Difficulty</InputLabel>
                  <Select
                    value={editingRecipe.difficulty}
                    label="Difficulty"
                    onChange={(e) =>
                      setEditingRecipe({
                        ...editingRecipe,
                        difficulty: e.target.value,
                      })
                    }
                  >
                    <MenuItem value="easy">Easy</MenuItem>
                    <MenuItem value="medium">Medium</MenuItem>
                    <MenuItem value="hard">Hard</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={6}>
                <FormControl fullWidth>
                  <InputLabel>Tags</InputLabel>
                  <Select
                    multiple
                    value={editingRecipe.tags}
                    label="Tags"
                    onChange={(e) =>
                      setEditingRecipe({
                        ...editingRecipe,
                        tags: e.target.value,
                      })
                    }
                    renderValue={(selected) => (
                      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                        {selected.map((value) => (
                          <Typography
                            key={value}
                            variant="caption"
                            sx={{
                              px: 1,
                              py: 0.5,
                              borderRadius: 1,
                              bgcolor: "primary.light",
                              color: "primary.contrastText",
                            }}
                          >
                            {value}
                          </Typography>
                        ))}
                      </Box>
                    )}
                  >
                    {AVAILABLE_TAGS.map((tag) => (
                      <MenuItem key={tag} value={tag}>
                        {tag.charAt(0).toUpperCase() + tag.slice(1)}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditingRecipe(null)}>Cancel</Button>
          <Button
            onClick={() => handleUpdate(editingRecipe)}
            variant="contained"
          >
            Save Changes
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Recipes;
