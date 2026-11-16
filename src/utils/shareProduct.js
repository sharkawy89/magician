import toast from "react-hot-toast";

export async function shareProduct(product) {
  if (!product) return;

  const url = `${window.location.origin}/products/${product.id}`;

  try {
    if (navigator.share) {
      await navigator.share({
        title: product.title,
        text: product.description,
        url,
      });
      return;
    }

    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(url);
      toast.success("Product link copied to clipboard");
      return;
    }

    toast.error("Sharing is not supported in this browser");
  } catch (error) {
    if (error?.name === "AbortError") return;

    console.error("Could not share product", error);
    toast.error("Could not share this product");
  }
}
