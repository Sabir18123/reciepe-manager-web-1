import { FiEdit, FiTrash2 } from "react-icons/fi";

const RecipeCard = ({ recipe, onEdit, onDelete }) => {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="p-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">{recipe.title}</h2>
          <div className="flex gap-2">
            <button
              onClick={() => onEdit(recipe)}
              className="p-1 hover:text-blue-600 transition-colors"
            >
              <FiEdit size={18} />
            </button>
            <button
              onClick={() => onDelete(recipe.id)}
              className="p-1 hover:text-red-600 transition-colors"
            >
              <FiTrash2 size={18} />
            </button>
          </div>
        </div>
        <p className="text-gray-600 mb-4">{recipe.description}</p>
        <div className="flex justify-between items-center">
          <span
            className={`px-2 py-1 rounded-full text-xs font-medium ${
              recipe.difficulty === "easy"
                ? "bg-green-100 text-green-800"
                : recipe.difficulty === "medium"
                ? "bg-yellow-100 text-yellow-800"
                : "bg-red-100 text-red-800"
            }`}
          >
            {recipe.difficulty.toUpperCase()}
          </span>
          <div className="flex gap-2">
            {recipe.tags.slice(0, 2).map((tag) => (
              <span
                key={tag}
                className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs"
              >
                {tag}
              </span>
            ))}
            {recipe.tags.length > 2 && (
              <span className="text-gray-500 text-sm">
                +{recipe.tags.length - 2}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecipeCard; 