import FeaturedRecipes from "./components/featured-recipes";
import { Link } from "react-router-dom";

const MainPage = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-white">
        <div className="container mx-auto px-4 py-16">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Welcome to Recipe Manager
            </h1>
            <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto mb-8">
              Your personal culinary companion for creating, organizing, and
              discovering delicious recipes. Easily manage your recipes with
              detailed ingredients, step-by-step instructions, and helpful tags.
            </p>
            <div className="flex justify-center gap-4">
              <button className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition-colors">
                <Link to="/recipes">Browse Recipes</Link>
              </button>
              <button className="bg-white text-indigo-600 border-2 border-indigo-600 px-6 py-3 rounded-lg hover:bg-indigo-50 transition-colors">
                <Link to="/recipes/create">Add New Recipe</Link>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Recipes Section */}
      <FeaturedRecipes />

      {/* Projects Section */}
      <section className="bg-white py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            Related Projects
          </h2>
          <div className="max-w-4xl mx-auto bg-gray-50 rounded-lg shadow-lg overflow-hidden">
            <div className="p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                LinkedIn Data Extraction Tool
              </h3>
              <p className="text-gray-600 mb-4">
                An automated solution for extracting LinkedIn profile data and
                populating forms. This project streamlines the process of
                gathering professional information and demonstrates integration
                with external APIs and form handling.
              </p>
              <div className="flex gap-2">
                <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                  Automation
                </span>
                <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                  Data Extraction
                </span>
                <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                  API Integration
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-gray-50 py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">
            Key Features
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                Recipe Management
              </h3>
              <p className="text-gray-600">
                Create, edit, and organize your recipes with ease. Add detailed
                ingredients, preparation steps, and cooking times.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                Smart Categorization
              </h3>
              <p className="text-gray-600">
                Tag recipes by cuisine, difficulty level, or dietary preferences
                for quick and easy access.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                Recipe Discovery
              </h3>
              <p className="text-gray-600">
                Explore our curated collection of recipes and find inspiration
                for your next culinary adventure.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default MainPage;
