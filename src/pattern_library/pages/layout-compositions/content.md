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

<div class="content-wrapper">I am centered and have a nice, consistent gutter.</div>
```

## Flex Field Group

This is used when we want to array fields horizontally but also allow them to stack when needed on small screens. You can see it used extensively in the [Compact Form Sample](/pattern-library/compact-donation-form).

### Examples

It contains some sub-layout options, to allow some flexibility with the layouts.

#### `.flex-field-group__stretch`

This will make one field stretch and fill all the space available.

```html
<fieldset class="field-container flow">
	<legend>Form of address</legend>
	<div class="cluster">
		<div>
			<label>
				<input type="radio" name="salutation" id="salutation-mr"><span>Mr</span>
			</label>
		</div>
		<div>
			<label>
				<input type="radio" name="salutation" id="salutation-ms"><span>Ms</span>
			</label>
		</div>
	</div>
</fieldset>
<div class="field-container flow flex-field-group__stretch">
	<label for="country">Title</label>
	<select name="title" id="title">
		<option value="ie">No Title</option>
		<option value="de">Dr.</option>
		<option value="fr">Prof.</option>
		<option value="be">Prof. Dr.</option>
	</select>
</div>
```
#### `.flex-field-group__mini-field`
When you want one field in the row to be smaller than the others, eg for a postcode.

```html
<div class="flex-field-group">
	<div class="field-container flow">
		<label for="country">Country</label>
		<select name="country" id="country">
			<option value="ie">Ireland</option>
		</select>
	</div>

	<div class="field-container flow flex-field-group__mini-field">
		<label for="postcode">Postcode</label>
		<input type="text" name="postcode" id="postcode" placeholder="e.g., 25950">
	</div>

	<div class="field-container flow">
		<label for="city">City</label>
		<input type="text" name="city" id="city" placeholder="e.g., Berlin">
	</div>
</div>
```
#### `.flex-field-group__sidebar-field and .flex-field-group__sidebar-field-sidebar`
When you want a small fixed width field next to a stretched one, eg for a street name and number combo. It can be used in conjunction with the nowrap extension.

```html
<div class="flex-field-group" data-nowrap>
	<div class="field-container flow flex-field-group__sidebar-field">
		<label for="street">Street Name</label>
		<input type="text" name="street" id="street" placeholder="e.g., Sesame">
	</div>

	<div class="field-container flow flex-field-group__sidebar-field-sidebar">
		<label for="building-number">No</label>
		<input type="text" name="building-number" id="building-number" placeholder="e.g., 42">
	</div>
</div>
```

### Exceptions

| Exception               | Description                                                    |
|-------------------------|----------------------------------------------------------------|
| `.sidebar[data-nowrap]` | Use this when you want to prevent a field group from wrapping. |
