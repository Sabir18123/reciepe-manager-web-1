const SearchAndFilters = ({ 
  searchTerm, 
  filterDifficulty, 
  filterTag, 
  sortBy, 
  setSearchTerm, 
  setFilterDifficulty, 
  setFilterTag, 
  setSortBy,
  AVAILABLE_TAGS 
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
      <input
        type="text"
        placeholder="Search recipes..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
      />

      <select
        value={filterDifficulty}
        onChange={(e) => setFilterDifficulty(e.target.value)}
        className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
      >
        <option value="all">All Difficulties</option>
        <option value="easy">Easy</option>
        <option value="medium">Medium</option>
        <option value="hard">Hard</option>
      </select>

      <select
        value={filterTag}
        onChange={(e) => setFilterTag(e.target.value)}
        className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
      >
        <option value="all">All Tags</option>
        {AVAILABLE_TAGS.map((tag) => (
          <option key={tag} value={tag}>
            {tag}
          </option>
        ))}
      </select>

      <select
        value={sortBy}
        onChange={(e) => setSortBy(e.target.value)}
        className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
      >
        <option value="newest">Newest First</option>
        <option value="oldest">Oldest First</option>
        <option value="title">Title</option>
        <option value="difficulty">Difficulty</option>
      </select>
    </div>
  );
};

export default SearchAndFilters; 