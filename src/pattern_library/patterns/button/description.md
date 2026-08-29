Buttons come in 2 sizes (regular and small) and 2 types (primary and secondary). The `.button` class can be applied to links and button elements.

## Web Standards

We have styles for disabled buttons, but you should look really hard for alternatives before you use them because disabled buttons are very difficult to make accessible. Usually
it's better to leave a button enabled and provide feedback to a donor when they press it.

## Exceptions

| Exception | Attribute                       | Description                                    |
|-----------|---------------------------------|------------------------------------------------|
| Secondary | `data-secondary`                | Use this to apply the secondary button styling |
| Size      | `data-size="small"`             | Use this to apply the small button styling     |
| Disabled  | `disabled aria-disabled="true"` | Use this to apply the disabled button styling  |


