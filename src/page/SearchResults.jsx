import { useLocation } from "react-router-dom";
import ListingPage from "../components/listing/ListingPage";

function SearchResults() {
  const location = useLocation();
  const params = new URLSearchParams(location.search);

  // `q` is the storefront search parameter. `query` stays supported so old
  // links keep working.
  const query = (params.get("q") || params.get("query") || "").trim();
  const category = (params.get("category") || "").trim();

  return (
    <ListingPage
      key={`${query}|${category}`}
      query={query}
      category={category}
    />
  );
}

export default SearchResults;
