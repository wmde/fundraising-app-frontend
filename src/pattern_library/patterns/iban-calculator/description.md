When a donor selects direct debit we give them the option to generate their IBAN using their bank account number and their Bank Code.

## Controls and Features

- When the calculator is opened the first step should made visible and be focused.
- When the form is submitted the buttons should change to a loading spinner.
- When the result is found the second step should be made visible and be focused.
- When the donor picks yes on step 2 the IBAN field should be filled, and be focused, and the calculator hidden.
- When the donor picks no on step 2 the first step should be made visible and be focused.

## Web Standards

- The button used to toggle the display of the calculator should have `aria-expanded="true"` and `aria-expanded="false"` depending on if the calculator is visible.
- The buttons should have `aria-controls="[ID OF THE CALCULATOR PANEL]"` to expose the element that the button expands.
- Both steps should have `tabindex="-1"` to allow them to be focusable by code, and an `aria-labelledby="[THIS STEP TITLE ID]"` to give them a label when they get focused.
- The steps should be set to `inert="true"` and `aria-hidden="true"` when the other step is active in order to stop tabbing and screen readers getting focus.
