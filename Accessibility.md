# Accessibility Guidelines for Required / Optional Form Fields

This document presents accessibility best practices and usability research about indicating required vs optional fields 
in forms.

There are multiple schools of thought on this topic! Let's go through them one by one. 


## Form-level message
Place a short message at the top explaining convention (e.g. “Fields are required unless marked optional”)

`+` Providing such instruction before the `<form>` element ensures that it is read aloud by screen readers before they 
switch to “Forms Mode”. <br>
(https://www.w3.org/WAI/tutorials/forms/instructions/#:~:text=Where%20relevant%2C%20provide,to%20%E2%80%9CForms%20Mode%E2%80%9D.)

`-` People don’t read instructions at the top of forms. Form fields seem self-sufficient — after all, each field has a 
specific instruction — its label, why would you need to read anything else to fill it in? <br> 
(https://www.nngroup.com/articles/required-fields/#:~:text=People%20don%E2%80%99t%20read%20instructions%20at%20the%20top%20of%20forms.)

`-` Even if people read instructions, they may forget them. Even if people don’t forget the instruction, you’re 
increasing their cognitive load by having them commit it to their working memory. <br>
(https://www.nngroup.com/articles/required-fields/#:~:text=Even%20if%20people%20read%20instructions%2C%20they%20may%20forget%20them.)

`-` People have to scan the form to determine if the field is required. <br>
(https://www.nngroup.com/articles/required-fields/#:~:text=People%20have%20to%20scan%20the%20form%20to%20determine%20if%20the%20field%20is%20required.)


## Use of asterisks

`+` The asterisk (*) has become a de facto standard in the industry. <br>
(https://medium.com/%40vicentegrafico.com/consistency-in-mandatory-fields-emphasis-on-asterisk-convention-ff42bcc5fe06)

`-` Ambiguous to screen reader users (they may be read as “star” or skipped if the screen reader is NOT configured to 
announce punctuation marks and typographic symbols). <br>
(https://www.tpgi.com/doing-whats-required-indicating-mandatory-fields-in-an-accessible-way/)

`-` The GOV.UK Design System explicitly recommends not marking required fields with asterisks, but instead marking 
optional ones <br>
(https://design-system.service.gov.uk/patterns/question-pages/#:~:text=Never%20mark%20mandatory%20fields%20with%20asterisks.)

`*` Best way to use asterisk: <br>

(https://accessibility.huit.harvard.edu/technique-required-fields#:~:text=text%22%20id%3D%22email%22%20/%3E-,%E2%9C%93%20Good%20example,-In%20this%20example)<br>
In this example, the aria-required attribute is placed on the form field itself, meaning that “required” will be read 
when the control has focus. In addition, the redundant “star” is hidden from screen readers by placing it inside a 
`<span>` with aria-hidden="true". Content in a DOM tree with an aria-hidden="true" attribute is ignored by screen readers.

```
<label for="email">Your email <span aria-hidden="true">*</span></label>
<input type="text" id="email" aria-required="true" />
```

## Marking optional fields

`+` The UK Parliament Design System guidance states: You should not need to highlight required fields. Instead, 
highlight any fields that are optional by including ‘(optional)’ at the end of the label or legend text. <br>
(https://designsystem.parliament.uk/how-tos/designing-forms/#:~:text=By%20default%2C%20questions,confusing%20to%20users.)

`+` Marking the optional fields does lighten the user’s cognitive load <br>
(https://www.nngroup.com/articles/required-fields/#:~:text=form%20for%20everybody.-,Should%20You%20Mark%20the%20Optional%20Fields%2C%20Too%3F,-While%20it%E2%80%99s%20not)

## Add required/optional info to `aria-describedby`

`+` The aria-describedby attribute is used to associate additional descriptive information with a form field or user 
interface element. It references the ID(s) of one or more elements that contain supplementary text, such as hints, help 
messages, or error messages.

When a screen reader user focuses on the element, it reads the element’s label (from `<label>`or `aria-label`) and the 
content of the elements referenced in `aria-describedby`, providing a richer and more informative experience.

`*` Example:
```
<label for="email">
  Email address <span aria-hidden="true">*</span>
  <span class="visually-hidden">required</span>
</label>
<input
  id="email"
  name="email"
  type="email"
  aria-required="true"
  aria-describedby="email-hint"
/>
<span id="email-hint">We’ll use this to send you the receipt.</span>
```
Screen readers will announce: “Email address, edit text, required, We’ll use this to send your receipt.”

## Baymard Institute's research on marking required and optional fields in E-Commerce checkouts

(https://baymard.com/blog/required-optional-form-fields) <br>
The research highlights the importance of explicitly marking both required and optional fields in e-commerce checkout 
forms.

`-` User Confusion: Failing to mark required and optional fields explicitly leads to unnecessary validation errors, 
user confusion over which fields to complete, and a slower checkout process. <br>
`-` Mobile Experience: On mobile devices, 75% of users experienced severe usability issues due to unclear marking of 
required and optional fields.
- Recommendations:<br>
  `+` Explicit Marking: Clearly denote both required and optional fields to provide users with the information they need 
  to complete the form efficiently. <br>
  `-` Avoid Generic Statements: Refrain from using vague statements like "All fields required" without specifying which 
  fields are optional. (as many users during testing overlooked these types of statements and would begin speculating 
  whether some of the required fields were in fact optional.)

## Unique way of _Designsystemet_
(https://designsystemet.no/en/patterns/required-and-optional-fields/#3-when-we-must-have-a-combination-of-mandatory-and-optional-fields) <br>
`+` A combination of mandatory and optional fields in the form is not ideal! But if we must include optional fields in 
addition to mandatory ones, we should mark each field individually. Then we don't need to inform at the top. <br>
`+` Clearly inform with the tag "Must be filled out" or "Optional" after each question/label. <br>
`+` Use a yellow tag for "Must be filled out" and a blue one for optional, for example. <br>
`-` Don't use the words "Mandatory" or "Required". <br>
`-` Don't use an asterisk to mark fields that must be filled out. <br>

# Learnings:

Q: Whether to mark required or optional fields (or both)? <br>
A: It is best to mark both of them. <br>
[As recommended by _Designsystemet_ - using different colors for required and optional fields is also a good idea, it 
helps users to differentiate them better. Ex. A yellow tag for "Must be filled out" and a blue one for "optional".] 

Q: Where/how to place explanatory messages? <br>
A: Clearly write "Must be filled out" or "Optional" after each question/label.

Q: How to expose “required/optional” status programmatically (for screen readers)? <br>
A: Use `aria-required` and `aria-describedby`