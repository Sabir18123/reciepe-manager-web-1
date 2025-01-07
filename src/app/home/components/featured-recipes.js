import useFetch from "../../../hooks/useFetch";
import { useState, useEffect } from "react";

const FeaturedRecipes = () => {
  const [featuredRecipes, setFeaturedRecipes] = useState([]);
  
  const { data, loading, error } = useFetch(
    "http://localhost:3001/recipes?_sort=lastUpdated&_order=desc&_limit=3"
  );

  useEffect(() => {
    if (data) {
      setFeaturedRecipes(data);
    }
  }, [data]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-red-500 text-center py-8">
        Error loading featured recipes. Please try again later.
      </div>
    );
  }

  return (
    <section className="py-12 bg-gray-50">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
          Featured Recipes
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {featuredRecipes.map((recipe) => (
            <div
              key={recipe.id}
              className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-semibold text-gray-900">
                    {recipe.title}
                  </h3>
                  <span
                    className={`px-3 py-1 rounded-full text-sm ${
                      recipe.difficulty === "Easy"
                        ? "bg-green-100 text-green-800"
                        : recipe.difficulty === "Medium"
                        ? "bg-yellow-100 text-yellow-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {recipe.difficulty}
                  </span>
                </div>
                <p className="text-gray-600 mb-4">{recipe.description}</p>
                <div className="flex flex-wrap gap-2 mb-4">
                  {recipe.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="bg-gray-100 text-gray-600 px-2 py-1 rounded-md text-sm"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                <div className="text-sm text-gray-500">
                  Last updated:{" "}
                  {new Date(recipe.lastUpdated).toLocaleDateString()}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedRecipes;
