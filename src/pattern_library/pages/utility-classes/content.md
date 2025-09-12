## Footer Bottom

We want the footer to always be displayed on the bottom of the page, even when the content is too short to push it all the way down. We manage this with:

1. Wrap the content in a flex container set to height `min-height: calc(100vh - var(--navigation-height) - var(--gutter))` (Viewport height minus the height of the fixed navigation and one gutter, because that's the padding we need at the top). 
2. Set the content container to `flex-grow: 1` so it will expand and push the footer to the bottom.

```html
<div class="footer-bottom">
    <header>Nav, I am fixed position and a set height</header>
    <main class="footer-bottom__stretch">I am the main content and I stretch</main>
    <footer>I need to be at the bottom on short pages</footer>
</div>
```

## Link Button

Sometimes we want a button to look like a link.

```html
<button class="link-button">Calculate your IBAN</button>
```

## Sticky

We use this to make the sidebar content stay on screen when a donor scrolls the page. We set the top property to `calc(var(--gutter) + var(--navigation-height))` (again the fixed navigation height).

```html
<div class="sticky flow">
    <div class="content-card flow" data-sidebar-card>
        I am a sidebar card
    </div>
</div>
```

## Stretch Single Content Card

When we have short pages, like a 404 or an error the main content is shorter than the sidebar and looks weird. This makes a content card that's an only child stretch vertically and fill the space.

```html
<div class="stretch-single-content-card">
    <div class="content-card">
        I will fill the available vertical space
    </div>
</div>
```

## Visually hidden

If you hide an element with `display: none`, it will also hide it from assistive technology, such as screen readers. This utility allows you to get the effect of `display: none`, without the screen reader issues.

```html
<p class="visually-hidden">
    You can’t see me, but a screen reader can still access me
</p>
```
