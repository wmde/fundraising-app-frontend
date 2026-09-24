A button that can be clicked to copy its contents,
briefly flashing a “copied” popup to show that the copy took place.

## Web Standards

The popup uses `aria-live="assertive"` to announce to assistive technology that the copy happened.
For this to work, the popup must always be present;
when we don’t want it to show up, we disable its visibility and make its contents empty.
We must not use `display: none;`.
