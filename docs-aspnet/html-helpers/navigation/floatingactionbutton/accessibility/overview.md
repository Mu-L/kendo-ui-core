---
title: Overview
page_title: FloatingActionButton Documentation | FloatingActionButton Accessibility
description: "Get started with the {{ site.product }} FloatingActionButton and learn about its accessibility support for WAI-ARIA, Section 508, and WCAG 2.2."
slug: htmlhelpers_floatingactionbutton_accessibility
position: 1
---

# FloatingActionButton Accessibility





Out of the box, the {{ site.product }} FloatingActionButton provides extensive accessibility support and enables users with disabilities to acquire complete control over its features.


The FloatingActionButton is compliant with the [Web Content Accessibility Guidelines (WCAG) 2.2 AA](https://www.w3.org/TR/WCAG22/) standards and [Section 508](https://www.section508.gov/) requirements, follows the [Web Accessibility Initiative - Accessible Rich Internet Applications (WAI-ARIA)](https://www.w3.org/WAI/ARIA/apg/) best practices for implementing the [keyboard navigation](#keyboard-navigation) for its `component` role, provides options for managing its focus and is tested against the most popular screen readers.

## WAI-ARIA


This section lists the selectors, attributes, and behavior patterns supported by the component and its composite elements, if any.


The FloatingActionButton features two distinct modes of operation: button-only and button-with-menu.

### Button-Only Mode

| Selector | Attribute | Usage |
| -------- | --------- | ----- |
| `.k-fab` | `role=button` or `nodeName=button` | Omitted if the `<button>` DOM element is used. |
|  | `aria-label` or `title` | The attribute must be present when no text is initially visible in the button. |
| `.k-fab.k-disabled` | `aria-disabled=true` | Rendered only when the button is disabled and the `disabled` attribute cannot be used. Applicable for the `<button>` or `<input type="button">` elements. |

### Button-with-Menu Mode


In the button-with-menu mode, the FloatingActionButton must implement the specification for the DropDownButton component.

[DropDownButton accessibility specification]({% slug htmlhelpers_dropdownbutton_accessibility %})

## Resources

[WAI-ARIA Authoring Practices: Navigation Menu Button Example](https://www.w3.org/WAI/ARIA/apg/example-index/menu-button/menu-button-links.html)

## Section 508


The FloatingActionButton is fully compliant with the [Section 508 requirements](http://www.section508.gov/).

## Testing


The FloatingActionButton has been extensively tested automatically with [axe-core](https://github.com/dequelabs/axe-core) and manually with the most popular screen readers.

> To report any accessibility issues, contact the team through the [Telerik Support System](https://www.telerik.com/account/support-center).

### Screen Readers


The FloatingActionButton has been tested with the following screen readers and browsers combinations:

| Environment | Tool |
| ----------- | ---- |
| Firefox | NVDA |
| Chrome | JAWS |
| Microsoft Edge | JAWS |



### Test Example

To test the FloatingActionButton component, refer to the [FloatingActionButton Accessibility Demo](https://demos.telerik.com/{{ site.platform }}/accessibility/floatingactionbutton).

## Keyboard Navigation

For details on how the FloatingActionButton keyboard navigation works, refer to the [FloatingActionButton Keyboard Navigation]({%slug htmlhelpers_floatingactionbutton_keyboardnavigation_aspnetcore%}) article.

## See Also

* [Keyboard Navigation by the FloatingActionButton for {{ site.framework }} (Demo)](https://demos.telerik.com/{{ site.platform }}/floatingactionbutton/keyboard-navigation)
* [Keyboard Navigation by the FloatingActionButton for {{ site.framework }}]({% slug htmlhelpers_floatingactionbutton_keyboardnavigation_aspnetcore %})
* [Accessibility in {{ site.product }}]({%slug overview_accessibility%})