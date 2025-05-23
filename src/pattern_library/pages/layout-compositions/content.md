These are flexible, compositional layouts that follow the [CUBE CSS composition principles](https://cube.fyi/composition.html).

## Configuration

If you want to change the value of a custom property, you can either set a value in your context, or target the composition itself (E.G `.sidebar`) for extra specificity.

The default values are fallbacks for custom properties, so are easily overridden.

### Gutters and Spacing

All compositions use a consistent `--gutter` Custom Property to manage spacing between items. You can set a value for this in context, just like in the configuration section above.

### Justification and alignment

Each composition has a vertical and horizontal alignment Custom Property **if applicable**.

## Flow

`.flow`

The flow utility provides flow and rhythm between direct sibling elements. Where `--flow-space` is not defined: the default value is 1em, which equals the font size of the affected element.

[More info](https://piccalil.li/blog/my-favourite-3-lines-of-css/)

### Configuration

| Property       | Default value | Description                               |
|----------------|---------------|-------------------------------------------|
| `--flow-space` | `1em`         | This defines the space between each item. |

```html
<h3>Example</h3>
<article class="flow">
	<p>
		Nullam id dolor id nibh ultricies vehicula ut id elit. Nulla vitae elit
		libero, a pharetra augue.
	</p>
	<p>
		Nulla vitae elit libero, a pharetra augue. Cras justo odio, dapibus ac
		facilisis in, egestas eget quam.
	</p>
	<p style="--flow-space: 3em">
		<code>--flow-space</code> set with an inline style to <code>3em</code>: <code>style="--flow-space: 3em"</code>
	</p>
</article>
```

## Grid

`.grid`

A flexible layout that will create an auto-fill grid with configurable grid item sizes.

### Configuration

| Property               | Default value    | Description                                                                  |
|------------------------|------------------|------------------------------------------------------------------------------|
| `--gutter`             | `var(--space-l)` | This defines the space between each item.                                    | 
| `--grid-min-item-size` | `16rem`          | How large each item should be, as a minimum                                  |
| `--grid-placement`     | `auto-fill`      | Set either auto-fit or auto-fill to change how empty grid tracks are handled |

### Exceptions

| Exception | Attribute              | Description                                                  |
|-----------|------------------------|--------------------------------------------------------------|
| Thirds    | `data-layout="thirds"` | Where possible, the layout will be a three column grid.      |
| Halves    | `data-layout="50-50"`  | Where possible, the layout will be a two column, 50-50 grid. |

### Examples

```html
<div class="grid">
	<div>Item 1</div>
	<div>Item 2</div>
	<div>Item 3</div>
	<div>Item 4</div>
	<div>Item 5</div>
	<div>Item 6</div>
	<div>Item 7</div>
	<div>Item 8</div>
</div>
```

## Cluster

`.cluster`

A layout that lets you distribute items with consistent spacing, regardless of their size.

### Configuration

| Property                         | Default value    | Description                                                                                                                                                                                         |
|----------------------------------|------------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `--gutter`                       | `var(--space-m)` | This defines the space between each item.                                                                                                                                                           |
| `--cluster-horizontal-alignment` | `flex-start`     | How items should align horizontally. Can be any acceptable [flexbox alignment value.](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Flexible_Box_Layout/Aligning_Items_in_a_Flex_Container). |
| `--cluster-vertical-alignment`   | `center`         | How items should align vertically. Can be any acceptable [flexbox alignment value.](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Flexible_Box_Layout/Aligning_Items_in_a_Flex_Container).   |

### Examples

```html
<div class="cluster">
	<div>Item 1</div>
	<div>Item 2</div>
	<div>Item 3</div>
	<div>Item 4</div>
	<div>Item 5</div>
	<div>Item 6</div>
	<div>Item 7</div>
	<div>Item 8</div>
</div>
```

## Repel

A little layout that pushes items away from each other where there is space in the viewport and stacks on small viewports.

`.repel`

| Property                     | Default value    | Description                                                                                                                                                                                       |
|------------------------------|------------------|---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `--gutter`                   | `var(--space-l)` | This defines the space between items.                                                                                                                                                             |
| `--repel-vertical-alignment` | `center`         | How items should align vertically. Can be any acceptable [flexbox alignment value.](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Flexible_Box_Layout/Aligning_Items_in_a_Flex_Container). |

### Examples

```html
<div class="repel">
	<div>Item 1 repels item 2</div>
	<div>Item 2 repels item 1</div>
</div>
```

## Sidebar

`.sidebar`

A layout that allows you to have a flexible main content area and a "fixed" width sidebar that sits on the left or right. If there is not enough viewport space to fit both the sidebar width _and_ the main content minimum width, they will stack on top of each other

### Configuration

| Property                      | Default value      | Description                                                  |
|-------------------------------|--------------------|--------------------------------------------------------------|
| `--gutter`                    | `var(--space-s-l)` | This defines the space between the sidebar and main content. |
| `--sidebar-target-width`      | `20rem`            | How large the sidebar should be                              |
| `--sidebar-content-min-width` | `50%`              | The minimum size of the main content area                    |

### Exceptions

| Exception                        | Description                                                                                        |
|----------------------------------|----------------------------------------------------------------------------------------------------|
| `.sidebar[data-direction='rtl']` | Flips the sidebar to be on the right.                                                              |
| `.sidebar[data-reversed]`        | Switches the flex direction so you can maintain content ordering while visually appearing flipped. |

### Examples

A standard sidebar.

```html
<div class="sidebar">
	<div>I am the sidebar</div>
	<div class="flow">
		<h4>I am the content</h4>
		<p>Etiam porta sem malesuada magna mollis euismod. Cras mattis consectetur purus sit amet fermentum.</p>
		<p>Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Vestibulum id ligula porta felis euismod semper.</p>
	</div>
</div>
```

## Switcher

`.switcher`

A layout that allows you to lay **2** items next to each other until there is not enough horizontal space to allow that.

### Configuration

| Property                            | Default value    | Description                                                                                                                                                                                      |
|-------------------------------------|------------------|--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `--gutter`                          | `var(--space-l)` | This defines the space between each item                                                                                                                                                         |
| `--switcher-vertical-alignment`     | `flex-start`     | How items should align vertically. Can be any acceptable [flexbox alignment value.](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Flexible_Box_Layout/Aligning_Items_in_a_Flex_Container) |
| `--switcher-target-container-width` | `40rem`          | How large the container needs to be to allow items to sit inline with each other                                                                                                                 |

### Examples

```html
<div class="switcher">
	<div>Item 1</div>
	<div>Item 2</div>
</div>
```

## Wrapper

`.wrapper`

A horizontally centered wrapper that provides a consistent central column.

This should be used in all contexts where the content needs to be in the center of the page.

### Examples

```html
<div class="wrapper">I am centered and have a nice, consistent gutter.</div>
```