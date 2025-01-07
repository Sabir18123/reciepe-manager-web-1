import { Dialog, DialogTitle, DialogContent, DialogActions } from "@mui/material";

const EditRecipeDialog = ({ 
  editingRecipe, 
  setEditingRecipe, 
  onUpdate, 
  AVAILABLE_TAGS 
}) => {
  if (!editingRecipe) return null;

  return (
    <Dialog
      open={!!editingRecipe}
      onClose={() => setEditingRecipe(null)}
      maxWidth="md"
      fullWidth
    >
      <DialogTitle>Edit Recipe</DialogTitle>
      <DialogContent dividers>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Title
            </label>
            <input
              type="text"
              value={editingRecipe.title}
              onChange={(e) =>
                setEditingRecipe({
                  ...editingRecipe,
                  title: e.target.value,
                })
              }
              className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              rows="3"
              value={editingRecipe.description}
              onChange={(e) =>
                setEditingRecipe({
                  ...editingRecipe,
                  description: e.target.value,
                })
              }
              className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Difficulty
            </label>
            <select
              value={editingRecipe.difficulty}
              onChange={(e) =>
                setEditingRecipe({
                  ...editingRecipe,
                  difficulty: e.target.value,
                })
              }
              className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="easy">Easy</option>
              <option value="medium">Medium</option>
              <option value="hard">Hard</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tags
            </label>
            <select
              multiple
              value={editingRecipe.tags}
              onChange={(e) =>
                setEditingRecipe({
                  ...editingRecipe,
                  tags: Array.from(
                    e.target.selectedOptions,
                    (option) => option.value
                  ),
                })
              }
              className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              {AVAILABLE_TAGS.map((tag) => (
                <option key={tag} value={tag}>
                  {tag}
                </option>
              ))}
            </select>
          </div>
        </div>
      </DialogContent>
      <DialogActions>
        <button
          onClick={() => setEditingRecipe(null)}
          className="px-4 py-2 text-gray-600 hover:text-gray-800"
        >
          Cancel
        </button>
        <button
          onClick={() => onUpdate(editingRecipe)}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          Save Changes
        </button>
      </DialogActions>
    </Dialog>
  );
};

export default EditRecipeDialog; 