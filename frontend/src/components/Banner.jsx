function Banner({ search, onSearch }) {
  return (
    <section className="banner">
      <div className="banner-diya">🪔</div>
      <h2>Celebrate Diwali with Homemade Faral</h2>
      <p>Authentic taste • Festive freshness • Made with love</p>
      <div className="search-bar">
        <span className="search-icon">🔍</span>
        <input
          id="searchInput"
          type="text"
          placeholder="Search faral..."
          value={search}
          onChange={(e) => onSearch(e.target.value)}
        />
      </div>
    </section>
  )
}

export default Banner
