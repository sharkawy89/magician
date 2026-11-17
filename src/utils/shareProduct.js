import { notify } from "../components/ui/toast";

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
      notify.success("Product link copied to clipboard");
      return;
    }

    notify.error("Sharing is not supported in this browser");
  } catch (error) {
    if (error?.name === "AbortError") return;

    console.error("Could not share product", error);
    notify.error("Could not share this product");
  }
}
