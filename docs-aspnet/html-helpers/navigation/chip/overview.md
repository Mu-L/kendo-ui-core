---
title: Overview
page_title: Chip Overview
description: "Discover the Telerik UI Chip component for {{ site.framework }} that provides icons and a roster of appearances."
slug: htmlhelpers_chip_aspnetcore_overview
position: 0
---

# Chip Overview

{% if site.core %}
The Telerik UI Chip TagHelper and HtmlHelper for {{ site.framework }} are server-side wrappers for the Kendo UI Chip component.
{% else %}
The Telerik UI Chip HtmlHelper for {{ site.framework }} is a server-side wrapper for the Kendo UI Chip component.
{% endif %}

The Chip is a compact element that represents an input, attribute, or action. The component enables user input and verifies that input by converting text into chips.

The component can be clicked or removed, and supports various styling options. The Chip is commonly used in email templates where each chip corresponds to a single person.

* [Demo page for the Chip](https://demos.telerik.com/{{ site.platform }}/chip/index)

![Telerik UI Chip for {{ site.framework }} with Basic Configuration](./images/chip-basic.png)

## Initializing the Chip

The following example demonstrates how to initialize the Chip.

```HtmlHelper
     @(Html.Kendo().Chip()
            .Name("chip")
            .Label("Chip")
    )
```
{% if site.core %}
```TagHelper
    @addTagHelper *, Kendo.Mvc

    <kendo-chip name="chip"
                label="Chip">
    </kendo-chip>
```
{% endif %}

## Functionality and Features

* [Appearance]({% slug htmlhelpers_chip_aspnetcore_appearance %})&mdash;The Chip delivers a number of ready-to-use, predefined sets of styling options.
* [Customization]({% slug htmlhelpers_chip_aspnetcore_customization %})&mdash;You can add a **Select** or **Remove** custom icon to the Chip as well as display avatars in it.
* [Accessibility]({% slug htmlhelpers_chip_accessibility %})&mdash;The Chip is accessible for screen readers, supports WAI-ARIA attributes, and delivers [keyboard shortcuts]({% slug keynav_aspnetcore_chip %}) for faster navigation.

>tip To learn more about the appearance, anatomy, and accessibility of the Chip, visit the [Progress Design System documentation](https://www.telerik.com/design-system/docs/components/chip/)—an information portal offering rich component usage guidelines, descriptions of the available style variables, and globalization support details.

## Next Steps

* [Getting Started with the Chip for {{ site.framework }}]({% slug chip_getting_started %})
* [Basic Usage of the Chip HtmlHelper for {{ site.framework }} (Demo)](https://demos.telerik.com/{{ site.platform }}/chip/index)
* [Server-Side API of the Chip HtmlHelper for {{ site.framework }}](/api/chip)
* [JavaScript API Reference of the Chip HtmlHelper for {{ site.framework }}](https://docs.telerik.com/kendo-ui/api/javascript/ui/chip#methods)


## See Also

* [Applying the Chip API (Demo)](https://demos.telerik.com/{{ site.platform }}/chip/api)
* [Basic Events in the Chip (Demo)](https://demos.telerik.com/{{ site.platform }}/chip/events)
