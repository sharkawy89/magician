import { useState } from "react";
import { Link } from "react-router-dom";
import {
  FaCartArrowDown,
  FaCheck,
  FaRegHeart,
  FaSearch,
  FaShare,
} from "react-icons/fa";
import Logo from "../components/brand/Logo";
import Badge from "../components/ui/Badge";
import Button from "../components/ui/Button";
import Card from "../components/ui/Card";
import Checkbox from "../components/ui/Checkbox";
import Drawer from "../components/ui/Drawer";
import EmptyState from "../components/ui/EmptyState";
import ErrorState from "../components/ui/ErrorState";
import Input from "../components/ui/Input";
import Modal from "../components/ui/Modal";
import Price from "../components/ui/Price";
import QuantityStepper from "../components/ui/QuantityStepper";
import Radio from "../components/ui/Radio";
import Rating from "../components/ui/Rating";
import Select from "../components/ui/Select";
import Skeleton, {
  SkeletonAvatar,
  SkeletonCard,
  SkeletonText,
} from "../components/ui/Skeleton";
import { notify } from "../components/ui/toast";

function Section({ title, description, children }) {
  return (
    <section className="border-t border-border pt-8">
      <h2 className="text-h4 font-bold text-ink">{title}</h2>
      {description ? (
        <p className="mt-1 max-w-2xl text-sm text-ink-secondary">
          {description}
        </p>
      ) : null}
      <div className="mt-5">{children}</div>
    </section>
  );
}

