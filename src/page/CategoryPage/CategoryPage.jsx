import { useParams } from "react-router-dom";
import ListingPage from "../../components/listing/ListingPage";

function CategoryPage() {
  const { category } = useParams();

  return (
    <ListingPage
      key={category ?? ""}
      category={category ?? ""}
    />
  );
}

export default CategoryPage;
