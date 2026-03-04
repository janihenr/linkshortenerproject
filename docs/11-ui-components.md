# UI Components Guide

## shadcn/ui Component System

**CRITICAL RULE**: This application uses **shadcn/ui components exclusively**. Do NOT create custom UI components.

## Component Philosophy

- ✅ **Always use shadcn/ui components** from the library
- ✅ Customize shadcn components using Tailwind classes
- ✅ Compose shadcn components together for complex UIs
- ❌ **Never create custom buttons, inputs, modals, etc.**
- ❌ Do not recreate components that shadcn provides

## Available shadcn/ui Components

### Installation

Install components as needed:

```bash
npx shadcn@latest add button
npx shadcn@latest add input
npx shadcn@latest add card
npx shadcn@latest add dialog
npx shadcn@latest add form
npx shadcn@latest add select
npx shadcn@latest add toast
```

### Core Components to Use

**Forms & Inputs**:
- `Button` - All button interactions
- `Input` - Text inputs
- `Textarea` - Multi-line text
- `Select` - Dropdowns
- `Checkbox` - Checkboxes
- `RadioGroup` - Radio buttons
- `Switch` - Toggle switches
- `Label` - Form labels

**Layout**:
- `Card` - Content containers
- `Separator` - Dividers
- `Tabs` - Tab navigation
- `Sheet` - Side panels
- `ScrollArea` - Scrollable areas

**Feedback**:
- `Dialog` - Modals and dialogs
- `Toast` - Notifications
- `Alert` - Alert messages
- `Progress` - Progress bars
- `Skeleton` - Loading states

**Navigation**:
- `NavigationMenu` - Navigation bars
- `Breadcrumb` - Breadcrumbs
- `Pagination` - Pagination controls

## Usage Examples

### Button Component

```typescript
import { Button } from "@/components/ui/button";

export function ButtonExample() {
  return (
    <>
      <Button>Default Button</Button>
      <Button variant="destructive">Delete</Button>
      <Button variant="outline">Outline</Button>
      <Button variant="ghost">Ghost</Button>
      <Button size="sm">Small</Button>
      <Button size="lg">Large</Button>
    </>
  );
}
```

### Form with Input

```typescript
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function FormExample() {
  return (
    <form>
      <div className="space-y-2">
        <Label htmlFor="url">URL</Label>
        <Input 
          id="url"
          type="url" 
          placeholder="https://example.com"
        />
      </div>
      <Button type="submit" className="mt-4">
        Submit
      </Button>
    </form>
  );
}
```

### Card Layout

```typescript
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export function CardExample() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Create Short Link</CardTitle>
        <CardDescription>Convert your long URL to a short link</CardDescription>
      </CardHeader>
      <CardContent>
        {/* Form content here */}
      </CardContent>
    </Card>
  );
}
```

### Dialog/Modal

```typescript
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

export function DialogExample() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>Open Dialog</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Confirm Delete</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete this link?
          </DialogDescription>
        </DialogHeader>
        {/* Dialog actions */}
      </DialogContent>
    </Dialog>
  );
}
```

### Toast Notifications

```typescript
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";

export function ToastExample() {
  const { toast } = useToast();

  return (
    <Button
      onClick={() => {
        toast({
          title: "Link created!",
          description: "Your short link is ready to share.",
        });
      }}
    >
      Show Toast
    </Button>
  );
}
```

## Customization Guidelines

### Using Variants

shadcn components come with built-in variants:

```typescript
// Button variants
<Button variant="default">Default</Button>
<Button variant="destructive">Destructive</Button>
<Button variant="outline">Outline</Button>
<Button variant="secondary">Secondary</Button>
<Button variant="ghost">Ghost</Button>
<Button variant="link">Link</Button>

// Button sizes
<Button size="default">Default</Button>
<Button size="sm">Small</Button>
<Button size="lg">Large</Button>
<Button size="icon">Icon Only</Button>
```

### Tailwind Customization

Extend with Tailwind classes:

```typescript
<Button className="bg-gradient-to-r from-blue-500 to-purple-600">
  Gradient Button
</Button>

<Card className="border-2 border-blue-500 shadow-xl">
  <CardContent>Custom styled card</CardContent>
</Card>
```

### Composition Pattern

Build complex UIs by composing components:

```typescript
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

export function LinkCreator() {
  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Create Short Link</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="url">Original URL</Label>
            <Input id="url" type="url" />
          </div>
          <Button className="w-full">Create Link</Button>
        </div>
      </CardContent>
    </Card>
  );
}
```

## Component Location

shadcn components are installed in:
```
app/components/ui/
├── button.tsx
├── input.tsx
├── card.tsx
├── dialog.tsx
└── ...
```

## Adding New Components

When you need a new UI element:

1. **Search shadcn/ui** - Check if the component exists
2. **Install it** - Run `npx shadcn@latest add [component-name]`
3. **Import and use** - Import from `@/components/ui/[component-name]`
4. **Customize** - Use variants and Tailwind classes

```bash
# Example: Adding a new component
npx shadcn@latest add dropdown-menu
```

## Common Patterns

### Loading States

```typescript
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

<Button disabled={isLoading}>
  {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
  {isLoading ? "Creating..." : "Create Link"}
</Button>
```

### Form Validation

```typescript
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

<div className="space-y-2">
  <Label htmlFor="url" className={error ? "text-red-500" : ""}>
    URL {error && <span className="text-xs">- {error}</span>}
  </Label>
  <Input
    id="url"
    className={error ? "border-red-500" : ""}
    aria-invalid={!!error}
  />
</div>
```

### Responsive Design

```typescript
<Card className="w-full md:w-1/2 lg:w-1/3">
  <CardContent className="p-4 md:p-6">
    {/* Content adapts to screen size */}
  </CardContent>
</Card>
```

## Icons with lucide-react

Use lucide-react icons with shadcn components:

```typescript
import { Copy, ExternalLink, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";

<Button variant="outline" size="icon">
  <Copy className="h-4 w-4" />
</Button>

<Button variant="ghost">
  <ExternalLink className="mr-2 h-4 w-4" />
  Visit
</Button>
```

## Resources

- **shadcn/ui Documentation**: https://ui.shadcn.com
- **Component Library**: https://ui.shadcn.com/docs/components
- **Themes**: https://ui.shadcn.com/themes
- **Examples**: https://ui.shadcn.com/examples

## Key Reminders

1. ✅ Use shadcn/ui for ALL UI elements
2. ✅ Install components with `npx shadcn@latest add [name]`
3. ✅ Customize using Tailwind classes
4. ✅ Compose components for complex UIs
5. ❌ Never create custom buttons, inputs, modals from scratch
6. ❌ Don't reinvent what shadcn provides
