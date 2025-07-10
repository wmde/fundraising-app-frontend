The combobox is used to provide suggestions in a list alongside a text field that the donor can use for suggested values to fill the field.
This component is a tough one to get working well and accessible so tackle one of these at your own peril. At the very least you'll need to have a
lot of unit and acceptance tests.

## Controls and Features

When the donor is focusing the box a filtered set of suggestions should appear as a dropdown. The following controls should be implemented:

- When the field is focused a list should appear.
- As the donor types the list of items should be filtered using the value in the input.
- Pressing the arrow keys selects an item in the list, it does not change the value in the input box.
- If the list has a scroll bar, focusing on an item that is outside the visible area should make the scroller scroll until it becomes fully visible. 
- When a list item is selected pressing Enter or Tab fills the input with the value and closes the dropdown.
  - In this state more input causes the dropdown to reappear if there are suggestions.

## Web Standards

- The input box should have `role="combobox"`. This tells the browser that the input controls another element.
- The scrollable dropdown container should have `role="listbox"` to tell the browser that this is similar to a select list.
- The scrollable dropdown container should also have an `aria-label="[THE TYPE OF THING IN THE LIST]"` to tell the browser what the list contains.
- The buttons inside the scrollable should have `role="option"`. This announces that this item is similar to a select option.
- The input box should have `aria-expanded="true"` or `aria-expanded="false"` set depending on if the dropdown is visible.
- Each dropdown item should have a unique ID, and when the donor is navigating the dropdown with the arrow keys the input should have `aria-activedescendant="[CURRENT DROPDOWN SELECTED ITEM ID]"`. This tells the browser what the current active element in the popup is.
- The current selected dropdown item should have `aria-selected="true"` to indicate the item in the list that is currently selected.