function UiKit() {
  const [modalOpen, setModalOpen] = useState(false);
  const [drawerSide, setDrawerSide] = useState(null);
  const [quantity, setQuantity] = useState(2);
  const [shipping, setShipping] = useState("standard");

  const drawerTitle = drawerSide
    ? `${drawerSide.charAt(0).toUpperCase()}${drawerSide.slice(1)} drawer`
    : "Drawer";

  return (
    <div className="mx-auto w-[92%] max-w-5xl py-10">
      <header className="mb-10">
        <Badge variant="brand" size="sm">
          Dev only
        </Badge>
        <h1 className="mt-3 text-h2 font-bold text-ink">
          MAGICIAN UI Kit
        </h1>
        <p className="mt-2 max-w-2xl">
          Every component, variant, size and state used by the storefront.
          This route is registered only in development.
        </p>
      </header>

      <div className="space-y-10">
        <Section
          title="Buttons"
          description="Yellow is reserved for primary actions. Text on yellow is always ink. Focus rings use an ink outline with a white offset halo."
        >
          <div className="space-y-5">
            <div className="flex flex-wrap items-center gap-3">
              <Button>Primary</Button>
              <Button variant="secondary">Secondary</Button>
              <Button variant="outline">Outline</Button>
              <Button variant="ghost">Ghost</Button>
              <Button variant="link">Link button</Button>
            </div>

            <div className="flex flex-wrap items-end gap-3">
              <Button size="sm">Small</Button>
              <Button size="md">Medium</Button>
              <Button size="lg">Large</Button>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <Button loading>Loading</Button>
              <Button disabled>Disabled</Button>
              <Button variant="secondary" loading>
                Saving
              </Button>
              <Button iconOnly aria-label="Search products">
                <FaSearch aria-hidden="true" />
              </Button>
              <Button
                variant="outline"
                iconOnly
                aria-label="Add to favorites"
              >
                <FaRegHeart aria-hidden="true" />
              </Button>
              <Button variant="ghost" iconOnly aria-label="Share product">
                <FaShare aria-hidden="true" />
              </Button>
            </div>

            <div className="flex flex-wrap gap-3">
              <Button leftIcon={<FaCartArrowDown aria-hidden="true" />}>
                Add to cart
              </Button>
              <Button
                variant="secondary"
                rightIcon={<FaCheck aria-hidden="true" />}
              >
                Saved
              </Button>
            </div>
          </div>
        </Section>

        <Section
          title="Form controls"
          description="Inputs use a 12px radius, a strong border and a dark focus ring. Errors and helper copy are wired with aria-describedby."
        >
          <div className="grid gap-5 md:grid-cols-2">
            <Input
              label="Full name"
              placeholder="Ada Lovelace"
              helper="Use the name printed on your card."
              required
            />
            <Input
              label="Email"
              type="email"
              defaultValue="not-an-email"
              error="Enter a valid email address."
            />
            <Input
              label="Search"
              placeholder="Search products"
              startIcon={<FaSearch />}
            />
            <Input label="Disabled input" placeholder="Unavailable" disabled />
            <Select
              label="Country"
              defaultValue=""
              placeholder="Choose a country"
              helper="Used for shipping estimates."
              options={["United States", "United Kingdom", "Germany"]}
            />
            <Select
              label="Size"
              defaultValue=""
              placeholder="Choose a size"
              error="Select a size to continue."
              options={[
                { value: "s", label: "Small" },
                { value: "m", label: "Medium" },
                { value: "l", label: "Large" },
              ]}
            />
          </div>

          <div className="mt-8 grid gap-8 md:grid-cols-3">
            <div className="space-y-3">
              <p className="text-sm font-semibold text-ink">Checkboxes</p>
              <Checkbox
                label="Email me about new arrivals"
                defaultChecked
              />
              <Checkbox
                label="Subscribe to the newsletter"
                description="One email a week, no spam."
              />
              <Checkbox
                label="I accept the terms"
                error="You must accept the terms."
              />
            </div>

            <fieldset className="m-0 min-w-0 space-y-2 border-0 p-0">
              <legend className="mb-2 px-0 text-sm font-semibold text-ink">
                Shipping speed
              </legend>
              <Radio
                name="shipping"
                value="standard"
                label="Standard (3-5 days)"
                checked={shipping === "standard"}
                onChange={() => setShipping("standard")}
              />
              <Radio
                name="shipping"
                value="express"
                label="Express (1-2 days)"
                description="Additional delivery fee."
                checked={shipping === "express"}
                onChange={() => setShipping("express")}
              />
              <Radio
                name="shipping"
                value="unavailable"
                label="Same day (unavailable)"
                disabled
              />
            </fieldset>

            <div>
              <p className="mb-2 text-sm font-semibold text-ink">
                Quantity
              </p>
              <QuantityStepper
                value={quantity}
                onChange={setQuantity}
                label="demo item"
              />
              <p className="mt-3 text-caption text-ink-secondary">
                Selected quantity: {quantity}
              </p>
              <div className="mt-4">
                <QuantityStepper
                  value={1}
                  min={1}
                  max={1}
                  label="limited item"
                />
              </div>
            </div>
          </div>
        </Section>

        <Section
          title="Badges"
          description="Sale red, new blue, bestseller orange, free shipping green, neutral, brand, plus the ink count badge used in the storefront header."
        >
          <div className="flex flex-wrap items-center gap-3">
            <Badge variant="sale">Sale</Badge>
            <Badge variant="new">New</Badge>
            <Badge variant="bestseller">Bestseller</Badge>
            <Badge variant="freeShipping">Free shipping</Badge>
            <Badge variant="neutral">Neutral</Badge>
            <Badge variant="brand" size="sm">
              3
            </Badge>
            <Badge variant="ink" size="sm">
              3
            </Badge>
            <Badge variant="sale" size="sm">
              -25%
            </Badge>
          </div>
        </Section>

        <Section
          title="Cards"
          description="White surface, token border and soft shadow. The second card has the optional 200ms hover lift."
        >
          <div className="grid gap-5 sm:grid-cols-2">
            <Card className="p-5">
              <h3 className="text-h5 font-bold text-ink">Standard card</h3>
              <p className="mt-2 text-sm">
                Card content sits on a white surface with a token border and
                soft shadow.
              </p>
            </Card>

            <Card hover className="p-5">
              <h3 className="text-h5 font-bold text-ink">Hover lift card</h3>
              <p className="mt-2 text-sm">
                Hover or focus this card to preview the lift and shadow
                change.
              </p>
              <Button variant="link" className="mt-3" as={Link} to="/ui-kit">
                View details
              </Button>
            </Card>
          </div>
        </Section>

        <Section
          title="Rating and price"
          description="Stars use the rating yellow. Discounts pair a struck-through original price with a red percentage pill."
        >
          <div className="grid gap-8 md:grid-cols-2">
            <div className="space-y-4">
              <Rating value={4.7} count={128} showValue />
              <Rating value={3.5} count={42} size="lg" />
              <Rating value={2.2} showValue size="sm" />
            </div>
            <div className="space-y-4">
              <Price price={549.99} discountPercent={20} />
              <Price price={79} size="lg" />
              <Price price={24.5} oldPrice={35} size="sm" />
            </div>
          </div>
        </Section>

        <Section
          title="Skeletons"
          description="Shimmer blocks with text-line, card and avatar presets. Animation stops under prefers-reduced-motion."
        >
          <div className="grid gap-5 sm:grid-cols-2">
            <div className="space-y-4">
              <Skeleton className="h-10 w-full" />
              <SkeletonText lines={3} />
              <div className="flex items-center gap-3">
                <SkeletonAvatar size="sm" />
                <SkeletonAvatar />
                <SkeletonAvatar size="lg" />
              </div>
            </div>
            <SkeletonCard />
          </div>
        </Section>

        <Section
          title="Empty and error states"
          description="Both accept an icon, title, description and optional call to action."
        >
          <div className="grid gap-5 lg:grid-cols-2">
            <Card>
              <EmptyState
                icon={<FaCartArrowDown />}
                title="Your cart is empty"
                description="Add a product to get started."
                action={
                  <Button as={Link} to="/ui-kit">
                    Browse products
                  </Button>
                }
              />
            </Card>
            <Card>
              <ErrorState
                title="We could not load this page"
                description="Check your connection and try again."
                action={
                  <Button
                    variant="outline"
                    onClick={() => notify.info("Retry button clicked")}
                  >
                    Try again
                  </Button>
                }
              />
            </Card>
          </div>

          <div className="mt-5 flex flex-wrap gap-3">
            <Button
              variant="outline"
              onClick={() => notify.success("Saved to favorites")}
            >
              Success toast
            </Button>
            <Button
              variant="outline"
              onClick={() => notify.error("Could not save changes")}
            >
              Error toast
            </Button>
            <Button
              variant="outline"
              onClick={() => notify.info("Your order is on the way")}
            >
              Info toast
            </Button>
          </div>
        </Section>

        <Section
          title="Overlays"
          description="Modal and Drawer trap focus, close on Escape or backdrop click, lock body scroll and animate with framer-motion."
        >
          <div className="flex flex-wrap gap-3">
            <Button onClick={() => setModalOpen(true)}>Open modal</Button>
            <Button
              variant="outline"
              onClick={() => setDrawerSide("right")}
            >
              Drawer right
            </Button>
            <Button
              variant="outline"
              onClick={() => setDrawerSide("left")}
            >
              Drawer left
            </Button>
            <Button
              variant="outline"
              onClick={() => setDrawerSide("bottom")}
            >
              Drawer bottom
            </Button>
          </div>

          <Modal
            open={modalOpen}
            onClose={() => setModalOpen(false)}
            title="Edit shipping address"
            description="This modal is labelled by its title and described by this text."
            footer={
              <>
                <Button
                  variant="ghost"
                  onClick={() => setModalOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  onClick={() => {
                    setModalOpen(false);
                    notify.success("Address saved");
                  }}
                >
                  Save address
                </Button>
              </>
            }
          >
            <div className="grid gap-4 sm:grid-cols-2">
              <Input label="First name" defaultValue="Ada" />
              <Input label="Last name" defaultValue="Lovelace" />
              <Input
                label="Street"
                defaultValue="12 Analytical Engine Way"
                className="sm:col-span-2"
              />
              <Input label="City" defaultValue="London" />
              <Input label="Postal code" defaultValue="EC1A 1BB" />
            </div>
          </Modal>

          <Drawer
            open={Boolean(drawerSide)}
            onClose={() => setDrawerSide(null)}
            side={drawerSide ?? "right"}
            title={drawerTitle}
            description="A scrollable panel with a trapped focus cycle."
            footer={
              <>
                <Button
                  variant="ghost"
                  onClick={() => setDrawerSide(null)}
                >
                  Close
                </Button>
                <Button
                  onClick={() => {
                    setDrawerSide(null);
                    notify.success("Panel action complete");
                  }}
                >
                  Continue
                </Button>
              </>
            }
          >
            <div className="space-y-4">
              <p className="text-sm">
                Use Tab and Shift+Tab to move through the panel controls.
                Press Escape or click the backdrop to close.
              </p>
              <Checkbox
                label="Gift wrap this order"
                description="Includes a handwritten note."
                defaultChecked
              />
              <Checkbox label="Leave at the front desk" />
              <Input
                label="Delivery note"
                placeholder="Ring the bell twice"
              />
            </div>
          </Drawer>
        </Section>

        <Section
          title="Logo"
          description="The wordmark inherits currentColor, so it works on light, yellow and dark surfaces."
        >
          <div className="grid gap-5 sm:grid-cols-3">
            <div className="flex flex-col items-center gap-4 rounded-xl border border-border bg-surface p-6">
              <span className="text-caption font-semibold uppercase text-ink-secondary">
                Light
              </span>
              <Logo variant="full" className="text-ink" />
            </div>
            <div className="flex flex-col items-center gap-4 rounded-xl bg-brand p-6">
              <span className="text-caption font-semibold uppercase text-ink">
                Yellow
              </span>
              <Logo variant="compact" className="text-ink" />
            </div>
            <div className="flex flex-col items-center gap-4 rounded-xl bg-ink p-6">
              <span className="text-caption font-semibold uppercase text-white">
                Dark
              </span>
              <Logo variant="compact" className="text-white" />
            </div>
          </div>

          <div className="mt-5 flex flex-wrap items-center gap-8 rounded-xl border border-border bg-surface p-6">
            <Logo variant="full" className="text-ink" />
            <Logo variant="compact" className="text-ink" />
            <Logo variant="icon" />
          </div>
        </Section>
      </div>
    </div>
  );
}

export default UiKit;
