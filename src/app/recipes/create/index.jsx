import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { AVAILABLE_TAGS } from "../index";

const CreateRecipe = () => {
  const navigate = useNavigate();
  const [recipe, setRecipe] = useState({
    title: "",
    description: "",
    ingredients: [""],
    instructions: [""],
    difficulty: "easy",
    tags: [""],
  });

  const handleIngredientChange = (index, value) => {
    const newIngredients = [...recipe.ingredients];
    newIngredients[index] = value;
    setRecipe({ ...recipe, ingredients: newIngredients });
  };

  const handleTagChange = (index, value) => {
    const newTags = [...recipe.tags];
    newTags[index] = value;
    setRecipe({ ...recipe, tags: newTags });
  };

  const addIngredient = () => {
    setRecipe({ ...recipe, ingredients: [...recipe.ingredients, ""] });
  };

  const handleInstructionChange = (index, value) => {
    const newInstructions = [...recipe.instructions];
    newInstructions[index] = value;
    setRecipe({ ...recipe, instructions: newInstructions });
  };

  const addInstruction = () => {
    setRecipe({ ...recipe, instructions: [...recipe.instructions, ""] });
  };

  const addTag = () => {
    setRecipe({ ...recipe, tags: [...recipe.tags, ""] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:3001/recipes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...recipe,
          ingredients: recipe.ingredients.filter((i) => i !== ""),
          instructions: recipe.instructions.filter((i) => i !== ""),
          lastUpdated: new Date().toISOString(),
        }),
      });

      if (response.ok) {
        toast.success("Recipe created successfully");
        navigate("/recipes");
      }
    } catch (error) {
      console.error("Error creating recipe:", error);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-8">Create New Recipe</h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Title */}
        <div>
          <label className="block text-sm font-medium mb-2">Recipe Title</label>
          <input
            type="text"
            value={recipe.title}
            onChange={(e) => setRecipe({ ...recipe, title: e.target.value })}
            className="w-full p-2 border rounded-md"
            required
          />
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium mb-2">Description</label>
          <textarea
            value={recipe.description}
            onChange={(e) =>
              setRecipe({ ...recipe, description: e.target.value })
            }
            className="w-full p-2 border rounded-md"
            rows="3"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Ingredients</label>
          {recipe.ingredients.map((ingredient, index) => (
            <div key={index} className="flex gap-2 mb-2">
              <input
                type="text"
                value={ingredient}
                onChange={(e) => handleIngredientChange(index, e.target.value)}
                className="flex-1 p-2 border rounded-md"
                placeholder="Enter ingredient"
              />
            </div>
          ))}
          <button
            type="button"
            onClick={addIngredient}
            className="text-blue-600 hover:text-blue-800"
          >
            + Add Ingredient
          </button>
        </div>

        {/* Instructions */}
        <div>
          <label className="block text-sm font-medium mb-2">Instructions</label>
          {recipe.instructions.map((instruction, index) => (
            <div key={index} className="flex gap-2 mb-2">
              <input
                type="text"
                value={instruction}
                onChange={(e) => handleInstructionChange(index, e.target.value)}
                className="flex-1 p-2 border rounded-md"
                placeholder={`Step ${index + 1}`}
              />
            </div>
          ))}
          <button
            type="button"
            onClick={addInstruction}
            className="text-blue-600 hover:text-blue-800"
          >
            + Add Step
          </button>
        </div>

        {/* Difficulty */}
        <div>
          <label className="block text-sm font-medium mb-2">Difficulty</label>
          <select
            value={recipe.difficulty}
            onChange={(e) =>
              setRecipe({ ...recipe, difficulty: e.target.value })
            }
            className="w-full p-2 border rounded-md"
          >
            <option value="easy">Easy</option>
            <option value="medium">Medium</option>
            <option value="hard">Hard</option>
          </select>
        </div>

        <div className="flex flex-col items-start gap-2">
          <label className="block text-sm font-medium mb-2">Tag</label>
          {recipe.tags.map((tag, index) => (
            <select
              className="w-full p-2 border rounded-md"
              key={index}
              value={tag}
              onChange={(e) => handleTagChange(index, e.target.value)}
            >
              <option value="">Select a tag</option>
              {AVAILABLE_TAGS.map((availableTag) => (
                <option key={availableTag} value={availableTag}>
                  {availableTag}
                </option>
              ))}
            </select>
          ))}


          <button
            type="button"
            onClick={addTag}
            className="text-blue-600 hover:text-blue-800"
          >
            + Add Tag
          </button>
        </div>

        <div>
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
          >
            Create Recipe
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateRecipe;
